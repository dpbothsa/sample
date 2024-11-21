const mongoose = require('mongoose')

const admin = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})


const Addadmin = mongoose.model('Admins',admin)

module.exports = Addadmin