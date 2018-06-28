// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var personaSchema = new Schema({
  nombre: { type: String, required: true },
  identificacion: { type: String, unique: true },
  estado: { type: String, default: 'A' },
  fe_creacion: { type: Date, default: Date.now },
  fe_modificacion: { type: Date, default: Date.now },
  us_creacion: { type: Number, default: 0 },
  us_modificacion: { type: Number, default: 0 }
});

personaSchema.methods.dudify = function() {
  
  this.nombre = this.nombre + '-dude'; 

  return this.nombre;
};

var Persona = mongoose.model('Persona', personaSchema);

// make this available to our users in our Node applications
module.exports = Persona;