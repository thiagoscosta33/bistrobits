const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Ingrediente = new Schema({
  descricao: {
    type: String,
    required: true,
    maxLength: 255 
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("ingrediente", Ingrediente);

// Índices
Ingrediente.index({ descricao: 1 });
