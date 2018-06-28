var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, unique: true, required: true },
    contrasena: { type: String, required: true },
    estado: { type: String, default: 'A' },
    fe_creacion: { type: Date, default: Date.now },
    fe_modificacion: { type: Date, default: Date.now }
});

var Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;