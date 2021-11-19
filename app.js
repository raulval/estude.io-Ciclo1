var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const nodemailer = require("nodemailer");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/sobre", indexRouter);

// Sessão
const session = require("express-session");
app.use(
  session({
    name: "uniqueSessionID",
    secret: "#@A4327Asdzw",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Rotas
app.get("/login", function (req, res, next) {
  if (req.session.isLogged) {
    res.redirect("/dashboard/anotacoes");
  } else {
    res.render("login");
  }
});

app.get("/dashboard/anotacoes", function (req, res, next) {
  if (!req.session.isLogged) {
    res.redirect("/login");
  } else {
    res.render("anotacoes", { nome: req.session.nome });
  }
});

app.get("/dashboard/horarios-de-aula", function (req, res, next) {
  res.render("horariosdeaula");
});

app.get("/dashboard/livros", function (req, res, next) {
  res.render("livros");
});

app.get("/dashboard/tarefas", function (req, res, next) {
  res.render("tarefas");
});

// Fazendo Login
app.post("/login", (req, res) => {
  if (
    req.body.email == process.env.USER_EMAIL &&
    req.body.senha == process.env.USER_SENHA
  ) {
    req.session.nome = process.env.USER_NOME;
    req.session.isLogged = true;
    res.redirect("/dashboard/anotacoes");
  } else {
    res.render("login", { error: "Usuário ou senha incorretos" });
  }
});

// Enviando Email
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.MAIL_EMAIL,
    pass: process.env.MAIL_SENHA,
  },
  secure: true,
});

// Verificando conexão
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server SMTP OK");
  }
});

app.post("/enviar-email", (req, res) => {
  let nome = req.body.nome;
  let email = req.body.email;
  let assunto = req.body.assunto;
  let mensagem = req.body.texto;

  const mail = {
    from: email,
    to: process.env.MAIL_EMAIL,
    subject: assunto,
    text: `${nome} <${email}> \n${mensagem}`,
  };

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.render("contato", { error: "Erro ao enviar mensagem" });
    } else {
      res.render("contato", { success: "Mensagem enviada com sucesso!" });
    }
  });
});

// Mudar Nome
app.post("/dashboard/anotacoes", (req, res) => {
  if (req.session.nome) {
    req.session.nome = req.body.novoNome;
    res.redirect("/dashboard/anotacoes");
  }
});

// Fazendo logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {});
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
