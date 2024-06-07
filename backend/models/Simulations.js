const Mongoose = require('mongoose');

const SimulationSchema = new Mongoose.Schema({
    id: { type: Number, unique: true, required: true, default: 1 },
    latitude: Number,
    longitude: Number,
    time: { type: Date, default: Date.now },
    tiffdata: { type: String }
}, { timestamps: true });

//auto increment id
SimulationSchema.pre('save', function(next) {
    const doc = this;
    if (doc.isNew) {
        Mongoose.model('Simulation', SimulationSchema).findOne({}, {}, { sort: { 'id': -1 } }, function(err, lastSimulation) {
            if (err) {
                return next(err);
            }
            doc.id = lastSimulation ? lastSimulation.id + 1 : 1;
            next();
        });
    } else {
        next();
    }
});

module.exports = Mongoose.model('Simulation', SimulationSchema);