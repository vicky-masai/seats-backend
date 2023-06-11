const mongoose = require('mongoose');

const connection = mongoose.connect("mongodb+srv://vicky:vicky@cluster0.vodazbe.mongodb.net/seats?retryWrites=true&w=majority");

module.exports = {connection};