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

        const command2 = `cd ~/Downloads/build/src/fetch_dem`;        

        exec(command2, (error, stdout, stderr) => {
            if (error) {
                console.log("all bad"); 
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {

                console.log("all bad"); 
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        }); 
        console.log("all good"); 

        const command1 = `./fetch_dem --bbox ${req.body.longitude} ${req.body.latitude} 0.01 0.01 --src gmted output.tif`;        

        exec(command1, (error, stdout, stderr) => {
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
        // Fetch data from OpenTopography API
        console.log("first finished"); 
        const command = `WindNinja_cli ./exampleElevfile.cfg --elevation_file output.tif --output_path ./routes`;        
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
