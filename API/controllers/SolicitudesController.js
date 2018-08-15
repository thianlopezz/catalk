const URL_BASE = require('../models/UrlConfig').URL_BASE;

const SolicitudesDAO = require('../models/modelo_solicitudes/ModeloSolicitudesDAO');
const ContadoresDAO = require('../models/contadores/ContadoresDAO');
const CorreoController = require('../controllers/CorreoController');

function SolicitudesController() {

    this.mapAction = function (request, res) {

        console.log('<<##SolicitudesController##>>');
        console.log('Intent>> ' + request.queryResult.intent.displayName);
        console.log('Action>> ' + request.queryResult.action);
        console.log('Parameters>> ' + JSON.stringify(request.queryResult.parameters));

        switch (request.queryResult.action) {
            case 'getInfoSolicitudes': getInfoSolicitudes(res); break;
            case 'getInfoTipoSolicitud': getInfoTipoSolicitud(request.queryResult.parameters.tipoSolicitud, res); break;
            case 'enviaInfoSolicitudes': enviaInfoSolicitudes(request.queryResult.parameters.tipoSolicitud, request.queryResult.parameters.email, res); break;
            default: getInfoSolicitudes(res);
        }
    };

    function enviaInfoSolicitudes(key, correo, res) {

        let respuestas = [];

        SolicitudesDAO.getByKey(key)
            .then(solicitud => {

                let infoSolicitud = '';

                infoSolicitud = infoSolicitud +
                    `
                <h3 style="text-align: center; color: #a74f52; padding: .7rem;">
                    ${solicitud.solicitud}
                </h3>
                <p>${solicitud.descripcion}</p>
                <p style="text-align: center">
                    <a href="${URL_BASE + '' + encodeURIComponent(solicitud.archivo)}">DESCARGAR ADJUNTO</a>
                </p>
                <p style="text-align: center">
                    <a href="${URL_BASE + 'solicitudes/ex/' + encodeURIComponent(solicitud._id)}">Más información</a>
                </p>`;

                const claves = {
                    infoSolicitud
                }

                CorreoController.enviar('Modelo de solicitud - ' + solicitud.solicitud, correo, './plantillas_correo/infosolicitud', claves)
                    .then(() => {

                        // DEJO HUELLA
                        ContadoresDAO.insertar({ tipo: 'MODELOS', idTipo: solicitud._id, correo: correo });

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

    function getInfoTipoSolicitud(key, res) {
        getDetalleSolicitud(key, res);
    }

    function getInfoSolicitudes(res) {

        let respuestas = [];

        SolicitudesDAO.getAll()
            .then(solicitudes => {

                respuestas.push({
                    text: {
                        text: [
                            'Tenemos', '' + solicitudes.length, 'modelos de solicitudes'
                        ],
                    },
                });

                respuestas = respuestas.concat(getModeloDeSolicitudes(solicitudes, 'CARTA'));

                respuestas.push({
                    text: {
                        text: [
                            '¿En cuál estás interesado?'
                        ],
                    },
                });

                // DEJO HUELLA
                ContadoresDAO.insertar({ tipo: 'MODELOS' });

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

    // AUXILIARES

    function getModeloDeSolicitudes(solicitudes, tipo) {

        let respuestas = [];

        if (tipo === 'CARTA') {

            solicitudes.forEach(solicitud => {
                respuestas.push({
                    card: {
                        title: solicitud.solicitud,
                        subtitle: solicitud.descripcion,
                        imageUri: URL_BASE + 'assets/images/modelos.png',
                        buttons: [
                            {
                                text: "Saber más",
                                postback: URL_BASE + 'solicitudes/ex/' + solicitud._id
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

            solicitudes.forEach(admision => {
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

            solicitudes.forEach(admision => {
                respuestas.push({
                    text: {
                        text: [
                            admision.tipoAdmision, (admision.descripcion || '')
                        ],
                    },
                });
            });
        }

        return respuestas;
    }

    function getDetalleSolicitud(key, res) {

        let respuestas = [];

        SolicitudesDAO.getByKey(key)
            .then(solicitud => {

                respuestas.push({
                    text: {
                        text: [
                            solicitud.solicitud, solicitud.descripcion, `${URL_BASE + '' + encodeURIComponent(solicitud.archivo)}`
                        ],
                    },
                });

                respuestas.push({
                    text: {
                        text: [
                            '¿Deseas que te envíe todos los detalles a tu correo?'
                        ],
                    },
                });

                // DEJO HUELLA
                ContadoresDAO.insertar({ tipo: 'MODELOS', idTipo: solicitud._id });

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

module.exports = new SolicitudesController();
