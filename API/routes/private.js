const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const secret = 'catalk';

const AdmisionesDAO = require('../models/admisiones/AdmisionesDAO');

router.get('/', (req, res) => {
  res.send('private works!');
});

router.use(function (req, res, next) {

  // var token = req.body.token || req.query.token || req.headers['x-access-token'];
  var token = req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, secret, function (error, decoded) {
      if (error) {

        return res.status(403).send({
          success: false,
          mensaje: 'Token caducadacado vuelve a iniciar sesión.'
        });
      } else {

        req.decoded = decoded;
        next();
      }
    });

  } else {

    return res.status(401).send({
      success: false,
      mensaje: 'Token no provisto.'
    });
  }
});

router.get('/admisiones', (req, res) => {

  AdmisionesDAO.getAll(function (error, admisiones) {

    if (error) {
      res.send({ success: false, mensaje: error.message, error });
    } else {
      res.json({ success: true, data: admisiones });
    }
  });
});

router.get('/admisiones/:idAdmision', (req, res) => {

  AdmisionesDAO.getById(req.params.idAdmision, function (error, admision) {

    if (error) {
      res.send({ success: false, mensaje: error.message, error });
    } else {
      res.json({ success: true, data: admision });
    }
  });
});

router.post('/admisiones/:accion', (req, res) => {

  AdmisionesDAO.mantenimiento(req.params.accion, req.body, function (error, admisiones) {

    if (error) {
      res.send({ success: false, mensaje: error.message, error });
    } else {
      res.json({ success: true, data: admisiones });
    }
  });
});

module.exports = router;