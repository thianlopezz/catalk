var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var modeloSolicitudSchema = new Schema({
    keyDialogflow: { type: String, required: true, unique: true },    
    solicitud: { type: String, required: true },    
    descripcion: { type: String, required: true },
    archivo: { type: String, required: true },
    detalles: [String],
    estado: { type: String, default: 'A' },
    us_creacion: Schema.Types.ObjectId,
    us_modificacion: Schema.Types.ObjectId,
    fe_creacion: { type: Date, default: Date.now },
    fe_modificacion: { type: Date, default: Date.now }
});

modeloSolicitudSchema.pre('save', function (next) {

    var currentDate = new Date();

    this.fe_modificacion = currentDate;

    if (!this.fe_creacion) {
        this.fe_creacion = currentDate;
    }

    next();
});

var ModeloSolicitud = mongoose.model('ModeloSolicitud', modeloSolicitudSchema);

module.exports = ModeloSolicitud;