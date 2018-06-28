let async = require('async');
Persona = require('./persona');

function Persona_dao() {

    this.registraPersona = function (nombre, identificacion, callback) {
        
        var persona = new Persona();
        persona.nombre = nombre;
        persona.identificacion = identificacion;

        var personaservicio = new PersonaServicio();

        async.waterfall([
            function (wf_callback) {
                if(persona.identificacion){
                    Persona.findOne({ identificacion: persona.identificacion }, function (err, _persona) {

                        if (err) {
                            wf_callback(err);
                        } else {
                            wf_callback(null, _persona);
                        }
                    });
                } else {
                    wf_callback(null, null);
                }
            },
            function (_persona, wf_callback) {

                if (_persona === null) {

                    persona.save(function (err, _persona) {

                        if (err) {
                            wf_callback(err);
                        } else {
                            wf_callback(null, _persona);
                        }
                    });
                } else {
                    wf_callback(null, _persona);
                }
            }
        ], function (err, result) {

            if (err){
                callback(err);
            } else {
                callback(null, result);
            }                
        });
    }

    this.getByIdentificacion = function (identificacion, callback){
        Persona.findOne({ identificacion: identificacion }, function (err, persona) {
            
            if (err){
                callback(err);
            } else{
                callback(null, persona);
            }
        });
    }
}

module.exports = new Persona_dao();
