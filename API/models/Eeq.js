
const axios = require('axios');
let async = require('async');
var querystring = require('querystring');
var persona_dao = require('./persona/persona_dao');
var personaservicio_dao = require('./personaservicio/personaservicio_dao');
var ObjectId = require('mongoose').Types.ObjectId;

const eeq_url = process.env.URL_EEQ || 'http://190.120.76.177:8080';

function Eeq() {

    this.getContrato = function (contrato, res) {

        getContratoBD(contrato, function (err, result) {

            if (err) {
                console.log('Error en consulta de base de datos>> Eeq>> getContrato>> getContratoBD>>');
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
                persona_dao.registraPersona(model.cabecera.nombre, model.cabecera.cedula, function (err, result) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, result);
                    }
                });
            },
            function (persona, callback) {
                personaservicio_dao.registraPersonaServicio(persona,
                    ObjectId('5a9573d3499bd8bb3adda0b2'),
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

        PersonaServicio.findOne({ "metaData": { contrato: contrato }, _idServicio: ObjectId('5a9573d3499bd8bb3adda0b2') },
            function (err, _personaServicio) {

                if (err) {
                    console.log('Error en consulta bd>> epmaps>>' + err);
                    callback(err);
                } else {
                    if (_personaServicio !== null) {

                        let meta = _personaServicio.metaData;

                        if (meta.cabecera.pendientes > 0) {
                            _personaServicio = null;
                        }
                    }
                    callback(null, _personaServicio);
                }

            });
    }

    function getContratoRemoto(contrato, callback) {

        async.waterfall([
            function (wfCallback) {

                axios.get(eeq_url + '/consultaplanillas/servlet/gob.ec.sapconsultas')
                    .then(function (response) {
                        let html = response.data;
                        const header = getHeader(html);
                        wfCallback(null, header);
                    })
                    .catch(function (error) {
                        console.log(error);
                        //Registro de errores
                        wfCallback(null, getHeaderDefault());
                    });
            },
            function (header, wfCallback) {

                const param1 = '49d01f602226122be8ee79f430c1e829';
                const param2 = '1519673819841';
                const objetoeeq = getObjEeq(contrato);

                axios.post(eeq_url + '/consultaplanillas/servlet/gob.ec.sapconsultas?' + param1 + ',gx-no-cache=' + param2 + '',
                    JSON.stringify(objetoeeq),
                    {
                        headers: header
                    })
                    .then(function (response) {
                        let respuesta = response.data;

                        if (JSON.stringify(respuesta).indexOf('NO FUE POSIBLE') > 0) {
                            wfCallback(new Error('No se encontró el contrato'));
                        } else {
                            wfCallback(null, getCabecera(respuesta));
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        //Registro de errores
                        wfCallback(new Error('Ocurrió un error, estamos trabajando para solucionarlo, vuelve a intentarlo mas tarde.'));
                    });
            },
            function (cabecera, wfCallback) {

                axios.get(eeq_url + '/consultaplanillas/servlet/gob.ec.sapconsultas502?3,' + cabecera.contrato + ',' + encodeURIComponent(cabecera.direccion) + ',' + encodeURIComponent(cabecera.lugar) + ',' + encodeURIComponent(cabecera.nombre) + ',gxPopupLevel%3D0%3B')
                    .then(function (response) {
                        let html = response.data;
                        const detalle = getDetalle(html);
                        wfCallback(null, { contrato: cabecera.contrato, cabecera: cabecera, detalle: detalle });
                    })
                    .catch(function (error) {
                        console.log(error);
                        //Registro de errores
                        wfCallback(null, { cabecera: cabecera });
                    });
            }
        ], function (error, result) {
            if (error) {
                callback(error);
            } else {
                callback(null, result);
            }
        });
    }

    function getCabecera(data) {

        const props = data.gxGrids[0][0].Props;
        //CONTRATO
        const contrato = props[0][props[0].length - 1];
        //CODIGO CLIENTE
        const codigoCliente = props[1][props[1].length - 1];
        //CEDULA
        const cedula = props[2][props[2].length - 1];
        //NOMBRE
        const nombre = props[7][props[7].length - 1];
        //DIRECCION
        const direccion = props[9][props[9].length - 1];
        //DEUDA
        const deuda = props[12][props[12].length - 1];
        //PLANILLAS PENDIENTES
        const pendientes = props[13][props[13].length - 1];
        //LUGAR
        const lugar = props[15][props[15].length - 1];

        return {
            contrato: contrato,
            codigoCliente: codigoCliente,
            cedula: cedula,
            nombre: nombre,
            direccion: direccion,
            deuda: parseFloat(deuda.replace(',', '.')),
            pendientes: parseInt(pendientes),
            lugar: lugar
        }
    }

    function getDetalle(stringHtml) {

        // DETALLE STUFF
        let aux = 'name="Grid1ContainerDataV" value=\'';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let arrStr = stringHtml.substring(0, stringHtml.indexOf('\'/>')).trim();
        arrStr = JSON.parse(arrStr);
        
        let arrayParche = [];

        for (let i = 0; i < arrStr.length; i++){

            const aux0 = '/pdf/';
            const preUrl = '/consultaplanillas/servlet/gob.ec.verfacturav2?,';
            const postUrl = ',gxPopupLevel%3D0%3B'

            arrayParche.push([
                undefined, //0
                undefined, //1
                undefined, //2
                undefined, //3
                undefined, //4
                undefined, //5
                undefined, //6
                arrStr[i][6], //7
                undefined, //8
                parseFloat(arrStr[i][8].replace(',', '.')), //9
                arrStr[i][9], //10
                eeq_url + preUrl + arrStr[i][10].substring(arrStr[i][10].indexOf(aux0) + aux0.length, arrStr[i][10].length) + postUrl, //11
                undefined, //12
                arrStr[i][13], //13
                arrStr[i][12], //14
                undefined //15
            ]);

            // arrStr[i][11] = eeq_url + preUrl + arrStr[i][10].substring(arrStr[i][10].indexOf(aux0) + aux0.length, arrStr[i][10].length) + postUrl;
            // arrStr[i][9] = parseFloat(arrStr[i][9].replace(',','.'));
            // const arr = arrStr[i][7].split('/');
            // arrStr[i].push(parseInt(arr[1]));
            // arrStr[i].push(parseInt(arr[2]));
        }

        return arrayParche;
    }

    function getDetalleV4(stringHtml) {

        // DETALLE STUFF
        let aux = 'name="Grid1ContainerDataV" value=\'';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let arrStr = stringHtml.substring(0, stringHtml.indexOf('\'/>')).trim();
        arrStr = JSON.parse(arrStr);

        for (let i = 0; i < arrStr.length; i++) {

            const aux0 = '/pdf/';
            const preUrl = '/consultaplanillas/servlet/gob.ec.verfacturav2?,';
            const postUrl = ',gxPopupLevel%3D0%3B'
            arrStr[i][11] = eeq_url + preUrl + arrStr[i][11].substring(arrStr[i][11].indexOf(aux0) + aux0.length, arrStr[i][11].length) + postUrl;
            arrStr[i][9] = parseFloat(arrStr[i][9].replace(',', '.'));
            const arr = arrStr[i][7].split('/');
            arrStr[i].push(parseInt(arr[1]));
            arrStr[i].push(parseInt(arr[2]));
        }

        return arrStr;
    }

    function getHeader(stringHtml) {

        // HEADER STUFF
        let aux = 'name="GXState" value=\'';

        stringHtml = stringHtml.substring(stringHtml.indexOf('' + aux) + aux.length, stringHtml.length - 1);

        let objStr = stringHtml.substring(0, stringHtml.indexOf('\'/></div')).trim();
        objStr = JSON.parse(objStr);

        return {
            'AJAX_SECURITY_TOKEN': objStr.AJAX_SECURITY_TOKEN,
            'X-GXAUTH-TOKEN': objStr.GX_AUTH_SAPCONSULTAS,
            'GxAjaxRequest': '1',
            'Content-Type': 'application/json'
        }
    }

    function getHeaderDefault() {
        return {
            'AJAX_SECURITY_TOKEN': 'c64423fb44c47ebd5632cac1efd367f0a6a6225de4f195f848c452eb3e1d0fd7',
            'X-GXAUTH-TOKEN': 'd56eee23',
            'GxAjaxRequest': '1',
            'Content-Type': 'application/json'
        }
    }

    function getObjEeq(contrato) {
        return { "MPage": false, "cmpCtx": "", "parms": ["" + contrato, 3, "", ""], "hsh": [], "objClass": "sapconsultas", "pkgName": "gob.ec", "events": ["'CONSULTAR DATOS'"], "grids": {} }
    }
}

module.exports = new Eeq();
