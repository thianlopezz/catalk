var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contadorSchema = new Schema({    
    tipo: { type: String, required: true },
    idTipo: Schema.Types.ObjectId,
    fuente: String,
    correo: String,
    fe_creacion: { type: Date, default: Date.now }
});

contadorSchema.pre('save', function (next) {

    var currentDate = new Date();

    if (!this.fe_creacion) {
        this.fe_creacion = currentDate;
    }

    next();
});

var Contador = mongoose.model('Contador', contadorSchema);

module.exports = Contador;