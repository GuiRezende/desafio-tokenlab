const mongoose = require("mongoose");

const Evento = new mongoose.Schema({
    titulo: {
        type: String,
        require: true,
    },
    descricao: {
        type: String,
        require: true,
    },
    dataHoraInicial: {
        type: Date,
        require: true,
    },
    dataHoraFinal: {
        type: Date,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    criador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "usuarios",
        require: true,
        unique: true,
    },
});

mongoose.model("eventos", Evento);