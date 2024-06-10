const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');

router.get('/', async (req, res) => {

    const simulations = await Simulations.find();
    
    res.json(simulations);
});

router.post('/', async (req, res) => {
    try {
        console.log(req.body); 
        const { latitude, longitude, name } = req.body;
        const url = `https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&south=${latitude}&north=${latitude + 0.1}&west=${longitude}&east=${longitude + 0.25}&outputFormat=GTiff&API_Key=221b3a8f1a87c610caa4305b50dfea5d`; 
        // Fetch data from OpenTopography API
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Connection': 'Keep-Alive',
                'Content-Type': 'application/octet-stream'
            }
        });

        if (!response.ok) {
            alert('Failed to fetch data from OpenTopography API');
        }

        if (response.ok) {
            alert('Good!');
        }
        
        // Assuming response is a stream
        const dest = fs.createWriteStream('output.tif');
        response.body.pipe(dest);

        // Respond to the client
        res.json({ message: 'File saved successfully' });
        const tiffData = fs.readFileSync('output.tif', { encoding: 'base64' });
        const command = 'WindNinja_cli ~/Downloads/windninja/data/bigbutte_test_nodust.cfg';
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        });
        
        // Save simulation data to database if needed
        const newSimulation = new Simulations({
            ...req.body,
            tiffData: tiffData
        }); 
        
        await newSimulation.save();

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
