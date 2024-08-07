const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const AdmZip = require('adm-zip');
const dayjs = require('dayjs');

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
function deleteDateTimeAndNomads(directoryPath) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }

            const dateTimeFiles = files.filter((file) => 
                file.startsWith('NOMADS') || file.endsWith('date_time.bmp')
            );
    

            if (dateTimeFiles.length === 0) {
                return resolve('No files to delete.');
            }

            let deletePromises = dateTimeFiles.map((file) => {
                return new Promise((res, rej) => {
                    fs.unlink(path.join(directoryPath, file), (err) => {
                        if (err) {
                            return rej(err);
                        }
                        res();
                    });
                });
            });

            Promise.all(deletePromises)
                .then(() => resolve(`${dateTimeFiles.length} file(s) deleted.`))
                .catch(reject);
        });
    });
}
function listExtFiles(directoryPath, ext) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return reject(err);
            }
            const extFiles = files.filter((file) => path.extname(file) === ext);
            resolve(extFiles);
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
function moveFile(filePath, newName, newDirectoryPath) {
    return new Promise((resolve, reject) => {
        // Ensure the new directory exists
        fs.mkdir(newDirectoryPath, { recursive: true }, (err) => {
            if (err) {
                return reject(err);
            }

            const fileName = newName;
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
    try {
        const simulations = await Simulations.find()
            .select({ 
                name: 1, 
                latitude: 1, 
                longitude: 1, 
                outputKmlFileName: 1, 
                outputPdfFileName: 1, 
                outputTiffFileName: 1, 
                outputKmlLegendFileName: 1, 
                time: 1 
            })
            .sort({ time: -1 }); // Sort by `time` field in descending order (-1)
        res.json(simulations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching simulations' });
    }
});

router.post('/', async (req, res) => {
    try {
        
        console.log('Current working directory:', process.cwd());
        const fetch = (await import('node-fetch')).default;

        const path = (await import('path')).default;
        const northbound = Number(req.body.latitude) + .03;
        const southbound = Number(req.body.latitude) - .03;
        const eastbound = Number(req.body.longitude) + .03;
        const westbound = Number(req.body.longitude) - .03;



        
        const currentTime = new Date();

  // Convert currentTime to a dayjs object
        const currentDayjsTime = dayjs(currentTime);

        const diffInMilliseconds = currentDayjsTime.diff(req.body.time);

        const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
        //cd ~/Firelab/Windninja/build/src/fetch_dem && ./fetch_dem --bbox ${northbound} ${eastbound} ${southbound} ${westbound} --src gmted output.tif
        const command = `cd ~/wind/build/src/fetch_dem && ./fetch_dem --bbox ${northbound} ${eastbound} ${southbound} ${westbound} --src gmted output.tif`;      
        console.log("command: ", command); 
        await execPromise(command);
        //WindNinja_cli ~/Jumpster/Jumpster/backend/routes/exampleElevfile.cfg --elevation_file ~/Firelab/Windninja/build/src/fetch_dem/output.tif --output_path ~/Jumpster/Jumpster/backend/outputs
        const command2 = `WindNinja_cli ~/JumpsterBackend/backend/routes/exampleElevfile.cfg --elevation_file ~/wind/build/src/fetch_dem/output.tif --output_path ~/JumpsterBackend/backend/outputs`;        
        console.log("command: ", command2); 
        await execPromise(command2);

        console.log("listKmzFiles"); 
        const directoryPath = path.resolve('./outputs');
        const outputDirectory = './kmls';

        const kmzFiles = await listExtFiles(directoryPath, '.kmz');
        console.log('KMZ Files:', kmzFiles);

        for (const kmzFile of kmzFiles) {
            const kmzFilePath = path.join(directoryPath, kmzFile);
            await unzipKmzFile(kmzFilePath, outputDirectory);
            console.log(`Unzipped ${kmzFile} to ${outputDirectory}`);
            await deleteFile(kmzFilePath); // Delete the kmz file after unzipping
            console.log(`Deleted ${kmzFile}`);
        }  


        
        await deleteDateTimeAndNomads('./kmls');
        const kmlFiles = await listExtFiles(outputDirectory, '.kml');
        console.log('KML Files:', kmlFiles);
        console.log('diff', diffInHours);
        const kmlFileName="" + kmlFiles[Math.abs(diffInHours)];
        const kmlFileNameNew = req.body.name + req.body.latitude + req.body.longitude +".kml";
        await moveFile(path.join(outputDirectory , kmlFileName), kmlFileNameNew, '/var/www/html/jumpster/kml');

        const bmpFiles = await listExtFiles(outputDirectory, '.bmp');
        console.log('BMP Files:', bmpFiles);
        const bmpFileName="" + bmpFiles[Math.abs(diffInHours)];
        const bmpFileNameNew = req.body.name + req.body.latitude + req.body.longitude +".bmp";
        await moveFile(path.join(outputDirectory , bmpFileName), bmpFileNameNew, '/var/www/html/jumpster/kmlLegend');

        const pdfFiles = await listExtFiles(directoryPath, '.pdf');
        console.log('PDF Files:', pdfFiles);
        const pdfFileName="" + pdfFiles[Math.abs(diffInHours)];
        const pdfFileNameNew = req.body.name + req.body.latitude + req.body.longitude +".pdf";
        await moveFile(path.join(directoryPath, pdfFileName),pdfFileNameNew, '/var/www/html/jumpster/pdf');


        const tiffFiles = await listExtFiles(directoryPath, '.tif');
        console.log('Tiff Files:', tiffFiles);
        const tiffFileName="" + tiffFiles[0];
        const tiffFileNameNew = req.body.name + req.body.latitude + req.body.longitude +".tif";
        await moveFile(path.join(directoryPath, tiffFileName),tiffFileNameNew, '/var/www/html/jumpster/tiff');


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
            outputKmlFileName: kmlFileNameNew,
            outputPdfFileName: pdfFileNameNew,
            outputTiffFileName: tiffFileNameNew,
            outputKmlLegendFileName: bmpFileNameNew
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
