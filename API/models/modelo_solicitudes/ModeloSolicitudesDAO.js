const ModeloSoicitudes = require('./ModeloSolicitudes');
const ObjectId = require('mongoose').Types.ObjectId;

function ModeloSolicitudesDAO() {

    this.getAll = function () {

        return new Promise((resolve, reject) => {

            ModeloSoicitudes.find({ estado: 'A' })
                .then(modelos => resolve(modelos))
                .catch(error => {
                    console.log('Error al obtener MODELO DE SOLICITUDES: ' + error.message);
                    reject(error);
                });
        });
    };

    this.getById = function (idSolicitud) {

        return new Promise((resolve, reject) => {

            ModeloSoicitudes.findById(ObjectId(idSolicitud))
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    this.mantenimiento = function (accion, solicitud) {

        return new Promise((resolve, reject) => {

            if (accion === 'I') {

                insertar(solicitud)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'U') {

                actualizar(solicitud)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'D') {

                desactivar(solicitud)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else {

                reject(new Error('No se encontró ninguna acción.'));
            }
        });
    }

    function insertar(model) {

        return new Promise((resolve, reject) => {

            const solicitud = new ModeloSoicitudes(model);

            solicitud.save()
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function actualizar(model) {

        return new Promise((resolve, reject) => {

            ModeloSoicitudes.findByIdAndUpdate(model._id, model)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function desactivar(model) {

        return new Promise((resolve, reject) => {
            ModeloSoicitudes.findByIdAndUpdate(model._id, { estado: 'I' })
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }
}

module.exports = new ModeloSolicitudesDAO();
