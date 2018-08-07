const Admisiones = require('./Admisiones');
const ModeloSolicitudesDAO = require('../modelo_solicitudes/ModeloSolicitudesDAO');
const ObjectId = require('mongoose').Types.ObjectId;

function AdmisionesDAO() {

    this.getAll = function () {

        return new Promise((resolve, reject) => {

            Admisiones.find({ estado: 'A' })
                .then(tipoAdmisiones => resolve(tipoAdmisiones))
                .catch(error => {
                    console.log('Error al obtener TIPOS DE ADMISIONES: ' + error.message);
                    reject(error);
                });
        });
    };

    this.getById = function (idAdmision) {

        return new Promise((resolve, reject) => {

            Admisiones.findById(ObjectId(idAdmision))
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

            Admisiones.find({ keyDialogflow: key })
                .then(result => {

                    // result = result.toJSON();
                    result = result[0];
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

    this.mantenimiento = function (accion, admision) {

        return new Promise((resolve, reject) => {

            if (accion === 'I') {

                insertar(admision)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'U') {

                actualizar(admision)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'D') {

                desactivar(admision)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else {

                reject(new Error('No se encontró ninguna acción.'));
            }
        });
    }

    function insertar(model) {

        return new Promise((resolve, reject) => {

            const admision = new Admisiones(model);

            admision.save()
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function actualizar(model) {

        return new Promise((resolve, reject) => {

            Admisiones.findByIdAndUpdate(model._id, model)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function desactivar(model) {

        return new Promise((resolve, reject)=>{
            Admisiones.findByIdAndUpdate(model._id, { estado: 'I' })
                .then(result => resolve(result))
                .catch(error => reject(error));
        });        
    }
}

module.exports = new AdmisionesDAO();
