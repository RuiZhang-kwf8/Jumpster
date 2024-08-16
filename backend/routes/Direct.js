const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();


router.post('/', async (req, res) => {
    try {        
        const newSimulation = new Simulations({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            time: new Date(req.body.time),
            outputKmlFileName: req.body.outputKmlFileName,
            outputPdfFileName: req.body.outputPdfFileName,
            outputTiffFileName: req.body.outputTiffFileName,
            outputKmlLegendFileName: req.body.outputKmlLegendFileName,
            outputTiffLegendFileName: req.body.outputTiffLegendFileName
            
        });
        
        await newSimulation.save();
        res.status(200).json({ message: 'Simulation created successfully' });
        
        

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    });
    module.exports = router;