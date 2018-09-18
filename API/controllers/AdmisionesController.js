const URL_BASE = require('../models/UrlConfig').URL_BASE;

const moment = require('moment');

const AdmisionesDAO = require('../models/admisiones/AdmisionesDAO');
const ContadoresDAO = require('../models/contadores/ContadoresDAO');
const CorreoController = require('../controllers/CorreoController');

function AdmisionesController() {

    this.mapAction = function (request, res) {

        console.log('<<##AdmisionesController##>>');
        console.log('Intent>> ' + request.queryResult.intent.displayName);
        console.log('Action>> ' + request.queryResult.action);
        console.log('Parameters>> ' + JSON.stringify(request.queryResult.parameters));

        switch (request.queryResult.action) {
            case 'getInfoAdmisiones': getInfoAdmisiones(request.originalDetectIntentRequest.source, res); break;
            case 'getInfoTipoAdmision': getInfoTipoAdmision(request.queryResult.parameters.tipoAdmisiones, request.originalDetectIntentRequest.source, res); break;
            case 'enviaInfoAdmisiones': enviaInfoAdmisiones(request.queryResult.parameters.tipoAdmisiones, request.originalDetectIntentRequest.source, request.queryResult.parameters.email, res); break;
            default: getInfoAdmisiones(res);
        }
    };

    function enviaInfoAdmisiones(tipoAdmision, correo, res) {

        let respuestas = [];

        AdmisionesDAO.getByKey(tipoAdmision)
            .then(admision => {

                let infoAdmision = '';

                infoAdmision = infoAdmision +
                    `
                <h3 style="text-align: center; color: #a74f52; padding: .7rem;">
                    ${admision.tipoAdmision}
                </h3>
                <p>${admision.descripcion}</p>
                <table style="width: 100%;">
                    <tr>
                        <td>
                            Valor
                        </td>
                        <td>
                            ${'$' + admision.valor || 0}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Fecha de inicio
                        </td>
                        <td>
                            ${admision.feInicio ? moment(admision.feInicio).format('DD[/]MM[/]YYYY') : 'Por definir'}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Fecha de finalización
                        </td>
                        <td>
                            ${admision.feFin ? moment(admision.feFin).format('DD[/]MM[/]YYYY') : 'Por definir'}
                        </td>
                    </tr>
                </table>`;

                // ARMO DETALLES
                let detalles = `
                <h4 style="color: #676767;">Detalles</h4>
                    <ul>
                `;

                admision.detalles.forEach(detalle => {

                    if (!detalle.idSolicitud && !detalle.link) {

                        detalles = detalles
                            + `<li>${detalle.descripcion}</li>`;
                    } else if (detalle.link) { // TIPO LINK

                        detalles = detalles
                            + `<li>
                            ${detalle.descripcion} 
                            <a href="${detalle.link} ">ENLACE</a>
                            </li>`;
                    } else if (detalle.idSolicitud) { // TIPO MODELO SOLICITUD

                        detalles = detalles
                            + `<li>
                            ${detalle.descripcion} 
                            <a href="${URL_BASE + 'solicitudes/ex/' + encodeURIComponent(detalle.idSolicitud)}">MODELO DE SOLICITUD</a>
                            </li>`;

                        console.log('/' + detalle.idSolicitud + '.');
                    }
                });

                detalles = detalles + '</ul>';

                // ARMO REQUISITOS
                let requisitos = `
                <h4 style="color: #676767;">Requisitos</h4>
                    <ul>
                `;

                admision.requisitos.forEach(requisito => {

                    if (!requisito.idSolicitud && !requisito.link) {

                        requisitos = requisitos
                            + `<li>${requisito.descripcion}</li>`;
                    } else if (requisito.link) { // TIPO LINK

                        requisitos = requisitos
                            + `<li>
                            ${requisito.descripcion} 
                            <a href="${requisito.link} ">ENLACE</a>
                            </li>`;
                    } else if (requisito.idSolicitud) { // TIPO MODELO SOLICITUD

                        requisitos = requisitos
                            + `<li>
                            ${requisito.descripcion} 
                            <a href="${URL_BASE + 'solicitudes/ex/' + encodeURIComponent(requisito.idSolicitud)}">MODELO DE SOLICITUD</a>
                            </li>`;
                    }
                });

                requisitos = requisitos + '</ul>';

                const linkToInfoAdmision = `<p style="text-align: center;">
                    <a href="${URL_BASE + 'admisiones/ex/' + encodeURIComponent(admision._id)}">Más información</a>
                </p>`

                // AGREGO A INFOADMISION
                infoAdmision = infoAdmision + '' + detalles + '' + requisitos + '' + linkToInfoAdmision;

                const claves = {
                    infoAdmision
                }

                CorreoController.enviar('Información de admisiones - ' + admision.tipoAdmision, correo, './plantillas_correo/infoadmisiones', claves)
                    .then(() => {

                        // DEJO HUELLA
                        ContadoresDAO.insertar({ tipo: 'ADMISIONES', idTipo: admision._id, correo: correo });

                        respuestas.push({
                            text: {
                                text: [
                                    'Listo, hemos enviado toda la información a tu correo.'
                                ],
                            },
                        })

                        return res.send({
                            fulfillmentMessages: respuestas
                        });
                    })
                    .catch((error) => {

                        console.log('Error >>' + error.message);

                        respuestas.push({
                            text: {
                                text: [
                                    'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.'
                                ],
                            },
                        });

                        return res.send({
                            fulfillmentMessages: respuestas
                        });
                    });
            })


    }

    function getInfoTipoAdmision(key, res) {

        getDetalleAdmision(key, res);
    }

    function getInfoAdmisiones(source, res) {

        let respuestas = [];

        AdmisionesDAO.getAll()
            .then(tipoAdmisiones => {

                respuestas.push({
                    text: {
                        text: [
                            'Tenemos', '' + tipoAdmisiones.length, 'tipos de admisiones'
                        ],
                    },
                });

                if (source ==='twitter'){
                    respuestas = respuestas.concat(getTipoAdmisiones(tipoAdmisiones));
                } else {
                    respuestas = respuestas.concat(getTipoAdmisiones(tipoAdmisiones, 'CARTA'));
                }                

                respuestas.push({
                    text: {
                        text: [
                            '¿En cuál estás interesado?'
                        ],
                    },
                });

                // DEJO HUELLA
                ContadoresDAO.insertar({ tipo: 'ADMISIONES' });

                console.log(JSON.stringify(respuestas));

                return res.send({
                    fulfillmentText: 'Hello!',
                    fulfillmentMessages: respuestas
                });
            })
            .catch((error) => {

                console.log('Error >>' + error.message);

                respuestas.push({
                    text: {
                        text: [
                            'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.'
                        ],
                    },
                });

                return res.send({
                    fulfillmentMessages: respuestas
                });
            });
    }

    // AUXILIARES

    function getTipoAdmisiones(tipoAdmisiones, tipo) {

        let respuestas = [];

        if (tipo === 'CARTA') {

            tipoAdmisiones.forEach(admision => {
                respuestas.push({
                    card: {
                        title: admision.tipoAdmision,
                        subtitle: admision.descripcion,
                        imageUri: URL_BASE + 'assets/images/admisiones.png',
                        buttons: [
                            {
                                text: "Saber más",
                                postback: URL_BASE + 'admisiones/ex/' + admision._id
                            }
                        ]
                    }
                });
            });
        } else if (tipo === 'LISTA') {

            let listSelect = {
                title: 'Lista',
                items: []
            }

            tipoAdmisiones.forEach(admision => {
                listSelect.items.push({
                    "info": {
                        "key": "key1",
                        "synonyms": [
                            "key"
                        ]
                    },
                    "title": "item titulo",
                    "description": "descripcion itme",
                    "image": {}
                }
                    // ,
                    // {
                    //     "description": "Item Two Description",
                    //     "image": {
                    //         "url": "http://imageTwoUrl.com",
                    //         "accessibilityText": "Image description for screen readers"
                    //     },
                    //     "optionInfo": {
                    //         "key": "itemTwo",
                    //         "synonyms": [
                    //             "thing two",
                    //             "object two"
                    //         ]
                    //     },
                    //     "title": "Item Two"
                    // }
                );
            });

            respuestas.push({ listSelect });
        } else {

            tipoAdmisiones.forEach(admision => {

                // ENVIO DESCRIPCION
                respuestas.push({
                    text: {
                        text: [
                            admision.tipoAdmision, (admision.descripcion || '')
                        ],
                    },
                });

                // ENVIO LINK DE DETALLE                
                respuestas.push({
                    text: {
                        text: [
                            'Más información aquí',
                            URL_BASE + 'admisiones/ex/' + admision._id
                        ],
                    },
                });
            });
        }

        return respuestas;
    }

    function getDetalleAdmision(key, res) {

        let respuestas = [];

        AdmisionesDAO.getByKey(key)
            .then(admision => {

                respuestas.push({
                    text: {
                        text: [
                            admision.tipoAdmision
                        ],
                    },
                });

                // VALOR ADMISION
                let objTextValor = {
                    text: {
                        text: [
                            'No tiene valor alguno.'
                        ],
                    },
                };

                // EN CASO DE QUE TENGA VALOR
                if (admision.valor) {

                    objTextValor = {
                        text: {
                            text: [
                                'Tiene un valor de $' + admision.valor
                            ],
                        },
                    };
                }

                // AGREGO A LOS MENSAJES
                respuestas.push(
                    objTextValor
                );

                // FECHAS DE INICIO
                let objTextFeIni = {
                    text: {
                        text: [
                            'Aún no se define la fecha inicio.'
                        ],
                    },
                };

                // EN CASO DE QUE TENGA FECHA DE INICIO DEFINIDA
                if (admision.feInicio) {

                    objTextFeIni = {
                        text: {
                            text: [
                                'Inicia el ' + moment(admision.feInicio).format('DD[/]MM[/]YYYY')
                            ],
                        },
                    };
                }

                // AGREGO A LOS MENSAJES
                respuestas.push(
                    objTextFeIni
                );

                // FECHAS DE FIN
                let objTextFeFin = {
                    text: {
                        text: [
                            'Aún no se define la fecha de finalización.'
                        ],
                    },
                };

                if (admision.feFin) {

                    let prefix = (admision.feInicio) ? 'Y finaliza' : 'Finaliza'

                    objTextFeFin = {
                        text: {
                            text: [
                                prefix + ' el ' + moment(admision.feFin).format('DD[/]MM[/]YYYY')
                            ],
                        },
                    };
                }

                // AGREGO A LOS MENSAJES
                respuestas.push(
                    objTextFeFin
                );

                // SELECCIONAMOS LOS 3 PRIMEROS
                let detallesLength = admision.detalles.length;

                if (detallesLength > 3) {
                    detallesLength = 3;
                }

                for (let i = 0; i < detallesLength; i++) {

                    let text = '';

                    // TIPO DESCRIPCION
                    if (!admision.detalles[i].idSolicitud && !admision.detalles[i].link) {

                        text = text + '' + admision.detalles[i].descripcion + '\n';
                    } else if (admision.detalles[i].link) { // TIPO LINK

                        text = text + '' + admision.detalles[i].descripcion + ' ' + admision.detalles[i].link + '\n';
                    } else if (admision.detalles[i].idSolicitud) { // TIPO MODELO SOLICITUD

                        text = text + '' + admision.detalles[i].descripcion + ' ' + URL_BASE + 'solicitudes/ex/' + admision.detalles[i].idSolicitud + '\n';
                    }

                    respuestas.push(text = {
                        text: {
                            text: [
                                text
                            ],
                        }
                    });
                }

                respuestas.push({
                    text: {
                        text: [
                            '¿Deseas que te envíe todos los detalles y requisitos a tu correo?'
                        ],
                    },
                });

                // DEJO HUELLA
                ContadoresDAO.insertar({ tipo: 'ADMISIONES', idTipo: admision._id });

                return res.send({
                    fulfillmentMessages: respuestas
                });
            })
            .catch((error) => {

                console.log('Error >>' + error.message);

                respuestas.push({
                    text: {
                        text: [
                            'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.'
                        ],
                    },
                });

                return res.send({
                    fulfillmentMessages: respuestas
                });
            });
    }
}

module.exports = new AdmisionesController();
