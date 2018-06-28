let async = require('async');
PersonaServicio = require('./personaservicio');
Servicio = require('../servicio/servicio');
var ObjectId = require('mongoose').Types.ObjectId;

function PersonaServicio_dao() {

    this.registraPersonaServicio = function (persona, idServicio, meta, callback) {
        
        var personaservicio = new PersonaServicio();

        async.waterfall([
            function (wf_callback) {

                Servicio.findOne({ _id: ObjectId(idServicio) }, function (err, servicio) {

                    wf_callback(null, servicio);
                });
            },
            function (servicio, wf_callback) {

                PersonaServicio.findOne({ _idPersona: ObjectId(persona._id), _idServicio: ObjectId(servicio._id) }, function (err, _personaServicio) {

                    if (_personaServicio === null) {

                        personaservicio._idPersona = persona._id;
                        personaservicio._idServicio = servicio._id;
                        personaservicio.metaData = meta;

                        personaservicio.save(function (err, _personaServicio) {

                            if (err) {
                                wf_callback(err);
                            } else {
                                console.log('<<Inserted personas-servicio>>');
                                wf_callback(null, _personaServicio);
                            }
                        });
                    } else {

                        _personaServicio.set({ metaData: meta });

                        _personaServicio.save(function (err) {
                            if (err){
                                wf_callback(err);
                            } else {
                                console.log('<<Updated personas-servicio>>');
                                wf_callback(null, _personaServicio);
                            }                            
                        });
                    }
                });
            }
        ], function (err, result) {

            if (err){
                callback(err);
            } else {
                console.log('<<Datos actualizados personas-servicio>>');
                callback(null, result);
            }                
        });
    }
}

module.exports = new PersonaServicio_dao();
