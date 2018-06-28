
const axios = require('axios');
let async = require('async');
var querystring = require('querystring');
var moment = require('moment');
var persona_dao = require('./persona/persona_dao');
var personaservicio_dao = require('./personaservicio/personaservicio_dao');
var ObjectId = require('mongoose').Types.ObjectId;

const interagua_url = process.env.URL_INTER || 'https://servijava.herokuapp.com/';
const interagua_user = process.env.URL_INTER_USER || '2000';

function Interagua() {

    this.getContrato = function (contrato, identificacion, res) {

        getContratoBD(contrato, identificacion, function (err, result) {

            if (err) {
                console.log('Error en consulta de base de datos>> Interagua>> getContrato>> getContratoBD>>');
                console.log(err);

                getContratoRemoto(contrato, identificacion, function (err, result) {
                    if (err) {
                        res.send({ success: false, mensaje: err.message, error: err });
                    } else {
                        res.send({ success: true, data: result, origen: 0 });
                    }
                });
            } else if (result === null) {
                getContratoRemoto(contrato, identificacion, function (err, result) {
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
                persona_dao.registraPersona(model.cabecera.NOMBRE_PROPIETARIO,
                    model.cabecera.IDENTIFICACION_PROPIETARIO, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    });
            },
            function (persona, callback) {
                personaservicio_dao.registraPersonaServicio(persona,
                    ObjectId('59f25f7e383738e234a8d74b'),
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

    function getContratoBD(contrato, identificacion, callback) {

        PersonaServicio.findOne({ "metaData.cabecera": { ID_CONTRATO: contrato }, _idServicio: ObjectId('59f25f7e383738e234a8d74b') },
            function (err, _personaServicio) {

                if (err) {
                    console.log('Error en consulta bd>> luz>>' + err);
                    callback(err);
                } else {
                    if (_personaServicio !== null) {

                        let cabecera = _personaServicio.metaData.cabecera;

                        if (cabecera.DEUDA_PENDIENTE > 0) {
                            _personaServicio = null;
                        }
                    }
                    callback(null, _personaServicio);
                }

            });
    }

    function getContratoRemoto(contrato, identificacion, callback) {

        axios.get(interagua_url + 'interagua?ced=' + identificacion + '&cont=' + contrato + '&usu=' + interagua_user + '')
            .then(function (response) {

                let data = JSON.parse(response.data.data);

                if (!data.error) {
                    let _result = { cabecera: getCabecera(data) };

                    axios.get(interagua_url + 'interagua/detalle?ced=' + identificacion + '&cont=' + contrato + '&usu=' + interagua_user + '')
                        .then(function (response) {

                            let data = JSON.parse(response.data.data);

                            _result.consumos = setConsumos(data[3].row);
                            _result.facturas = setFacturas(data[3].row);

                            callback(null, _result);
                        })
                        .catch(function (error) {
                            callback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
                        });

                    // async.parallel([
                    //     function (pr_callback) {

                    //         axios.get(interagua_url + 'interagua/detalle?ced=' + identificacion + '&cont=' + contrato + '&usu=' + interagua_user + '')
                    //             .then(function (response) {
                    //                 pr_callback(null, setConsumos(response.data));
                    //             })
                    //             .catch(function (error) {
                    //                 pr_callback(error);
                    //             });
                    //     },
                    //     function (pr_callback) {

                    //         axios.get(interagua_url + '/api/contratos/' + contrato + '/facturas.json') // facturas
                    //             .then(function (response) {
                    //                 pr_callback(null, setFacturas(response.data));
                    //             })
                    //             .catch(function (error) {
                    //                 pr_callback(error);
                    //             });
                    //     }
                    // ],
                    //     function (err, results) {

                    //         if (err) {
                    //             console.log('Err>> Parallel>>' + err);
                    //             callback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
                    //         } else if (results[0] !== null && results[1] !== null) {


                    //             _result.consumos = results[0];
                    //             _result.facturas = results[1];
                    //             callback(null, _result);
                    //         } else {
                    //             // AVISAAR
                    //             callback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
                    //         }
                    //     });
                } else {
                    callback(new Error(response.data.message));
                }
            })
            .catch(function (error) {
                console.log(error);
                //Registro de errores
                callback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
            });

    }

    function setConsumos(result) {

        let retorno = [];

        if (result !== null) {

            for (let i = 0; i < result.length; i++) {

                let obj = {};

                const fecha_moment = moment(result[i][1].substring(0, 10), 'DD[/]MM[/]YYYY');

                obj.fecha = result[i][1].substring(0, 10);
                obj.vencimiento = result[i][2].substring(0, 10);
                obj.mes = fecha_moment.format('MM');
                obj.anio = fecha_moment.format('YYYY');
                obj.valor = result[i][6];
                obj.valor_consumo = result[i][6] + ' M3';

                retorno.push(obj);
            }

            return retorno;
        } else {
            return retorno;
        }

    }

    function setFacturas(result) {

        let retorno = [];

        if (result !== null) {

            for (let i = 0; i < result.length; i++) {

                let obj = {};

                const fecha_moment = moment(result[i][1].substring(0, 10), 'DD[/]MM[/]YYYY');

                obj.fecha = result[i][1].substring(0, 10);
                obj.vencimiento = result[i][2].substring(0, 10);
                obj.mes = fecha_moment.format('MM');
                obj.anio = fecha_moment.format('YYYY');
                obj.valor_pagar = obj.valor_total = parseFloat(result[i][3]).toFixed(2);

                retorno.push(obj);
            }
            
            return retorno;
        } else {
            return retorno;
        }

    }

    function getCabecera(data) {

        const keys = Object.keys(data.col);
        let cabecera = {};
        for (let i = 0; i < keys.length; i++) {
            cabecera[keys[i]] = data.row[0][i];
        }

        return cabecera;
    }

}

module.exports = new Interagua();
