const async = require('async');
const Contadores = require('./Contadores');

const AdmisionesDAO = require('../admisiones/AdmisionesDAO');
const ModeloSolicitudesDAO = require('../modelo_solicitudes/ModeloSolicitudesDAO');
const TramitesDAO = require('../tramites/TramitesDAO');
// const ObjectId = require('mongoose').Types.ObjectId;

function ContadoresDAO() {

    this.getCorreos = function(){

        return new Promise((resolve, reject) => {

            Contadores.find({ correo: { $exists: true } }).sort({ fe_creacion: -1 })
                .then(correos => {
                    console.log(correos);
                    resolve(correos);
                })
                .catch(error => {
                    console.log('Error al obtener los correos de seguimiento: ' + error.message);
                    reject(error);
                });
        });
    }

    this.insertar = function (model) {
        
        return new Promise((resolve, reject) => {

            const contador = new Contadores(model);

            contador.save()
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    this.getEstadistica = function () {

        return new Promise((resolve, reject) => {

            async.parallel({
                generalPorMes: getGeneralPorMes,
                tipoAdmisionesPorMes: getTipoAdmisionesPorMes,
                tipoTramitesPorMes: getTipoTramitesPorMes,
                tipoModelosPorMes: getTipoModelosPorMes,

                correosAdmisionesPorMes: getCorreosAdmisionesPorMes,
                correosTramitesPorMes: getCorreosTramitesPorMes,
                correosModelosPorMes: getCorreosModelosPorMes,

                admisiones: getAdmisiones,
                tramites: getTramites,
                modelos: getSolicitudes,
            },
                // optional callback
                function (error, results) {

                    if(error){
                        reject(error);
                    } else {

                        // the results array will equal ['one','two'] even though
                        // the second function had a shorter timeout.
                        resolve(results);
                    }
                });
        });
    }

    // RETORNA CONTADORES FILTRADOS POR TIPO (ADMISIONES - MODELOS - TRAMITES)
    // POR MES, COGE TODOS SIN FILTRAR SI ES CORREO O NO
    function getGeneralPorMes(callback) {        

        // { $dayOfMonth: "$fe_creacion", $month: "$fe_creacion", $year: "$fe_creacion" }
        Contadores.aggregate([
            { "$group": { _id: { tipo: "$tipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
        ])
            .then(registros => {
                callback(null, registros);
            })
            .catch(error => {
                console.log('Error>> getGeneralPorMes()>>' + error.message);
                callback(error);
            });
    }

    // RETORNA LOS CONTADORES FILTRADO POR TIPO DE ADMISIONES,
    // NO TOMA EN CUENTA CORREOS
    function getTipoAdmisionesPorMes(callback) {

        async.parallel([
            function(cb_parallel){

                Contadores.aggregate([
                    { $match: { tipo: 'ADMISIONES', idTipo: { $exists: true }, correo: { $exists: false } } },
                    { $group: { _id: { idTipo: "$idTipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
                ])
                    .then(registros => {
                        cb_parallel(null, registros);
                    })
                    .catch(error => {
                        console.log('Error>> getTipoAdmisionesPorMes()>>' + error.message);
                        cb_parallel(error);
                    });
            },
            function (cb_parallel) {
                
                AdmisionesDAO.getAll()
                    .then(admisiones => cb_parallel(null, admisiones))
                .catch(error=>cb_parallel(error))
            }
        ], function(error, results){

            if (error) callback(error);
            
            let registros = results[0];
            const admisiones = results[1];

            for (let i = 0; i < registros.length; i++){

                let admision = admisiones.find(x => '' + x._id === '' + registros[i]._id.idTipo);
                registros[i]._id.admision = admision.tipoAdmision;
            }

            callback(null, registros);
        });
    }

    // RETORNA LOS CONTADORES FILTRADO POR TIPO DE MODELOS DE SOLICITUDES,
    // NO TOMA EN CUENTA CORREOS
    function getTipoModelosPorMes(callback) {

        async.parallel([
            function (cb_parallel) {

                Contadores.aggregate([
                    { $match: { tipo: 'MODELOS', idTipo: { $exists: true }, correo: { $exists: false } } },
                    { $group: { _id: { idTipo: "$idTipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
                ])
                    .then(registros => {
                        cb_parallel(null, registros);
                    })
                    .catch(error => {
                        console.log('Error>> getTipoAdmisionesPorMes()>>' + error.message);
                        cb_parallel(error);
                    });
            },
            function (cb_parallel) {

                ModeloSolicitudesDAO.getAll()
                    .then(modelos => cb_parallel(null, modelos))
                    .catch(error => cb_parallel(error))
            }
        ], function (error, results) {

            if (error) callback(error);

            let registros = results[0];
            const modelos = results[1];

            for (let i = 0; i < registros.length; i++) {

                let modelo = modelos.find(x => '' + x._id === '' + registros[i]._id.idTipo);
                registros[i]._id.modelo = modelo.solicitud;
            }

            callback(null, registros);
        });
    }

    // RETORNA LOS CONTADORES FILTRADO POR TIPO DE TRAMITES,
    // NO TOMA EN CUENTA CORREOS
    function getTipoTramitesPorMes(callback) {

        async.parallel([
            function (cb_parallel) {

                Contadores.aggregate([
                    { $match: { tipo: 'TRAMITES', idTipo: { $exists: true }, correo: { $exists: false } } },
                    { $group: { _id: { idTipo: "$idTipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
                ])
                    .then(registros => {
                        cb_parallel(null, registros);
                    })
                    .catch(error => {
                        console.log('Error>> getTipoTramitesPorMes()>>' + error.message);
                        cb_parallel(error);
                    });
            },
            function (cb_parallel) {

                TramitesDAO.getAll()
                    .then(tramites => cb_parallel(null, tramites))
                    .catch(error => cb_parallel(error))
            }
        ], function (error, results) {

            if (error) callback(error);

            let registros = results[0];
            const tramites = results[1];

            for (let i = 0; i < registros.length; i++) {

                let tramite = tramites.find(x => '' + x._id === '' + registros[i]._id.idTipo);
                registros[i]._id.tramite = tramite.tramite;
            }

            callback(null, registros);
        });
    }

    // CORREOS

    // RETORNA LOS CONTADORES DE CORREOS FILTRADO POR TIPO DE ADMISIONES
    function getCorreosAdmisionesPorMes(callback) {

        async.parallel([
            function (cb_parallel) {

                Contadores.aggregate([
                    { $match: { tipo: 'ADMISIONES', idTipo: { $exists: true }, correo: { $exists: true } } },
                    { $group: { _id: { idTipo: "$idTipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
                ])
                    .then(registros => {
                        cb_parallel(null, registros);
                    })
                    .catch(error => {
                        console.log('Error>> getCorreosAdmisionesPorMes()>>' + error.message);
                        cb_parallel(error);
                    });
            },
            function (cb_parallel) {

                AdmisionesDAO.getAll()
                    .then(admisiones => cb_parallel(null, admisiones))
                    .catch(error => cb_parallel(error))
            }
        ], function (error, results) {

            if (error) callback(error);

            let registros = results[0];
            const admisiones = results[1];

            for (let i = 0; i < registros.length; i++) {

                let admision = admisiones.find(x => '' + x._id === '' + registros[i]._id.idTipo);
                registros[i]._id.admision = admision.tipoAdmision;
            }

            callback(null, registros);
        });
    }

    // RETORNA LOS CONTADORES DE CORREOS FILTRADO POR TIPO DE MODELOS DE SOLICITUDES
    function getCorreosModelosPorMes(callback) {

        async.parallel([
            function (cb_parallel) {

                Contadores.aggregate([
                    { $match: { tipo: 'MODELOS', idTipo: { $exists: true }, correo: { $exists: true } } },
                    { $group: { _id: { idTipo: "$idTipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
                ])
                    .then(registros => {
                        cb_parallel(null, registros);
                    })
                    .catch(error => {
                        console.log('Error>> getTipoAdmisionesPorMes()>>' + error.message);
                        cb_parallel(error);
                    });
            },
            function (cb_parallel) {

                ModeloSolicitudesDAO.getAll()
                    .then(modelos => cb_parallel(null, modelos))
                    .catch(error => cb_parallel(error))
            }
        ], function (error, results) {

            if (error) callback(error);

            let registros = results[0];
            const modelos = results[1];

            for (let i = 0; i < registros.length; i++) {

                let modelo = modelos.find(x => '' + x._id === '' + registros[i]._id.idTipo);
                registros[i]._id.modelo = modelo.solicitud;
            }

            callback(null, registros);
        });
    }

    // RETORNA LOS CONTADORES FILTRADO POR TIPO DE TRAMITES,
    // NO TOMA EN CUENTA CORREOS
    function getCorreosTramitesPorMes(callback) {

        async.parallel([
            function (cb_parallel) {

                Contadores.aggregate([
                    { $match: { tipo: 'TRAMITES', idTipo: { $exists: true }, correo: { $exists: true } } },
                    { $group: { _id: { idTipo: "$idTipo", mes: { $month: "$fe_creacion" }, anio: { $year: "$fe_creacion" } }, count: { $sum: 1 } } }
                ])
                    .then(registros => {
                        cb_parallel(null, registros);
                    })
                    .catch(error => {
                        console.log('Error>> getTipoTramitesPorMes()>>' + error.message);
                        cb_parallel(error);
                    });
            },
            function (cb_parallel) {

                TramitesDAO.getAll()
                    .then(tramites => cb_parallel(null, tramites))
                    .catch(error => cb_parallel(error))
            }
        ], function (error, results) {

            if (error) callback(error);

            let registros = results[0];
            const tramites = results[1];

            for (let i = 0; i < registros.length; i++) {

                let tramite = tramites.find(x => '' + x._id === '' + registros[i]._id.idTipo);
                registros[i]._id.tramite = tramite.tramite;
            }

            callback(null, registros);
        });
    }

    // PARA OBTENER CATALOGOS
    function getAdmisiones(callback) {
        AdmisionesDAO.getAll()
            .then(admisiones => callback(null, admisiones))
            .catch(error => callback(error));
    }

    function getTramites(callback) {
        TramitesDAO.getAll()
            .then(tramites => callback(null, tramites))
            .catch(error => callback(error));
    }

    function getSolicitudes(callback) {
        ModeloSolicitudesDAO.getAll()
            .then(modelos => callback(null, modelos))
            .catch(error => callback(error));
    }
}

module.exports = new ContadoresDAO();
