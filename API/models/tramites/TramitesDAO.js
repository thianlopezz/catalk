const Tramites = require('./Tramites');
const ModeloSolicitudesDAO = require('../modelo_solicitudes/ModeloSolicitudesDAO');
const ObjectId = require('mongoose').Types.ObjectId;

function TramitesDAO() {

    this.getAll = function () {

        return new Promise((resolve, reject) => {

            Tramites.find({ estado: 'A' })
                .then(tramites => resolve(tramites))
                .catch(error => {
                    console.log('Error al obtener TRAMITES: ' + error.message);
                    reject(error);
                });
        });
    };

    this.getAllConSolicitudes = function () {

        return new Promise((resolve, reject) => {

            Tramites.find({ estado: 'A' })
                .then(tramites => {

                    tramites = tramites.toJSON();

                    ModeloSolicitudesDAO.getAll()
                        .then(modelos => {

                            modelos = modelos.toJSON();

                            for (let i = 0; i < tramites.length; i++) {

                                const modelo = modelos.find(x => x._id === tramites[i].idSolicitud);
                                tramites[i].solicitud = modelo;
                            }
                            resolve(tramites)
                        })
                        .catch(() => resolve(tramites));
                })
                .catch(error => {
                    console.log('Error al obtener TRAMITES: ' + error.message);
                    reject(error);
                });
        });
    };

    this.getById = function (idTramite) {

        return new Promise((resolve, reject) => {

            Tramites.findById(ObjectId(idTramite))
                .then(result => {

                    result = result.toJSON();
                    // console.log(result);
                    
                    // OBTENGO LOS MODELOS DE SOLICITUDES
                    ModeloSolicitudesDAO.getAll()
                        .then(modelos => {

                            modelos = Object.assign([], modelos);
                            // console.log(modelos);

                            for (let i = 0; i < result.detalles.length; i++) {

                                const modelo = modelos.find(x => '' + x._id === '' + result.detalles[i].idSolicitud);
                                result.detalles[i].solicitud = modelo;
                            }

                            for (let i = 0; i < result.requisitos.length; i++) {

                                const modelo = modelos.find(x => '' + x._id === '' + result.requisitos[i].idSolicitud);
                                result.requisitos[i].solicitud = modelo;
                            }

                            resolve(result);
                        })
                        .catch(error => {
                            console.log(error);
                            resolve(result);
                        });
                })
                .catch(error => reject(error));
        });
    }

    this.getByKey = function (key) {

        return new Promise((resolve, reject) => {

            Tramites.findOne({ keyDialogflow: key })
                .then(result => {

                    // OBTENGO LOS MODELOS DE SOLICITUDES
                    ModeloSolicitudesDAO.getAll()
                        .then(modelos => {

                            modelos = Object.assign([], modelos);
                            // console.log(modelos);

                            for (let i = 0; i < result.detalles.length; i++) {

                                const modelo = modelos.find(x => '' + x._id === '' + result.detalles[i].idSolicitud);
                                result.detalles[i].solicitud = modelo;
                            }

                            for (let i = 0; i < result.requisitos.length; i++) {

                                const modelo = modelos.find(x => '' + x._id === '' + result.requisitos[i].idSolicitud);
                                result.requisitos[i].solicitud = modelo;
                            }

                            resolve(result);
                        })
                        .catch(error => {
                            console.log(error);
                            resolve(result);
                        });
                })
                .catch(error => reject(error));
        });
    }

    this.mantenimiento = function (accion, tramite) {

        return new Promise((resolve, reject) => {

            if (accion === 'I') {

                insertar(tramite)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'U') {

                actualizar(tramite)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'D') {

                desactivar(tramite)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else {

                reject(new Error('No se encontró ninguna acción.'));
            }
        });
    }

    function insertar(model) {

        return new Promise((resolve, reject) => {

            const tramite = new Tramites(model);

            tramite.save()
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function actualizar(model) {

        return new Promise((resolve, reject) => {

            Tramites.findByIdAndUpdate(model._id, model)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function desactivar(model) {

        return new Promise((resolve, reject) => {
            Tramites.findByIdAndUpdate(model._id, { estado: 'I' })
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }
}

module.exports = new TramitesDAO();
