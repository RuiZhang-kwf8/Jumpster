const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


router.get('/', async (req, res) => {
    const simulations = await Simulations.find().select({ name: 1, latitude: 1, longitude: 1 });

    res.json(simulations);
});

router.post('/', async (req, res) => {
    try {

        const fetch = (await import('node-fetch')).default;

        const path = (await import('path')).default;
        const northbound = Number(req.body.latitude) + .01;
        const southbound = Number(req.body.latitude) - .01;
        const eastbound = Number(req.body.longitude) + .01;
        const westbound = Number(req.body.longitude) - .01;
        const command2 = `cd ~/Firelab/Windninja/build/src/fetch_dem && ./fetch_dem --bbox ${northbound} ${eastbound} ${southbound} ${westbound} --src gmted output.tif`;        
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
        await sleep(1000);
        
        const command = `WindNinja_cli ~/Jumpster/Jumpster/backend/routes/exampleElevfile.cfg --elevation_file ~/Firelab/Windninja/build/src/fetch_dem/output.tif --output_path ~/Jumpster/Jumpster/backend/outputs`;        
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

        await sleep(100);

        const output = '';
        const command3 = `cd ../outputs && source ./convert_kmz_to_kml.sh`;        
        exec(command3, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            output = stdout.trim(); 
        });
        
        // Save simulation data to database if needed
        const newSimulation = new Simulations({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
<<<<<<< HEAD
            time: new Date(req.body.time)
        }); 
=======
            outputFileName: output
        });
>>>>>>> 27ec0f160b00a0f37a83db2b5c97539f23be45a2
        
        await newSimulation.save();


        console.log("request completed");

}
catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
module.exports = router;
