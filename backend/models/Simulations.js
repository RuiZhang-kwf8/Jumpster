const Mongoose = require('mongoose');

const SimulationSchema = new Mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    outputFileName: String,
}, { timestamps: true });


module.exports = Mongoose.model('Simulation', SimulationSchema);