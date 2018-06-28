var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admisionSchema = new Schema({
    tipoAdmision: { type: String, required: true },    
    descripcion: { type: String, required: true },
    feInicio: { type: Date},
    feFin: { type: Date },
    valor: {type: Number},
    detalles: [String],
    requisitos: [String],
    estado: { type: String, default: 'A' },
    fe_creacion: { type: Date, default: Date.now },
    fe_modificacion: { type: Date, default: Date.now }
});

var Admision = mongoose.model('Admision', admisionSchema);

module.exports = Admision;