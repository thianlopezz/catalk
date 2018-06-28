var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var personaServicioSchema = new Schema({
  _idPersona: Schema.Types.ObjectId,
  _idServicio: Schema.Types.ObjectId,
  metaData: Schema.Types.Mixed,
  fe_creacion: {type: Date, default: Date.now},
  fe_modificacion: { type: Date, default: Date.now },
  us_creacion:{type: String, default: 'A'},
  us_modificacion: { type: String, default: 'A' }
});

var PersonaServicio = mongoose.model('PersonaServicio', personaServicioSchema);

module.exports = PersonaServicio;