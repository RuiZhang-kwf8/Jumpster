const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');



router.get('/', async (req, res) => {

    const simulations = await Simulations.find().select({ name: 1, latitude: 1, longitude: 1 });


    res.json(simulations);
});

router.post('/', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const path = (await import('path')).default;
        const url = `https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&south=${Number(req.body.latitude)}&north=${Number(req.body.latitude) + 0.01}&west=${Number(req.body.longitude)}&east=${Number(req.body.longitude + 0.01)}&outputFormat=GTiff&API_Key=221b3a8f1a87c610caa4305b50dfea5d`; 
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
        

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

          

        const arrayBuffer = await response.arrayBuffer();
        console.log('ArrayBuffer length:', arrayBuffer.byteLength);

        const buffer = Buffer.from(new Uint8Array(arrayBuffer));
        console.log('Buffer length:', buffer.length);

        const outputFilePath = path.join(__dirname, 'output.tif');
        console.log('Output file path:', outputFilePath);

        fs.writeFileSync(outputFilePath, buffer);
        console.log(`Data saved to ${outputFilePath}`);


        // Save simulation data to database if needed
        const newSimulation = new Simulations({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude
        }); 
        
        await newSimulation.save();


        console.log("request completed");

}
catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
module.exports = router;
