const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fs = require('fs');

router.get('/', async (req, res) => {
    const simulations = await Simulations.find();

    res.json(simulations);
});

router.post('/', async (req, res) => {
    try {
<<<<<<< HEAD
        const url = `https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&south=${req.body.latitude}&north=${req.body.latitude + 0.1}&west=${req.body.longitude}&east=${req.body.longitude + 0.25}&outputFormat=GTiff&API_Key=221b3a8f1a87c610caa4305b50dfea5d`; 
=======
       
        const url = 'https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&south=${req.body.latitude}&north=${req.body.latitude + 0.1}&west=${req.body.longitude}&east=${req.body.longitude + 0.25}&outputFormat=GTiff&API_Key=221b3a8f1a87c610caa4305b50dfea5d'; 
>>>>>>> 65668d6a4e3f38b57aacb27e55d76b09d426f60f
        // Fetch data from OpenTopography API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from OpenTopography API');
        }

        // Assuming response is a stream
        const dest = fs.createWriteStream('output.tif');
        response.body.pipe(dest);

        // Respond to the client
        res.json({ message: 'File saved successfully' });
        const tiffData = fs.readFileSync('output.tif', { encoding: 'base64' });

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
