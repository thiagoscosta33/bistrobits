const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome: {
        type: String,
        require: true
    },
    tipo:  {  
        type: Number,
        default: 0 // Pode ser '0-cliente', '1-admin' ou '2-operador'
    },    
    eAdmin: {
        type: Number,
        default: 0
    },    
    email: {
        type: String,
        require: true
    },   
    senha: {
        type: String,
        require: true
    },  
    foto: {
        type: String,
    },           
    date:{
        type: Date,
        default: Date.now()
    },
    permissoes: {
        type: [String], 
        default: ['consulta_produto']
    }
})

mongoose.model("usuario", Usuario)