const localStrategy = require("passport-local");
const mongoose = require("mongoose");
require("../models/Usuario");
const Usuario = mongoose.model("usuarios");

module.exports = function(passport) {
    passport.use(
        new localStrategy({ usernameField: "email", passwordField: "senha" },
            (email, senha, done) => {
                Usuario.findOne({ email: email }).then((usuario) => {
                    if (!usuario) {
                        return done(null, false, { message: "Esta conta não existe!" });
                    }
                    if (usuario.senha != senha) {
                        return done(null, false, { message: "Senha incorreta!" });
                    }
                    return done(null, usuario);
                });
            }
        )
    );

    passport.serializeUser((usuario, done) => {
        done(null, usuario.id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario);
        });
    });
};