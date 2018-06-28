
const axios = require('axios');

function CorreoGenerico() {

    this.enviar = function (asunto, destinatario, claves, plantilla, callback) {

        var correo = {
            idHospedaje: 0,
            asunto: asunto,
            destinatario: destinatario,
            claves: claves,
            plantilla: plantilla
        };

        axios.post(`${API}/api/send`, correo)
            .then(result => {
                callback(null, result.data);
            })
            .catch(error => {
                console.log("Err>>" + error);
                callback(error);
            });
    }
}

module.exports = new CorreoGenerico();
