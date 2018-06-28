let md5 = require('md5');

Usuario = require('./Usuario');

function UsuarioDAO() {

    this.login = function (usuario, callback) {

        Usuario.findOne({ correo: usuario.correo, contrasena: md5(usuario.contrasena) },
            function (err, _usuario) {
                if (err) {
                    callback(new Error(err));
                } else if (_usuario) {
                    callback(null, _usuario);
                } else {
                    callback(new Error('Usuario o contraseña incorrecta.'));
                }
            });
    }
}

module.exports = new UsuarioDAO();
