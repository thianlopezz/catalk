var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var admisionSchema = new Schema({
    keyDialogflow: { type: String, required: true, unique: true },    
    tipoAdmision: { type: String, required: true },    
    descripcion: { type: String, required: true },
    feInicio: { type: Date},
    feFin: { type: Date },
    valor: {type: Number},
    detalles: [{ descripcion: String, idSolicitud: Schema.Types.ObjectId, link: String }],
    requisitos: [{ descripcion: String, idSolicitud: Schema.Types.ObjectId, link: String }],
    estado: { type: String, default: 'A' },
    us_creacion: Schema.Types.ObjectId,
    us_modificacion: Schema.Types.ObjectId,
    fe_creacion: { type: Date, default: Date.now },
    fe_modificacion: { type: Date, default: Date.now }
});

admisionSchema.pre('save', function (next) {

    var currentDate = new Date();

    this.fe_modificacion = currentDate;

    if (!this.fe_creacion) {
        this.fe_creacion = currentDate;
    }

    next();
});

var Admision = mongoose.model('Admision', admisionSchema);

module.exports = Admision;