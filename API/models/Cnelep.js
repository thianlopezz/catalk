const axios = require('axios');
let async = require('async');
var moment = require('moment');
var querystring = require('querystring');
var PersonaServicio = require('./personaservicio/personaservicio');
var personaservicio_dao = require('./personaservicio/personaservicio_dao');
var Persona = require('./persona/persona');
var persona_dao = require('./persona/persona_dao');

var ObjectId = require('mongoose').Types.ObjectId;

const cnel_url = process.env.URL_CNEL || 'http://www.cnelep.gob.ec/planillas/json/consulta.php';

function Cnelep() {

    this.getContrato = function (pp, valor, tipo, res) {
        getContratoBD(pp, valor, tipo, function (err, result) {

            if (err) {
                console.log('Error en consulta de base de datos>> Cnelep>> getContrato>> getContratoBD>>');
                console.log(err);

                getContratoRemoto(pp, valor, tipo, function (err, result) {
                    if (err) {
                        res.send({ success: false, mensaje: err.message, error: err });
                    } else {
                        res.send({ success: true, data: result, origen: 0 });
                    }
                });
            } else if (result === null) {

                getContratoRemoto(pp, valor, tipo, function (err, result) {
                    if (err) {
                        res.send({ success: false, mensaje: err.message, error: err });
                    } else {
                        res.send({ success: true, data: result, origen: 0 });
                    }
                });
            } else {
                res.send({ success: true, data: result.metaData, origen: 1 });
            }
        });
    }

    this.registraContrato = function (model, res) {

        async.waterfall([
            function (callback) {
                persona_dao.registraPersona(model.Result.cliente,
                    model.Result.cedula, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    });
            },
            function (persona, callback) {
                personaservicio_dao.registraPersonaServicio(persona,
                    ObjectId('59e8cf3ecff81d8c269ab446'),
                    model, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, result);
                        }

                    });
            }
        ], function (err, result) {
            if (err) {
                res.send({ success: false, mensaje: err.message, error: err });
            } else {
                res.send({ success: true, mensaje: 'Datos actualizados correctamente.' });
            }
        });
    }

    function getContratoBD(pp, valor, tipo, callback) {

        PersonaServicio.findOne({ "metaData.Cuentas": { $elemMatch: { codigoUnico: valor } }, _idServicio: ObjectId('59e8cf3ecff81d8c269ab446') },
            function (err, _personaServicio) {

                if (err) {
                    console.log('Error en consulta bd>> luz>>' + err);
                    callback(err);
                } else if (_personaServicio !== null) {

                    let cuentas = _personaServicio.metaData.Cuentas;

                    for (let i = 0; i < cuentas.length; i++) {
                        if (cuentas[i].codigoUnico === valor) {

                            if (parseInt(cuentas[i].Planillas[0].month) !==
                                parseInt(moment().format('MM'))
                                || cuentas[i].Planillas[0].estado === 'Impaga') {

                                _personaServicio = null;
                                break;
                            }
                        }
                    }
                }

                callback(null, _personaServicio);
            });
    }

    function getContratoRemoto(pp, valor, tipo, callback) {
        axios.post(cnel_url,
            querystring.stringify({
                PP: pp,
                tipo: tipo,
                valor: valor
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(function (response) {
                if (!response.data.status) {
                    if (JSON.stringify(response.data.Result) !== '{}') {
                        callback(null, response.data);
                    } else {
                        callback(new Error('Ingrese un código válido'));
                    }

                } else {
                    callback(new Error(response.data.error));
                }
            })
            .catch(function (error) {
                console.log(error);
                //Registro de errores
                callback(error);
            });

    }

}

module.exports = new Cnelep();
