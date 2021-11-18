var express = require('express');
var router = express.Router();
const Tecnologias = require("../models/Tecnologias")
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

module.exports = router;
