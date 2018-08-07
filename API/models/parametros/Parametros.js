var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parametroSchema = new Schema({
    correoContacto: { type: String, required: true },    
    
    senderSmtp: { type: String, required: true },    
    usuarioSmtp: { type: String, required: true },    
    contrasenaSmtp: { type: String, required: true },    

    fb: { type: String, required: true },   
    tw: { type: String, required: true },   
    ig: String,
    in: String,

    us_modificacion: Schema.Types.ObjectId,
    fe_modificacion: { type: Date, default: Date.now }
});

parametroSchema.pre('save', function (next) {

    var currentDate = new Date();

    this.fe_modificacion = currentDate;

    next();
});

var Parametro = mongoose.model('Parametro', parametroSchema);

module.exports = Parametro;