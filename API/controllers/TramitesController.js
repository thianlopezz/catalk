const URL_BASE = require('../models/UrlConfig').URL_BASE;

const TramitesDAO = require('../models/tramites/TramitesDAO');
const ContadoresDAO = require('../models/contadores/ContadoresDAO');
const CorreoController = require('../controllers/CorreoController');

function TramitesController() {

    let fulfillmentText = '';
    let source = '';

    this.mapAction = function (request, res) {

        console.log('<<##TramitesController##>>');
        console.log('Intent>> ' + request.queryResult.intent.displayName);
        console.log('Action>> ' + request.queryResult.action);
        console.log('Parameters>> ' + JSON.stringify(request.queryResult.parameters));
        console.log('Source>> ' + JSON.stringify(request.originalDetectIntentRequest.source));

        source = request.originalDetectIntentRequest.source;

        switch (request.queryResult.action) {
            case 'getInfoTramites': getInfoTramites(res); break;
            case 'getInfoTipoTramite': getInfoTipoTramite(request.queryResult.parameters.tipoTramite, res); break;
            case 'enviaInfoTramites': enviaInfoTramites(request.queryResult.parameters.tipoTramite, request.queryResult.parameters.email, res); break;
            default: getInfoTramites(res);
        }
    };

    function enviaInfoTramites(tipoTramite, correo, res) {

        let respuestas = [];

        fulfillmentText = '';

        TramitesDAO.getByKey(tipoTramite)
            .then(tramite => {

                let infoTramite = '';

                infoTramite = infoTramite +
                    `
                <h3 style="text-align: center; color: #a74f52; padding: .7rem;">
                    ${tramite.tramite}
                </h3>
                <p>${tramite.descripcion}</p>
                <table style="width: 100%;">
                    <tr>
                        <td>
                            Valor
                        </td>
                        <td>
                            ${'$' + tramite.valor || 0}
                        </td>
                    </tr>
                </table>`;

                // ARMO DETALLES
                let detalles = `
                <h4 style="color: #676767;">Detalles</h4>
                    <ul>
                `;

                tramite.detalles.forEach(detalle => {

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

                tramite.requisitos.forEach(requisito => {

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
                    <a href="${URL_BASE + 'tramites/ex/' + encodeURIComponent(tramite._id)}">Más información</a>
                </p>`

                // AGREGO A INFOADMISION
                infoTramite = infoTramite + '' + detalles + '' + requisitos + '' + linkToInfoAdmision;

                const claves = {
                    infoTramite
                }

                CorreoController.enviar('Información de trámites - ' + tramite.tramite, correo, './plantillas_correo/infotramites', claves)
                    .then(() => {

                        // DEJO HUELLA
                        ContadoresDAO.insertar({ tipo: 'TRAMITES', idTipo: tramite._id, correo: correo });

                        fulfillmentText += 'Listo, hemos enviado toda la información a tu correo.';
                        respuestas.push({
                            text: {
                                text: [
                                    'Listo, hemos enviado toda la información a tu correo.'
                                ],
                            },
                        })

                        return res.send({
                            fulfillmentText,
                            fulfillmentMessages: respuestas
                        });
                    })
                    .catch((error) => {

                        console.log('Error >>' + error.message);

                        fulfillmentText = 'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.';
                        respuestas.push({
                            text: {
                                text: [
                                    'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.'
                                ],
                            },
                        });

                        return res.send({
                            fulfillmentText,
                            fulfillmentMessages: respuestas
                        });
                    });
            })


    }

    function getInfoTipoTramite(key, res) {

        fulfillmentText = '';

        getDetalleTramite(key, res);
    }

    function getInfoTramites(res) {

        let respuestas = [];

        fulfillmentText = '';

        TramitesDAO.getAll()
            .then(tramites => {

                fulfillmentText += 'Tenemos ' + tramites.length + ' tipos de trámites';
                respuestas.push({
                    text: {
                        text: [
                            'Tenemos', '' + tramites.length, 'tipos de trámites'
                        ],
                    },
                });

                respuestas = respuestas.concat(getTipoTramites(tramites, 'CARTA'));

                fulfillmentText += '\n¿En cuál estás interesado?';
                respuestas.push({
                    text: {
                        text: [
                            '¿En cuál estás interesado?'
                        ],
                    },
                });

                // DEJO HUELLA
                ContadoresDAO.insertar({ tipo: 'TRAMITES' });

                return res.send({
                    fulfillmentText,
                    fulfillmentMessages: respuestas
                });
            })
            .catch((error) => {

                console.log('Error >>' + error.message);

                fulfillmentText = 'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.';
                respuestas.push({
                    text: {
                        text: [
                            'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.'
                        ],
                    },
                });

                return res.send({
                    fulfillmentText,
                    fulfillmentMessages: respuestas
                });
            });
    }

    // AUXILIARES

    function getTipoTramites(tramites, tipo) {

        let respuestas = [];

        tramites.forEach(tramite => {

            fulfillmentText += '\n\n -' + tramite.tramite + '\n' + (tramite.descripcion || '') + '\n';
            fulfillmentText += '\tMás información aquí: ' + URL_BASE + 'tramites/ex/' + tramite._id;

            if (tipo === 'CARTA') {

                respuestas.push({
                    card: {
                        title: tramite.tramite,
                        subtitle: tramite.descripcion,
                        imageUri: URL_BASE + 'assets/images/tramites.png',
                        buttons: [
                            {
                                text: "Saber más",
                                postback: URL_BASE + 'tramites/ex/' + tramite._id
                            }
                        ]
                    }
                });
            } else {

                // ENVIO DESCRIPCION
                respuestas.push({
                    text: {
                        text: [
                            tramite.tramite, (tramite.descripcion || '')
                        ],
                    },
                });

                // ENVIO LINK DE DETALLE                
                respuestas.push({
                    text: {
                        text: [
                            'Más información aquí',
                            URL_BASE + 'tramites/ex/' + tramite._id
                        ],
                    },
                });
            }
        });

        return respuestas;
    }

    function getDetalleTramite(key, res) {

        let respuestas = [];

        TramitesDAO.getByKey(key)
            .then(tramite => {

                fulfillmentText += '\n' + tramite.tramite;

                respuestas.push({
                    text: {
                        text: [
                            tramite.tramite
                        ],
                    },
                });

                // VALOR TRAMITE
                let textValor = 'No tiene valor alguno.';
                let objTextValor = {
                    text: {
                        text: [
                            'No tiene valor alguno.'
                        ],
                    },
                };

                // EN CASO DE QUE TENGA VALOR
                if (tramite.valor) {

                    textValor = 'Tiene un valor de $' + admision.valor;
                    objTextValor = {
                        text: {
                            text: [
                                'Tiene un valor de $' + tramite.valor
                            ],
                        },
                    };
                }

                // AGREGO A LOS MENSAJES
                fulfillmentText += '\n' + textValor;
                respuestas.push(
                    objTextValor
                );

                // SELECCIONAMOS LOS 3 PRIMEROS
                let detallesLength = tramite.detalles.length;

                if (detallesLength > 3) {
                    detallesLength = 3;
                }

                for (let i = 0; i < detallesLength; i++) {

                    let text = '';

                    // TIPO DESCRIPCION
                    if (!tramite.detalles[i].idSolicitud && !tramite.detalles[i].link) {

                        text = text + '' + tramite.detalles[i].descripcion + '\n';
                    } else if (tramite.detalles[i].link) { // TIPO LINK

                        text = text + '' + tramite.detalles[i].descripcion + ' ' + tramite.detalles[i].link + '\n';
                    } else if (tramite.detalles[i].idSolicitud) { // TIPO MODELO SOLICITUD

                        text = text + '' + tramite.detalles[i].descripcion + ' ' + URL_BASE + 'tramites/ex/' + tramite.detalles[i].idSolicitud + '\n';
                    }

                    fulfillmentText += '\n' + text;
                    respuestas.push(text = {
                        text: {
                            text: [
                                text
                            ],
                        }
                    });
                }

                fulfillmentText += '\n' + '¿Deseas que te envíe todos los detalles y requisitos a tu correo?';
                respuestas.push({
                    text: {
                        text: [
                            '¿Deseas que te envíe todos los detalles y requisitos a tu correo?'
                        ],
                    },
                });

                // DEJO HUELLA
                ContadoresDAO.insertar({ tipo: 'TRAMITES', idTipo: tramite._id });

                return res.send({
                    fulfillmentText,
                    fulfillmentMessages: respuestas
                });
            })
            .catch((error) => {

                console.log('Error >>' + error.message);

                fulfillmentText = 'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.';
                respuestas.push({
                    text: {
                        text: [
                            'Lo siento acaba de ocurrir un error que no esperábamos, en seguida te comunicamos con el CM.'
                        ],
                    },
                });

                return res.send({
                    fulfillmentText,
                    fulfillmentMessages: respuestas
                });
            });
    }
}

module.exports = new TramitesController();
