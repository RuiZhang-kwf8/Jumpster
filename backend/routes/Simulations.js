const express = require('express');
const Simulation = require('../models/Simulations');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await Simulation.find();
    res.json(users);
});

router.post('/', async (req, res) => {
    console.log(req.body);
    const newSimulation = new Simulation(req.body);
    await newSimulation.save();
    res.json(newSimulation);
});

module.exports = router;
