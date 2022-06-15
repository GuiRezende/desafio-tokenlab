const express = require("express");
const { engine } = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const usuarios = require("./routes/usuario");
const passport = require("passport");
require("./config/auth")(passport);

//CONFIGURAÇÕES GERAIS
/* --- SESSION --- */
app.use(
    session({
        secret: "tokenLab",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

/* --- MIDDLEWARE --- */
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
});

/* --- BODY PARSER --- */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* --- HANDLEBARS --- */
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

/* --- MONGOOSE --- */
mongoose
    .connect("mongodb://localhost/eventos-calendario")
    .then(function() {
        console.log("Conectado com sucesso!");
    })
    .catch(function(err) {
        console.logo("Erro ao se conectar: " + err);
    });

/* --- PUBLIC --- */
app.use(express.static(path.join(__dirname, "public")));

//ROTAS
app.get("/", (req, res) => {
    res.render("index");
});
app.use("/admin", admin);
app.use("/usuarios", usuarios);

//OUTROS
const PORT = 8081;
app.listen(PORT, function() {
    console.log("Servidor Funcionando! http://localhost:8081");
});