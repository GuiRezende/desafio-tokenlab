const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Evento");
require("../models/Usuario");
const Evento = mongoose.model("eventos");
const { eLogin } = require("../helpers/eLogin");

router.get("/", function(req, res) {
    res.render("/index/admin");
});

router.get("/posts", eLogin, function(req, res) {
    res.send("Pagina post admin");
});

router.get("/eventos", eLogin, function(req, res) {
    Evento.find()
        .lean()
        .sort({ dataHoraInicial: "desc" })
        .then(function(eventos) {
            res.render("admin/eventos", { eventos: eventos });
        })
        .catch(function(err) {
            req.flash("error_msg", "Houve um erro ao listar as eventos");
            res.redirect("/");
        });
});

router.get("/eventos/add", eLogin, function(req, res) {
    res.render("admin/addeventos");
});

router.post("/eventos/nova", eLogin, function(req, res) {
    var erros = [];

    if (req.body.dataHoraInicial > req.body.dataHoraFinal) {
        erros.push({
            texto: "Fim do evento não pode ser anterior ao seu inicio!",
        });
    }
    if (!req.body.titulo ||
        req.body.titulo == undefined ||
        req.body.titulo === null
    ) {
        erros.push({ texto: "titulo inválido" });
    }
    if (!req.body.descricao ||
        req.body.descricao == undefined ||
        req.body.descricao === null
    ) {
        erros.push({ texto: "Descrição inválida" });
    }
    if (!req.body.dataHoraInicial ||
        req.body.dataHoraInicial == undefined ||
        req.body.dataHoraInicial === null
    ) {
        erros.push({ texto: "Data inicial inválida" });
    }
    if (!req.body.dataHoraFinal ||
        req.body.dataHoraFinal == undefined ||
        req.body.dataHoraFinal === null
    ) {
        erros.push({ texto: "Data final inválido" });
    }
    if (req.body.titulo.length < 2) {
        erros.push({ texto: "titulo do evento é muito pequeno" });
    }
    if (erros.length > 0) {
        res.render("admin/addeventos", { erros: erros });
    } else {
        Evento.findOne({ dataHoraInicial: req.body.dataHoraInicial }).then(
            (evento) => {
                if (evento) {
                    req.flash(
                        "error_msg",
                        "Já existe um evento com esta hora em nosso sistema!"
                    );
                    req.redirect("/admin/addeventos");
                } else {
                    const novoEvento = {
                        titulo: req.body.titulo,
                        descricao: req.body.descricao,
                        dataHoraInicial: req.body.dataHoraInicial,
                        dataHoraFinal: req.body.dataHoraFinal,
                        criador: req.user,
                    };

                    new Evento(novoEvento)
                        .save()
                        .then(function() {
                            req.flash("success_msg", "Evento adicionado com sucesso!");
                            res.redirect("/admin/eventos");
                        })
                        .catch(function(err) {
                            req.flash("error_msg", "Erro ao salvar, tente novamente!");
                            res.redirect("/admin");
                        });
                }
            }
        );
    }
});

router.get("/eventos/edit/:id", eLogin, function(req, res) {
    Evento.findOne({ _id: req.params.id })
        .lean()
        .then(function(evento) {
            res.render("admin/editeventos", { evento: evento });
        })
        .catch(function(err) {
            req.flash("error_msg", "Esse evento não existe!");
            res.redirect("admin/eventos");
        });
});

router.post("/eventos/edit", eLogin, function(req, res) {
    Evento.findOne({ _id: req.body.id })
        .then(function(evento) {
            if (evento.criador == req.user) {
                evento.titulo = req.body.titulo;
                evento.descricao = req.body.descricao;
                evento.dataHoraInicial = req.body.dataHoraInicial;
                evento.dataHoraFinal = req.body.dataHoraFinal;

                evento
                    .save()
                    .then(function() {
                        req.flash("success_msg", "Evento editado com sucesso!");
                        res.redirect("/admin/eventos");
                    })
                    .catch(function(err) {
                        req.flash("error_msg", "Houve um erro ao validar a evento!");
                        res.redirect("/admin/eventos");
                    });
            } else {
                req.flash(
                    "error_msg",
                    "Desculpe, você não é o criador deste evento e não pode edita-lo!"
                );
                res.redirect("/admin/eventos");
            }
        })
        .catch(function(err) {
            req.flash("error_msg", "Houve um erro ao salvar");
        });
});

router.post("/eventos/deletar", eLogin, function(req, res) {
    Evento.remove({ _id: req.body.id })
        .then(function() {
            req.flash("success_msg", "evento deletada com sucesso!");
            res.redirect("/admin/eventos");
        })
        .catch(function(err) {
            req.flash("error_msg", "Houve um erro ao deletar a evento!");
            res.redirect("/admin/eventos");
        });
});

module.exports = router;