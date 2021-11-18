var createError = require("http-errors");
var express = require("express");
var path = require("path");
var logger = require("morgan");
const cookieParser = require("cookie-parser");

var data = require("./config/data");

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
app.use("/sobre",indexRouter)

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
  req.session.nome = data.userDB.nome;
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
    req.body.email == data.userDB.email &&
    req.body.senha == data.userDB.senha
  ) {
    req.session.nome = data.userDB.nome;
    req.session.isLogged = true;
    res.redirect("/dashboard/anotacoes");
  } else {
    res.render("login", { error: "Usuário ou senha incorretos" });
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
