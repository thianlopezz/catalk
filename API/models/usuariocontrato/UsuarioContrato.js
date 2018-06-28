var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioContratoSchema = new Schema({
    idUsuario: { type: Schema.Types.ObjectId, required: true },
    contratos: [Schema.Types.Mixed],
    estado: { type: String, default: 'A' },
    fe_creacion: { type: Date, default: Date.now },
    fe_modificacion: { type: Date, default: Date.now },
    us_creacion: { type: String, default: '0' },
    us_modificacion: { type: String, default: '0' }
});

var UsuarioContrato = mongoose.model('UsuarioContrato', usuarioContratoSchema);

module.exports = UsuarioContrato;