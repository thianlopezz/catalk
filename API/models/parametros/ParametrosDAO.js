const Parametros = require('./Parametros');

function ParametrosDAO() {

    this.get = function () {

        return new Promise((resolve, reject) => {

            Parametros.find()
                .then(parametros => resolve(parametros[0]))
                .catch(error => {
                    console.log('Error al obtener TRAMITES: ' + error.message);
                    reject(error);
                });
        });
    };

    this.mantenimiento = function (accion, parametro) {

        return new Promise((resolve, reject) => {

            if (accion === 'I') {

                insertar(parametro)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'U') {

                actualizar(parametro)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else {

                reject(new Error('No se encontró ninguna acción.'));
            }
        });
    }

    function insertar(model) {

        return new Promise((resolve, reject) => {

            const parametro = new Parametros(model);

            parametro.save()
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function actualizar(model) {

        return new Promise((resolve, reject) => {

            Parametros.findByIdAndUpdate(model._id, model)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }
}

module.exports = new ParametrosDAO();
