//Aqui iremos pegar a instância do mongoose:
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Aqui iremos configura um modelo e depois usar o module.exports:
module.exports = mongoose.model('Usuario', new Schema({
        username: String,
        password: String,
        admin: Boolean
}));