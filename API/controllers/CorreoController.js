
const template = require('email-templates').EmailTemplate;
const async = require('async');
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const ParametrosDAO = require('../models/parametros/ParametrosDAO');

function CorreoController() {

    let options = {
        auth: {
            api_user: 'thianlopezz',
            api_key: 'thian1616'
        }
    }

    let sender = 'noreplay@ucsg.computacion.com';

    this.enviar = function (asunto, destinatario, plantilla, claves) {

        return new Promise((resolve, reject) => {

            try {
                async.waterfall([
                    function (next) {

                        // OBTENGO LOS PARAMETROS DEL SISTEMA
                        ParametrosDAO.get()
                            .then(parametros => {

                                // CONFIGURO PARAMETROS
                                claves.correoAdmin = parametros.correoContacto;
                                claves.fb = parametros.fb;
                                claves.tw = parametros.tw;
                                claves.ig = parametros.ig;
                                claves.in = parametros.in;

                                sender = parametros.senderSmtp;
                                options.auth.api_user = parametros.usuarioSmtp;
                                options.auth.api_key = parametros.contrasenaSmtp;

                                // const datos = getDiccionario(claves);
                                const datos = claves;

                                var motor = new template(plantilla);
                                motor.render(datos, function (error, resultado) {

                                    if (resultado === undefined) {
                                        console.log('Error de plantilla html>>' + error.message)
                                        next({ success: false, error });
                                    } else {
                                        next(resultado.html);
                                    }
                                });
                            }).catch(error => {
                                //HANDLE ERROR
                            });
                    }
                ], function (html) {

                    if (html.error) {
                        console.log('Error en el envio de correo ' + html.error.message);
                        reject(html.error);
                    }

                    var client = nodemailer.createTransport(sgTransport(options));

                    var email = {
                        from: sender,
                        to: destinatario,
                        subject: asunto,
                        html: html
                    };

                    client.sendMail(email, function (error, info) {

                        if (error) {
                            console.log('client.sendMail>>' + error);
                            reject(error);
                        } else {
                            console.log('client.sendMail>> Correo enviado');
                            resolve(true);
                        }
                    });
                });
            } catch (error) {

                console.log('Error en el envio de correo ' + error.message);
                reject(error);
            }
        })
    }

    function getDiccionario(claves) {

        var retorno = [];
        var aux = claves.split('|');

        for (var i = 0; i < aux.length; i++) {

            var aux0 = aux[i].split('&');

            // retorno.push({clave: aux0[0], valor: aux0[1]});
            if (aux0 != '') {
                retorno['' + aux0[0].trim() + ''] = aux0[1].trim();
            }
        }

        return retorno;
    }
}

module.exports = new CorreoController();