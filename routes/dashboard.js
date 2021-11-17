var express = require("express");
var router = express.Router();

router.get("/anotacoes", function (req, res, next) {
  res.render("anotacoes");
});

router.get("/horarios-de-aula", function (req, res, next) {
  res.render("horariosdeaula");
});

router.get("/livros", function (req, res, next) {
  res.render("livros");
});

router.get("/tarefas", function (req, res, next) {
  res.render("tarefas");
});

module.exports = router;
