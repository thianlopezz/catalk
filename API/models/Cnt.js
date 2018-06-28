const axios = require('axios');
let async = require('async');
var moment = require('moment');
var querystring = require('querystring');
var persona_dao = require('./persona/persona_dao');
var personaservicio_dao = require('./personaservicio/personaservicio_dao');
var ObjectId = require('mongoose').Types.ObjectId;

const cnt_deuda = process.env.URL_CNT_DEUDA || 'http://www.andinatel.com/atphpplanillaagrupado/planilla.php'
const cnt_guia = process.env.URL_CNT_GUIA || 'http://micnt.com.ec/cntapp/guia104/php/guia_cntat.php?hflagsubmit=1&cmbcriterio=1';
const cnt_planillas = process.env.URL_CNT_PLANILLAS || 'http://soy.cnt.com.ec/cntapp/facturapdf/jsoncucodi.php?';

function Cnt() {

    this.getContrato = function (codigo_provincia, numero, res) {
        getContratoBD(numero, function (err, result) {
            if (err) {

                console.log('Error en consulta de base de datos>> Cnt>> getContrato>> getContratoBD>>');
                console.log(err);

                getContratoRemoto(codigo_provincia, numero, function (err, result) {
                    if (err) {
                        res.send({ success: false, mensaje: err.message, error: err });
                    } else {
                        res.send({ success: true, data: result, origen: 0 });
                    }
                });
            } else {
                if (result === null) {

                    getContratoRemoto(codigo_provincia, numero, function (err, result) {
                        if (err) {
                            res.send({ success: false, mensaje: err.message, error: err });
                        } else {
                            res.send({ success: true, data: result, origen: 0 });
                        }
                    });
                } else {
                    res.send({ success: true, data: result.metaData, origen: 1 });
                }
            }
        });
    }

    this.registraCnt = function (model, res) {
        async.waterfall([
            function (callback) {
                persona_dao.registraPersona(model.cabecera.nombre,
                    model.cabecera.identificacion, function (err, result) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, result);
                        }
                    });
            },
            function (persona, callback) {
                personaservicio_dao.registraPersonaServicio(persona,
                    '5a15b938f36d28650ee8192e',
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

    function getContratoBD(numero, callback) {
        PersonaServicio.findOne({ "metaData.cabecera": { numero: numero }, _idServicio: ObjectId('5a15b938f36d28650ee8192e') },
            function (err, personaServicio) {

                if (err) {
                    console.log('Error en consulta bd>> Cnt>>' + err);
                    callback(err);
                } else {
                    if (personaServicio !== null) {

                        let deuda = personaServicio.metaData.deuda || {};
                        let planillas = personaServicio.metaData.planillas;

                        let anioPlanilla = planillas[0].cell[3];
                        let mesPlanilla = planillas[0].cell[34];

                        if (parseFloat(deuda.total) > 0) {
                            personaServicio = null;
                        } else if (anioPlanilla !== moment().format('YYYY') || mesPlanilla !== moment().format('MM')) {
                            personaServicio = null;
                        }

                        callback(null, personaServicio);
                    }
                }

                if (personaServicio !== null) {

                    let cabecera = personaServicio.metaData.cabecera;

                    cabecera.provincia = codigo_provincia;
                    cabecera.contrato = numero;

                    personaServicio.metaData.cabecera = cabecera;

                    if (cabecera.DEUDA_PENDIENTE > 0) {
                        personaServicio = null;
                    }
                }
                callback(null, personaServicio);
            });
    }

    function getContratoRemoto(codigo_provincia, numero, callback) {

        axios.get(cnt_guia + '&cmbprovincia=' + parseInt(codigo_provincia) + '&txttelefono=' + numero)
            .then(function (response) {

                if (existenDatos(response.data)) {

                    async.parallel([
                        function (pr_callback) {
                            getDatosCliente(response.data, function (err, result) {
                                pr_callback(null, result);
                            });
                        },
                        function (pr_callback) {
                            getDeuda(codigo_provincia, numero, function (err, result) {
                                pr_callback(null, result);
                            });
                        },
                        function (pr_callback) {
                            // getPlanillas(codigo_provincia, numero, function (err, result) {
                            //     pr_callback(null, result);
                            // });
                            pr_callback(null, []);
                        }
                    ],
                        function (err, results) {

                            if (err) {
                                console.log('Err>> Parallel>>' + err);
                                wf_callback(err);
                            } else {

                                if (results[1].identificacion) {
                                    results[0].identificacion = results[1].identificacion;
                                }

                                results[0].provincia = codigo_provincia;
                                results[0].contrato = numero;

                                var data = {
                                    cabecera: results[0],
                                    deuda: results[1],
                                    planillas: results[2]
                                }
                                callback(null, data);
                            }
                        });
                } else {
                    callback(new Error('No existe cuenta asociada a los datos ingresados.'));
                }

            })
            .catch(function (error) {
                console.log(error);
                //Registro de errores
                callback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
            });

    }

    function existenDatos(stringHtml) {

        var index = stringHtml.indexOf('No hay');

        if (index === -1) {
            return true;
        } else if (index > -1) {
            return false;
        }
    }

    function existeDeuda(stringHtml) {

        var index = stringHtml.indexOf('TELEFONO SIN DEUDA');

        if (index === -1) {
            return true;
        } else if (index > -1) {
            return false;
        }
    }

    function getDatosCliente(stringHtml, callback) {

        var ini = stringHtml.indexOf("<tr onmouseover='cambiacolor_over(this);' onmouseout='cambiacolor_out(this);'>");

        stringHtml = stringHtml.substring(ini, stringHtml.length - 1);

        stringHtml = stringHtml.substring(stringHtml.indexOf('<td'), stringHtml.length - 1);

        stringHtml = stringHtml.substring(0, stringHtml.indexOf('</tr>'));

        var numero = stringHtml.substring(stringHtml.indexOf('>') + 1, stringHtml.indexOf('<', 1));

        stringHtml = stringHtml.substring(stringHtml.indexOf('</td>') + 5, stringHtml.length - 1);

        var nombre = stringHtml.substring(stringHtml.indexOf('>') + 1, stringHtml.indexOf('<', 1));

        stringHtml = stringHtml.substring(stringHtml.indexOf('</td>') + 5, stringHtml.length - 1);

        var direccion = stringHtml.substring(stringHtml.indexOf('>') + 1, stringHtml.indexOf('<', 1));

        stringHtml = stringHtml.substring(stringHtml.indexOf('</td>') + 5, stringHtml.length - 1);

        var localidad = stringHtml.substring(stringHtml.indexOf('>') + 1, stringHtml.indexOf('<', 1));

        datos = {
            nombre: nombre,
            numero: numero,
            direccion: direccion,
            localidad: localidad
        };

        callback(null, datos);
    }

    function getDeuda(codigo_provincia, numero, callback) {

        axios.post(cnt_deuda,
            querystring.stringify({
                provincia: codigo_provincia,
                telefono: numero
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(function (response) {
                if (existeDeuda(response.data)) {
                    callback(null, getDatosDeuda(response.data));
                } else {
                    callback(null, { total: '0', noPlanillas: '0' });
                }

            })
            .catch(function (error) {
                console.log(error);
                //Registro de errores
                callback(null, {});
            });


    }

    function getDatosDeuda(stringHtml) {
        // FECHA EMISION
        var aux = 'FECHA DE EMISI';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '>&nbsp;';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        var emision = stringHtml.substring(0, stringHtml.indexOf('</td>'));
        // IDENTIFICAION
        aux = 'RUC / CI';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '>&nbsp;';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        var identificacion = stringHtml.substring(0, stringHtml.indexOf('</td>'));
        // CUENTAS IMPAGO
        aux = 'CUENTAS IMPAGO';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = '>&nbsp;';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        var noPlanillas = stringHtml.substring(0, stringHtml.indexOf('</td>'));
        // TOTAL A PAGAR
        aux = 'TOTAL A PAGAR';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux), stringHtml.length - 1);

        aux = "width='60%'>";

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        var total = stringHtml.substring(0, stringHtml.indexOf('</td>'));

        var deuda = {
            emision: emision,
            noPlanillas: parseInt(noPlanillas),
            total: total,
            identificacion: identificacion.trim()
        };

        return deuda;
    }

    function getPlanillas(codigo_provincia, numero, callback) {

        axios.post(cnt_planillas + 'tlf=' + numero + '&codprov=' + codigo_provincia,
            querystring.stringify({
                _search: 'false',
                nd: '1511308565339',
                rows: '10',
                page: '1',
                sidx: 'Id',
                sord: 'asc'
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            .then(function (response) {

                if (response.data.rows) {
                    callback(null, response.data.rows);
                } else {
                    callback(null, []);
                }

            })
            .catch(function (error) {
                console.log(error);
                //Registro de errores
                callback(null, []);
            });
    }

}

module.exports = new Cnt();
