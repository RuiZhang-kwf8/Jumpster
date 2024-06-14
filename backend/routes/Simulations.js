const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const AdmZip = require('adm-zip');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function listAllFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            resolve(files);
        });
    });
}

function listKmlFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const kmlFiles = files.filter(file => file.startsWith('output') && path.extname(file) === '.kml');
            resolve(kmlFiles);
        });
    });
}

function listKmzFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const kmzFiles = files.filter(file => path.extname(file) === '.kmz');
            resolve(kmzFiles);
        });
    });
}
function listPdfFiles(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const pdfFiles = files.filter(file => path.extname(file) === '.pdf');
            resolve(pdfFiles);
        });
    });
}

function unzipKmzFile(kmzFilePath, outputDirectory) {
    return new Promise((resolve, reject) => {
        try {
            const zip = new AdmZip(kmzFilePath);
            zip.extractAllTo(outputDirectory, true);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}
function moveFile(filePath, newDirectoryPath) {
    return new Promise((resolve, reject) => {
        // Ensure the new directory exists
        fs.mkdir(newDirectoryPath, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }

            const fileName = path.basename(filePath);
            const newFilePath = path.join(newDirectoryPath, fileName);

            fs.rename(filePath, newFilePath, (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}


router.get('/', async (req, res) => {
    const simulations = await Simulations.find().select({ name: 1, latitude: 1, longitude: 1 , outputKmlFileName: 1, outputPdfFileName: 1});

    res.json(simulations);
});

router.post('/', async (req, res) => {
    try {
        console.log('Current working directory:', process.cwd());
        const fetch = (await import('node-fetch')).default;

        const path = (await import('path')).default;
        const northbound = Number(req.body.latitude) + .01;
        const southbound = Number(req.body.latitude) - .01;
        const eastbound = Number(req.body.longitude) + .01;
        const westbound = Number(req.body.longitude) - .01;

        const command = `cd ~/Firelab/Windninja/build/src/fetch_dem && ./fetch_dem --bbox ${northbound} ${eastbound} ${southbound} ${westbound} --src gmted output.tif`;      
        console.log("command: ", command); 
        await execPromise(command);

        const command2 = `WindNinja_cli ~/Jumpster/Jumpster/backend/routes/exampleElevfile.cfg --elevation_file ~/Firelab/Windninja/build/src/fetch_dem/output.tif --output_path ~/Jumpster/Jumpster/backend/outputs`;        
        console.log("command: ", command2); 
        await execPromise(command2);

        console.log("listKmzFiles"); 
        const directoryPath = path.resolve('./outputs');
        const outputDirectory = './kmls';

        const kmzFiles = await listKmzFiles(directoryPath);
        console.log('KMZ Files:', kmzFiles);

        for (const kmzFile of kmzFiles) {
            const kmzFilePath = path.join(directoryPath, kmzFile);
            await unzipKmzFile(kmzFilePath, outputDirectory);
            console.log(`Unzipped ${kmzFile} to ${outputDirectory}`);
            await deleteFile(kmzFilePath); // Delete the kmz file after unzipping
            console.log(`Deleted ${kmzFile}`);
        }  

        const kmlFiles = await listKmlFiles(outputDirectory);
        console.log('KML Files:', kmlFiles);
        const kmlFileName="" + kmlFiles[0];
        for (const kmlFile of kmlFiles) {
            await moveFile(path.join(outputDirectory, kmlFile), '../frontend/public/kml');
        }

        const pdfFiles = await listPdfFiles(directoryPath);
        console.log('PDF Files:', pdfFiles);
        const pdfFileName="" + pdfFiles[0];
        for (const pdfFile of pdfFiles) {
            await moveFile(path.join(directoryPath, pdfFile), '../frontend/public/pdf');
        }

        const allExtraFiles = await listAllFiles(outputDirectory);
        console.log('All Extra Files:', allExtraFiles);
        for (const extraFile of allExtraFiles) {
            await deleteFile(path.join(outputDirectory, extraFile));
        }


        
        // Save simulation data to database if needed
        const newSimulation = new Simulations({
            name: req.body.name,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            time: new Date(req.body.time),
            outputKmlFileName: kmlFileName,
            outputPdfFileName: pdfFileName
        });
        
        await newSimulation.save();


        console.log("request completed");
        res.status(200).json({ message: 'Simulation created successfully' });

} catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});
module.exports = router;
