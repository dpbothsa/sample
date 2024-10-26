const mongoose = require('mongoose')

const Emp = new mongoose.Schema({
    email:String,
    name:String,
    empID:String,
    salary:String
})

const AddEmp = mongoose.model('Employees',Emp)

module.exports = AddEmp