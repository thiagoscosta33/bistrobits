const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Produto = new Schema({
  descricao: {
    type: String,
    required: true,
    maxLength: 255,
  },
  preco: {
    type: mongoose.Decimal128,
    required: true,
    min: 0,
  },
  listarNoCardapio: {
    type: Boolean,
    default: true 
  },
  fotos: [String],
  especificacao: String,
  ingredientes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ingrediente', 
    },
  ],
  grupo: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'grupo'
  },
  ativo: {
    type: Boolean,
    default: true, 
  }  
});

mongoose.model("produto", Produto);

