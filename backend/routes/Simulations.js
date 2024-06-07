const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');

router.get('/', async (req, res) => {
    const simulations = await Simulations.find();

    res.json(simulations);
});

router.post('/', async (req, res) => {
    try {
        const url = 'https://portal.opentopography.org/API/globaldem?demtype=SRTMGL1&south=${req.body.latitude}&north=${req.body.latitude + 0.1}&west=${req.body.longitude}&east=${req.body.longitude + 0.25}&outputFormat=GTiff&API_Key=221b3a8f1a87c610caa4305b50dfea5d'; 
        // Fetch data from OpenTopography API
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Example of specifying content type
                'Authorization': 'Bearer your_access_token' // Example of including an authorization token
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
