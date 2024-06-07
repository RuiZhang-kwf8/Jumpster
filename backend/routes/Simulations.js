const express = require('express');
const Simulations = require('../models/Simulations');
const router = express.Router();

router.get('/', async (req, res) => {
    const users = await Simulations.find();
    res.json(users);
});

router.post('/', async (req, res) => {
    const newSimulation = new Simulations(req.body);
    await newSimulation.save();
    res.json(newSimulation);
});

module.exports = router;
