const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Grupo = new Schema({
  descricao: {
    type: String,
    required: true,
    maxLength: 100 
  },
  listarNoCardapio: {
    type: Boolean,
    default: true 
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("grupo", Grupo);

// Índices
Grupo.index({ descricao: 1 });
