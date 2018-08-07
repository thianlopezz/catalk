const express = require('express');
const router = express.Router();

let jwt = require('jsonwebtoken');
const secret = 'catalk';

const UsuarioDAO = require('../models/usuario/UsuarioDAO');
const RootController = require('../controllers/RootController');

const AdmisionesDAO = require('../models/admisiones/AdmisionesDAO');
const ModeloSolicitudesDAO = require('../models/modelo_solicitudes/ModeloSolicitudesDAO');
const TramitesDAO = require('../models/tramites/TramitesDAO');

router.get('/', (req, res) => {

  res.send('public works!');
});

router.post('/router', (req, res) => {

  // console.log(req.body);
  RootController.getAll(req.body, res);
});

router.post('/login', (req, res) => {

  UsuarioDAO.login(req.body, function (error, result) {

    if (error) {

      res.send({ success: false, mensaje: error.message, error });
    } else {

      result = result.toJSON();

      var token = jwt.sign(result, secret, {
        expiresIn: "24h"
      });

      result.token = token;

      res.json({ success: true, usuario: result });
    }
  });
});

// ADMISION BY ID
router.get('/admisiones/:idAdmision', (req, res) => {

  AdmisionesDAO.getById(req.params.idAdmision)
    .then(admision => {

      if (admision) {
        res.json({ success: true, data: admision });
      } else {
        res.status(404).send({ success: false, mensaje: 'Admisión no encontrada.' })
      }
    })
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

// TRAMITE BY ID
router.get('/tramites/:idTramite', (req, res) => {

  TramitesDAO.getById(req.params.idTramite)
    .then(tramite => {

      if (tramite) {
        res.json({ success: true, data: tramite });
      } else {
        res.status(404).send({ success: false, mensaje: 'Trámite no encontrado.' })
      }
    })
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

// SOLICITUD BY ID
router.get('/solicitudes/:idSolicitud', (req, res) => {

  ModeloSolicitudesDAO.getById(req.params.idSolicitud)
    .then(modelos => {

      if (modelos) {
        res.json({ success: true, data: modelos });
      } else {
        res.status(404).send({ success: false, mensaje: 'Modelo de solicitud no encontrada.' })
      }
    })
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

module.exports = router;