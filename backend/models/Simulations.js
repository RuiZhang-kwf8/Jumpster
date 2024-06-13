const Mongoose = require('mongoose');

const SimulationSchema = new Mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    time:  Date,
    outputKmlFileName: String,
    outputPdfFileName: String
}, { timestamps: true });


module.exports = Mongoose.model('Simulation', SimulationSchema);
