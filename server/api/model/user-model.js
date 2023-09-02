const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { required: true, type: String},
    lastName: {required: true,type: String},
    fullName: {require: true, type: String},
    username: {required: true,type: String, unique:true},
    password: {required: true,type: String}
})

module.exports = mongoose.model('User', userSchema);