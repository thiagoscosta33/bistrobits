const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Restaurante = new Schema({
    cnpj: {
        type: String,
        require: true
    },
    nome: String,
    fantasia: String,
    endereco: String,
    cidade: String,
    estado: String,
    telefone: String,
    whatsapp: String,
    email: String,
    homepage: String,
    datacadastro: Date,
    foto: String
  });

  
mongoose.model("restaurante", Restaurante)