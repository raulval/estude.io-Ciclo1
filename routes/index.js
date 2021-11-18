var express = require('express');
var router = express.Router();
const Tecnologias = require("../models/Tecnologias")
const Informacoes = require("../models/Informacoes")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/tecnologias', function(req, res, next) {
  res.render('tecnologias', { tecnologias:Tecnologias.tecnologias() });
});

router.get('/sobre', function(req, res, next) {
  res.render('sobre');
});

router.get('/informacoes', function(req, res, next) {
  res.render('informacoes',{informacoes : Informacoes.informacoes()});
});

module.exports = router;
