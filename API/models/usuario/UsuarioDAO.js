
// const URL_BASE = 'http://200.69.184.189:9001/';
// const URL_BASE = 'https://catalk.herokuapp.com/';
const URL_BASE = 'http://localhost:9001/';

const md5 = require('md5');
const CorreoController = require('../../controllers/CorreoController');
const Usuario = require('./Usuario');
const ObjectId = require('mongoose').Types.ObjectId;
const moment = require('moment');

function UsuarioDAO() {

    this.login = function (usuario, callback) {

        console.log(usuario);

        Usuario.findOne({ correo: usuario.correo, contrasena: md5(usuario.contrasena) },
            function (err, _usuario) {
                if (err) {
                    callback(new Error(err));
                } else if (_usuario) {
                    console.log(_usuario);
                    callback(null, _usuario);
                } else {
                    callback(new Error('Usuario o contraseña incorrecta.'));
                }
            });
    }

    this.getAll = function () {

        return new Promise((resolve, reject) => {

            Usuario.find({ estado: 'A' })
                .then(usuarios => resolve(usuarios))
                .catch(error => {
                    console.log('Error al obtener USUARIOS: ' + error.message);
                    reject(error);
                });
        });
    };

    this.getById = function (idUsuario) {

        return new Promise((resolve, reject) => {

            Usuario.findById(ObjectId(idUsuario))
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    this.mantenimiento = function (accion, usuario) {

        return new Promise((resolve, reject) => {

            if (accion === 'I') {

                insertar(usuario)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'U') {

                actualizar(usuario)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else if (accion === 'D') {

                eliminar(usuario)
                    .then(result => resolve(result))
                    .catch(error => reject(error));
            } else {

                reject(new Error('No se encontró ninguna acción.'));
            }
        });
    }

    // BUSCO AL USUARIO POR ID Y CONTRASENA ANTERIOR
    // SI LO ENCUENTRO ACUTALIZO
    this.contrasena = function (contrasenas) {

        return new Promise((resolve, reject) => {

            Usuario.findOne({ _id: ObjectId(contrasenas.idUsuario), contrasena: md5(contrasenas.anterior) })
                .then(usuarioEncontrado => {

                    if (usuarioEncontrado) {
                        usuarioEncontrado.contrasena = md5(contrasenas.contrasena);
                        usuarioEncontrado.save()
                            .then(usuarioGuardado => resolve(''))
                            .catch(error => reject(error));
                    } else {
                        reject(new Error('Contraseña anterior incorrecta.'))
                    }
                })
                .catch(error => reject(error));
        });
    }

    // GENERO CONTRASENA RANDOM
    // SETEO ROL ADMIN POR DEFECTO
    // Y ENVIO CORREO CON LA INFORMACION
    function insertar(model) {

        return new Promise((resolve, reject) => {

            const contrasena = contrasenaRandom();

            model.contrasena = md5(contrasena);
            model.rol = 'ADMIN';

            const usuario = new Usuario(model);

            const claves = {
                nombre: model.nombre,
                correo: model.correo,
                contrasena
            }

            usuario.save()
                .then(result => {

                    CorreoController.enviar('Nuevo usuario', model.correo, './plantillas_correo/nuevousuario', claves);
                    resolve(result);
                })
                .catch(error => reject(error));
        });
    }

    // GENERO EL TOKEN CON MOMENT ENCUENTRO
    // LO ACTUALIZO ENCONTRANDOLO CON EL CORREO
    // SI NO ENCUENTRA ENVIO ERROR
    // ENVIO EL CORREO
    this.olvideContrasena = function (datos) {

        return new Promise((resolve, reject) => {

            const token = moment().format('DDMMYYYhhmmss');

            Usuario.findOneAndUpdate({ correo: datos.correo }, { tokenRecupera: token })
                .then((usuarioEncontrado) => {

                    if (usuarioEncontrado) {

                        // SETEO LA URL RECUPERA
                        const claves = {
                            nombre: usuarioEncontrado.nombre,
                            urlRecupera: URL_BASE + 'generico/RE/' + token
                        }

                        CorreoController.enviar('Recuperación de contraseña', usuarioEncontrado.correo, './plantillas_correo/recuperacontra', claves);
                        resolve('');
                    } else {
                        reject(new Error('No se encontró una cuenta con el correo ingresado.'))
                    }
                })
                .catch(error => reject(error));
        })
    }

    // BUSCO POR TOKEN
    this.recuperaContrasena = function (contrasenas) {

        return new Promise((resolve, reject) => {

            Usuario.findOne({ tokenRecupera: contrasenas.token })
                .then(usuarioEncontrado => {

                    if (usuarioEncontrado) {

                        usuarioEncontrado.contrasena = md5(contrasenas.contrasena);
                        usuarioEncontrado.tokenRecupera = undefined;

                        usuarioEncontrado.save()
                            .then(() => resolve(''))
                            .catch(error => reject(error));
                    } else {
                        reject(new Error('Token expirado.'));
                    }
                })
                .catch(error => reject(error));
        })
    }

    function actualizar(model) {

        return new Promise((resolve, reject) => {

            Usuario.findByIdAndUpdate(model._id, model)
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function eliminar(model) {

        return new Promise((resolve, reject) => {
            Usuario.deleteOne({ _id: ObjectId(model._id) })
                .then(result => resolve(result))
                .catch(error => reject(error));
        });
    }

    function contrasenaRandom() {

        const caracteres = ['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd', 'E', 'e', 'F', 'f', 'G', 'g', 'H', 'h', 'I', 'i', 'J', 'j', 'K', 'k', 'L', 'l', 'M', 'm', 'N', 'n', 'O', 'o', 'P', 'Q', 'q', 'R', 'r', 'S', 's', 'T', 't', 'U', 'u', 'V', 'v', 'X', 'x', 'Y', 'y', 'Z', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        const desde = 0;
        const hasta = caracteres.length - 1;

        return caracteres[Math.floor((Math.random() * hasta) + desde)]
            + '' + caracteres[Math.floor((Math.random() * hasta) + desde)]
            + '' + caracteres[Math.floor((Math.random() * hasta) + desde)]
            + '' + caracteres[Math.floor((Math.random() * hasta) + desde)]
            + '' + caracteres[Math.floor((Math.random() * hasta) + desde)]
            + '' + caracteres[Math.floor((Math.random() * hasta) + desde)];
    }
}

module.exports = new UsuarioDAO();
