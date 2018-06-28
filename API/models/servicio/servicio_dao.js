let async = require('async');
Servicio = require('./servicio');
var ObjectId = require('mongoose').Types.ObjectId;

function Servicio_dao() {

    this.get = function (callback) {
        Servicio.find({ estado: 'A' }, function (error, result) {
            callback(null, result);
        });
    }
}

module.exports = new Servicio_dao();
