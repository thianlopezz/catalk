const express = require('express');
const router = express.Router();

let jwt = require('jsonwebtoken');
const secret = 'catalk';

const UsuarioDAO = require('../models/usuario/UsuarioDAO');
const RootController = require('../controllers/RootController');

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

module.exports = router;