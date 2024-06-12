const Mongoose = require('mongoose');

const SimulationSchema = new Mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
<<<<<<< HEAD
    time:  Date
=======
    outputFileName: String,
    time: { type: Date, default: Date.now }
>>>>>>> 27ec0f160b00a0f37a83db2b5c97539f23be45a2
}, { timestamps: true });


module.exports = Mongoose.model('Simulation', SimulationSchema);