const Mongoose = require('mongoose');

const SimulationSchema = new Mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    time:  Date,
    outputFileName: String,
    time: { type: Date, default: Date.now }
}, { timestamps: true });


module.exports = Mongoose.model('Simulation', SimulationSchema);
