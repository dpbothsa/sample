const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const EmployeeSchema = require('./Schema/Employee')
const AddEmp = require('./Schema/Employee')
const Addadmin = require('./Schema/Admin')

const app = express();

app.use(express.json());
app.use(cors({origin:'*'}));
dotenv.config();

mongoose.connect('mongodb+srv://prasadyt9:prasad123@cluster0.umqryee.mongodb.net/Employee-Management-System').then((req,res)=>{
    console.log('connected to DB..Appu...')
})

app.post('/add',async(req,res)=>{
   try {
    const {email,name,empID,salary} = req.body;
    let exist = await EmployeeSchema.findOne({empID})
    if(exist){
        return res.json({message:'Employee Already Rigistered'})
    }
    const post = await EmployeeSchema.create({email,name,empID,salary})
    return res.json(post)
   } catch (error) {
     console.log(error)
   }

})

app.get('/all',async(req,res)=>{
    try {
        let employees = await EmployeeSchema.find()
        return res.json(employees)
    } catch (error) {
        console.log(error)
    }
})

app.post('/addadmin', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let exist = await Addadmin.findOne({ email });
        if (exist) {
            return res.status(400).json({ message: 'Employee Already Registered' });
        }
        const admin = await Addadmin.create({ name, email, password });
        return res.status(201).json(admin); 
    } catch (error) {
        console.error('Error adding admin:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/adminlogin', async (req, res) => {
    try {
        const { email, password } = req.body;
        let exist = await Addadmin.findOne({ email });
        if (!exist) {
            return res.status(404).json({ message: 'No Admin Found with this Email' });
        }
        if (exist.password !== password) {
            return res.status(401).json({ message: 'Wrong Password. Please try again' });
        }
        const payload = {
            user: {
                id: exist.id
            }
        };
        jwt.sign(payload, "appu", (err, token) => {
            if (err) {
                console.error('JWT signing error:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            return res.status(200).json({ token });
        });
    } catch (error) {
        console.error('Error in admin login:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.get('/employee/:id',async(req,res)=>{
    let emp = await EmployeeSchema.findById(req.params.id)
    return res.json(emp)
})

app.put('/update/:id',async(req,res)=>{
    const {name,email,empID,salary} = req.body;
    let update = await EmployeeSchema.findByIdAndUpdate(req.params.id,{name,email,empID,salary})
    return res.json(update)
})

app.delete('/delete/:id',async(req,res)=>{
    await EmployeeSchema.findByIdAndDelete(req.params.id)
    return res.json({message:"Employee Removed"})
})

app.listen(5000,(req,res)=>{
    console.log('server is running...')
})