const Mongoose = require('mongoose');

const SimulationSchema = new Mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    // time: { type: Date, default: Date.now, required: false }
}, { timestamps: true });

module.exports = Mongoose.model('Simulation', SimulationSchema);