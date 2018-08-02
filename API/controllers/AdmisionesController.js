// const URL_BASE = 'http://localhost:9001/';
const URL_BASE = 'https://catalk.herokuapp.com/';

const moment = require('moment');

const AdmisionesDAO = require('../models/admisiones/AdmisionesDAO');
const CorreoController = require('../controllers/CorreoController');

function AdmisionesController() {

    this.mapAction = function (request, res) {

        console.log('<<##AdmisionesController##>>');
        console.log('Intent>> ' + request.queryResult.intent.displayName);
        console.log('Action>> ' + request.queryResult.action);
        console.log('Parameters>> ' + JSON.stringify(request.queryResult.parameters));

        switch (request.queryResult.action) {
            case 'getTipoAdmisiones': getInfoBasicaAdmisiones(res); break;
            case 'getInfoAdmision': getInfoAdmision(request.queryResult.parameters.tipoAdimisiones, res); break;
            case 'enviaInfoAdmisionCorreo': enviaCorreo(request.queryResult.parameters.email, res); break;
            default: getInfoBasicaAdmisiones(res);
        }
    };

    function enviaCorreo(correo, res) {

        let respuestas = [];

        AdmisionesDAO.getAll()
            .then(tipoAdmisiones => {
                
                let infoAdmision = '';

                tipoAdmisiones.forEach(admision => {
                    
                    infoAdmision = infoAdmision + 
                    `
                <h1 style="text-align: center; background-color: #ee6e7359; color: black; padding: .7rem;">
                    ${admision.tipoAdmision}
                </h1>
                <p>${admision.descripcion}</p>
                <table style="width: 100%;">
                    <tr>
                        <td>
                            Valor
                        </td>
                        <td>
                            ${'$' + admision.valor}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Fecha de inicio
                        </td>
                        <td>
                            ${moment(admision.feInicio).format('DD[/]MM[/]YYYY')}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Fecha de finalización
                        </td>
                        <td>
                            ${moment(admision.feFin).format('DD[/]MM[/]YYYY')}
                        </td>
                    </tr>
                </table>`;

                    // ARMO DETALLES
                    let detalles = `
                <h2>Detalles</h2>
                    <ul>
                `;

                    admision.detalles.forEach(detalle => {
                        detalles = detalles
                            + `<li>${detalle}</li>`
                    });

                    detalles = detalles + '</ul>';

                    // ARMO REQUISITOS
                    let requisitos = `
                <h2>Requisitos</h2>
                    <ul>
                `;

                    admision.requisitos.forEach(requisito => {
                        requisitos = requisitos
                            + `<li>${requisito}</li>`
                    });

                    requisitos = requisitos + '</ul>';

                    // AGREGO A INFOADMISION
                    infoAdmision = infoAdmision + '' + detalles + '' + requisitos;

                });

                // DEFINIR RESERVADOS
                console.log('OJOOO DEFINIR TOKENS');
                let claves = '';
                claves = claves + 'infoAdmision&' + infoAdmision + '|';
                claves = claves + 'correoAdmin&' + 'ingenieria.ucsg@gmail.com' + '|';

                CorreoController.enviar('Información de admisiones', correo, './plantillas_correo/infoadmisiones', claves)
                    .then(() => {

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

    function getInfoAdmision(key, res) {

        // AQUI SE CAMBIA POR KEY UNICO DESDE LA BD
        if (key === 'examen.admision') {
            key = '5b3424ca66fc60d3c466b655';
        } else if (key === 'curso.nivelacion') {
            key = '5b353c33d4738f21ace9c131';
        }

        getDetalleAdmision(key, res);
    }

    function getInfoBasicaAdmisiones(res) {

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

                respuestas = respuestas.concat(getTipoAdmisiones(tipoAdmisiones, 'CARTA'));

                respuestas.push({
                    text: {
                        text: [
                            '¿En cuál estás interesado?'
                        ],
                    },
                });


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

    function getTipoAdmisiones(tipoAdmisiones, tipo) {

        let respuestas = [];

        if (tipo === 'CARTA') {

            tipoAdmisiones.forEach(admision => {
                respuestas.push({
                    card: {
                        title: admision.tipoAdmision,
                        subtitle: admision.descripcion,
                        // "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
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

    function getDetalleAdmision(idAdmision, res) {

        let respuestas = [];

        AdmisionesDAO.getById(idAdmision)
            .then(admision => {

                respuestas.push({
                    text: {
                        text: [
                            admision.tipoAdmision
                        ],
                    },
                });

                if (admision.valor) {

                    respuestas.push({
                        text: {
                            text: [
                                'Tiene un valor de $' + admision.valor
                            ],
                        },
                    });
                }

                if (admision.feInicio) {

                    respuestas.push({
                        text: {
                            text: [
                                'Inicia el ' + moment(admision.feInicio).format('DD[/]MM[/]YYYY')
                            ],
                        },
                    });
                }

                if (admision.feFin) {

                    let prefix = (admision.feInicio) ? 'Y finaliza' : 'Finaliza'

                    respuestas.push({
                        text: {
                            text: [
                                prefix + ' el ' + moment(admision.feFin).format('DD[/]MM[/]YYYY')
                            ],
                        },
                    });
                }

                // SELECCIONAMOS LOS 3 PRIMEROS
                let detallesLength = admision.detalles.length;

                if (detallesLength > 3) {
                    detallesLength = 3;
                }

                for (let i = 0; i < detallesLength; i++) {

                    respuestas.push({
                        text: {
                            text: [
                                admision.detalles[i]
                            ],
                        },
                    });
                }

                respuestas.push({
                    text: {
                        text: [
                            '¿Deseas que te envíe todos los detalles y requisitos a tu correo?'
                        ],
                    },
                });

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
