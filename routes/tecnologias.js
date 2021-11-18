var express = require('express');
var router = express.Router();
const Tecnologias = require("../models/Tecnologias")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('tecnologias', { tecnologias:Tecnologias.tecnologias() });
});

module.exports = router;
