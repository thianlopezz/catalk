let mongoose = require('mongoose');
let async = require('async');

let types = mongoose.Types;

UsuarioContrato = require('./UsuarioContrato');

function UsuarioContrato_dao() {

    this.add = function (data, callback) {

        async.waterfall([
            function (wf_callback) {

                UsuarioContrato.findOne({ idUsuario: types.ObjectId(data.idUsuario) },
                    function (error, _usuario) {

                        if (error) {

                            wf_callback(new Error(error));
                        } else {

                            wf_callback(null, _usuario);
                        }
                    });
            },
            function (_usuario, wf_callback) {

                if (_usuario === null) {

                    let usuarioContrato = new UsuarioContrato({
                        idUsuario: types.ObjectId(data.idUsuario),
                        contratos: [data.contrato]
                    });

                    usuarioContrato.save(function (error, _usuario) {

                        if (error) {

                            throw new Error(error);
                        } else {

                            wf_callback(null, _usuario);
                        }
                    });
                } else {

                    let contratos = _usuario.contratos;

                    let arr_contrato = contratos.filter(x => x.contrato === data.contrato.contrato && x.empresa === data.contrato.empresa);

                    if (arr_contrato.length === 0) {

                        contratos.push(data.contrato);

                        UsuarioContrato.update({ idUsuario: types.ObjectId(data.idUsuario) }, { $set: { contratos: contratos } },
                            function (error, _usuarioContrato) {

                                if (error) {

                                    throw new Error(error);
                                } else {

                                    wf_callback(null, _usuarioContrato);
                                }
                            });

                    } else {

                        wf_callback(null, _usuario);
                    }
                }
            }
        ], function (error, result) {

            if (error) {

                callback(error);
            } else {

                callback(null, result);
            }
        });
    }

    this.elimina = function (data, callback) {

        UsuarioContrato.findOne({ idUsuario: types.ObjectId(data.idUsuario) }, function (error, _usuario) {

            if (error) {

                callback(new Error(error));
            } else {

                let contratos = _usuario.contratos;

                let index

                if (data.contrato.empresa === 'cnt') {

                    index = contratos.findIndex(x => x.contrato === data.contrato.contrato
                        && x.empresa === data.contrato.empresa
                        && x.provincia === data.contrato.provincia);
                } else {

                    index = contratos.findIndex(x => x.contrato === data.contrato.contrato
                        && x.empresa === data.contrato.empresa);
                }


                if (index > -1) {

                    contratos.splice(index, 1);

                    UsuarioContrato.update({ idUsuario: types.ObjectId(data.idUsuario) }, { $set: { contratos: contratos } },
                        function (error, _usuarioContrato) {

                            if (error) {

                                throw new Error(error);
                            } else {

                                callback(null, _usuarioContrato);
                            }
                        });

                } else {

                    callback(null, _usuario);
                }
            }
        });
    }

    this.getAll = function (idUsuario, callback) {

        UsuarioContrato.findOne({ idUsuario: types.ObjectId(idUsuario) },
            function (error, usuarioContratos) {

                if (error) {

                    callback(new Error(error));
                } else if (usuarioContratos) {

                    callback(null, usuarioContratos.contratos);
                } else {

                    callback(null, []);
                }
            });
    }
}

module.exports = new UsuarioContrato_dao();
