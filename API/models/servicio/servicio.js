var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var servicioSchema = new Schema({
  servicio: { type: String, required: true },
  activo: { type: Boolean, required: true, default: true },
  estado: { type: String, default: 'A' },
  fe_creacion: { type: Date, default: Date.now },
  fe_modificacion: { type: Date, default: Date.now },
  us_creacion: { type: Number, default: 0 },
  us_modificacion: { type: Number, default: 0 }
});

var Servicio = mongoose.model('Servicio', servicioSchema);

module.exports = Servicio;