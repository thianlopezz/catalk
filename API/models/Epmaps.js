
const axios = require('axios');
let async = require('async');
var querystring = require('querystring');
var persona_dao = require('./persona/persona_dao');
var personaservicio_dao = require('./personaservicio/personaservicio_dao');
var ObjectId = require('mongoose').Types.ObjectId;

const epmaps_url = process.env.URL_EPMAPS || 'https://consultas.aguaquito.gob.ec';

function Epmaps() {

    this.getContrato = function (contrato, res) {

        getContratoBD(contrato, function (err, result) {

            if (err) {
                console.log('Error en consulta de base de datos>> Epmaps>> getContrato>> getContratoBD>>');
                console.log(err);

                getContratoRemoto(contrato, function (err, result) {
                    if (err) {
                        res.send({ success: false, mensaje: err.message, error: err });
                    } else {
                        res.send({ success: true, data: result, origen: 0 });
                    }
                });
            } else if (result === null) {
                getContratoRemoto(contrato, function (err, result) {
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
                persona_dao.registraPersona(model.cliente.nombre, null, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    });
            },
            function (persona, callback) {
                personaservicio_dao.registraPersonaServicio(persona,
                    ObjectId('5a8bb3258f475e0760ae1351'),
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

    function getContratoBD(contrato, callback) {

        PersonaServicio.findOne({ "metaData": { contrato: contrato }, _idServicio: ObjectId('5a8bb3258f475e0760ae1351') },
            function (err, _personaServicio) {

                if (err) {
                    console.log('Error en consulta bd>> epmaps>>' + err);
                    callback(err);
                } else {
                    if (_personaServicio !== null) {

                        let meta = _personaServicio.metaData;

                        if (meta.totalpagar > 0) {
                            _personaServicio = null;
                        }
                    }
                    callback(null, _personaServicio);
                }

            });
    }

    // function getContratoRemoto(contrato, callback) {
    function getContratoRemoto (contrato, callback) {
        
        axios.post(epmaps_url + '/result.php',
            querystring.stringify({
                Cuenta: contrato
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(function (response) {
                let html = response.data;

                if (html.indexOf('No se encontró') > -1) {
                    callback(new Error('No se encontró el contrato'));
                } else {
                    callback(null, getDataFromHtml(contrato, html));
                }
            })
            .catch(function (error) {
                console.log(error);
                //Registro de errores
                callback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
            });

    }
    
    function getDataFromHtml(contrato, stringHtml, callback) {
        // NOMBRE
        let aux = 'Nombre:</p>';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '<p>';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let cliente = stringHtml.substring(0, stringHtml.indexOf('<br/>')).trim();

        // DIRECCION
        aux = '<br/>';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let direccion = stringHtml.substring(0, stringHtml.indexOf('</p>')).trim();

        // FECHA LIMITE
        aux = 'pago:';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '<span>';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let fechalimite = stringHtml.substring(0, stringHtml.indexOf('</span>')).trim();

        // ESTADISTICA - PROMEDIO
        aux = 'data:';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '[';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let estadistica = stringHtml.substring(0, stringHtml.indexOf('color:'));

        estadistica = getEstadistica(estadistica);

        let promedio = getPromedio(estadistica);

        // TOTALPAGAR
        aux = 'Pagar:</h4>';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '<h3> $';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let totalpagar = stringHtml.substring(0, stringHtml.indexOf('</h3>')).trim();

        totalpagar = parseFloat(totalpagar);

        console.log(totalpagar);

        return {
            cliente:{
                nombre: cliente,
                direccion: direccion,
                contrato: contrato
            },
            metaData:{
                cliente: {
                    nombre: cliente,
                    direccion: direccion,
                    contrato: contrato
                }, 
                contrato: contrato,
                fechalimite: fechalimite,
                consumos: estadistica,
                promedio: promedio,
                totalpagar: totalpagar
            }
        }
    }

    function getEstadistica(str){
        let retorno = JSON.parse('[[' + str + '["1", 3]]');
        return retorno[0];
    }

    function getPromedio(estadistica){

        let cont = 0;
        for (let i = 0; i < estadistica.length; i++) {
            cont += estadistica[i][1];
        }
        return cont / estadistica.length;
    }
}

module.exports = new Epmaps();
