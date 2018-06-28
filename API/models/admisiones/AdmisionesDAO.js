Admisiones = require('./Admisiones');

function AdmisionesDAO() {

    this.getAll = function (callback) {

        Admisiones.find({}, function (error, result) {
            if (error) {
                callback(new Error(error));
            } else {
                callback(null, result);
            }
        });
    }

    this.getById = function (idAdmision, callback) {

        Admisiones.findById(idAdmision, function (error, result) {
            if (error) {
                callback(new Error(error));
            } else {
                callback(null, result);
            }
        });
    }

    this.mantenimiento = function (accion, admision, callback) {
        
        if (accion === 'I') {

            insertar(admision, function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        } else if (accion === 'U') {

            actualizar(admision, function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        } else if (accion === 'D') {

            desactivar(admision, function (error, result) {
                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
        } else {

            callback(new Error('No se encontró ninguna acción.'));
        }
    }

    function insertar(model, callback) {

        const admision = new Admisiones(model);

        admision.save(function (error, result) {

            if (error) {
                callback(error);
            } else {
                callback(null, result);
            }
        });
    }

    function actualizar(model, callback) {

        Admisiones.findByIdAndUpdate(model._id, model,
            function (error, result) {

                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
    }

    function desactivar(model, callback) {

        Admisiones.findByIdAndUpdate(model._id, { estado: 'I' },
            function (error, result) {

                if (error) {
                    callback(error);
                } else {
                    callback(null, result);
                }
            });
    }
}

module.exports = new AdmisionesDAO();
