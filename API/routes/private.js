const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const moment = require('moment');
const multer = require('multer');

const secret = 'catalk';

const AdmisionesDAO = require('../models/admisiones/AdmisionesDAO');
const ModeloSolicitudesDAO = require('../models/modelo_solicitudes/ModeloSolicitudesDAO');
const TramitesDAO = require('../models/tramites/TramitesDAO');
const ContadoresDAO = require('../models/contadores/ContadoresDAO');
const ParametrosDAO = require('../models/parametros/ParametrosDAO');

const UsuarioDAO = require('../models/usuario/UsuarioDAO');

// PARA GUARDAR ARCHIVO
const storage = multer.diskStorage({
  destination: './API/files',
  filename(req, file, callback) {
    let nameArr = file.originalname.split('.');
    callback(null, `SOLICITUD_${moment().format('DDMMYYYYhhmmss')}.${nameArr[nameArr.length - 1]}`);
  }
});

const upload = multer({ storage });

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

// ADMISIONES
router.get('/admisiones', (req, res) => {

  AdmisionesDAO.getAll()
    .then(tipoAdmisiones => res.json({ success: true, data: tipoAdmisiones }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.post('/admisiones/:accion', (req, res) => {

  AdmisionesDAO.mantenimiento(req.params.accion, req.body)
    .then(admision => res.json({ success: true, data: admision }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

// TRAMITES
router.get('/tramites', (req, res) => {

  TramitesDAO.getAll()
    .then(tramites => res.json({ success: true, data: tramites }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.post('/tramites/:accion', (req, res) => {

  TramitesDAO.mantenimiento(req.params.accion, req.body)
    .then(tramite => res.json({ success: true, data: tramite }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

// SOLICITUDES
router.get('/solicitudes', (req, res) => {

  ModeloSolicitudesDAO.getAll()
    .then(modelos => res.json({ success: true, data: modelos }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.post('/solicitudes/:accion', upload.single('file'), (req, res) => {

  if (req.file) {
    req.body.archivo = req.file.filename;
  }

  try {
    req.body.detalles = JSON.parse(req.body.detalles);
  } catch (ex) {
    req.body.detalles = [];
  }

  ModeloSolicitudesDAO.mantenimiento(req.params.accion, req.body)
    .then(solicitud => res.json({ success: true, data: solicitud }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

// PARAMETROS
router.get('/parametros', (req, res) => {

  ParametrosDAO.get()
    .then(parametros => res.json({ success: true, data: parametros }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.post('/parametros/:accion', (req, res) => {

  ParametrosDAO.mantenimiento(req.params.accion, req.body)
    .then(parametros => res.json({ success: true, data: parametros }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

// USUARIOS
router.get('/usuarios', (req, res) => {

  UsuarioDAO.getAll()
    .then(usuarios => res.json({ success: true, data: usuarios }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.get('/usuarios/:idUsuario', (req, res) => {

  UsuarioDAO.getById(req.params.idUsuario)
    .then(usuario => {

      if (usuario) {
        res.json({ success: true, data: usuario });
      } else {
        res.status(404).send({ success: false, mensaje: 'Usuario no encontrado.' })
      }
    })
    .catch(error => res.send({ success: false, mensaje: error.message, error }))
});

router.post('/usuarios/:accion', (req, res) => {

  UsuarioDAO.mantenimiento(req.params.accion, req.body)
    .then(usuario => res.json({ success: true, data: usuario }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.post('/usuario/contrasena', (req, res) => {

  UsuarioDAO.contrasena(req.body)
    .then(usuario => res.json({ success: true, data: usuario }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

router.get('/estadisticas', (req, res) => {
  
  ContadoresDAO.getEstadistica()
    .then(datos => res.json({ success: true, data: datos }))
    .catch(error => res.send({ success: false, mensaje: error.message, error }));
});

module.exports = router;