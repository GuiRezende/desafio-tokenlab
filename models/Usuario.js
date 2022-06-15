const mongoose = require("mongoose");
const router = require("../routes/admin");

const Usuario = new mongoose.Schema({
    nome: {
        type: String,
        require: true,
    },
    sobrenome: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    senha: {
        type: String,
        require: true,
    },
});

mongoose.model("usuarios", Usuario);