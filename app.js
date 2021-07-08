const express = require("express");
const ejs = require("ejs");
const bcrypt = require("bcryptjs");
const app = express();
const mongoose = require('mongoose');
const bodyParser= require("body-parser");
const port = 80;

app.set('view engine' , 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb://localhost:27017/studentDB1', {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb+srv://abhishekcentelon:abhicentelon@cluster0.rujm4.mongodb.net/registration', {useNewUrlParser: true, useUnifiedTopology: true});

//---------------------------------------------------------------------------------------------------------------------

const stuSchema = new mongoose.Schema({
    name: String,
    email: String,
    maths: Number,
    physics: Number,
    chemistry: Number,
  });

const student = mongoose.model('student', stuSchema);
//-------------------------------------------------------------------------------------------------------------------------------------------------------------


const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password:String,
  });

  registrationSchema.pre("save", async function(next){
    console.log(`the password before hashing is ${this.password}`);
    this.password = await bcrypt.hash(this.password , 10);
    console.log(`the password after hashing is ${this.password}`);
    next();
  })
  
  const registration = mongoose.model('registration ', registrationSchema);

  //--------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/student" ,(req,res)=>{
    res.sendFile(__dirname + "/student.html")
})

app.post("/student",(req,res)=>{
    var myData = new student(req.body);
    console.log(myData);
    myData.save().then(()=>{
        res.redirect('result')
    }).catch(()=>{
        res.send("Not Saved!!")  
    });
    
})
//------------------------------------------------------------------------------------------------------------
app.get('/result' , (req,res) =>{
    student.find({} , function(err,students) {
        res.render('result' , {
            studentList : students
        })
    })
})

//-----------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/" ,(req,res)=>{
    res.sendFile(__dirname + "/index.html")
})
app.post("/",(req,res)=>{
    var myusers = new registration(req.body);
    console.log(myusers);
    myusers.save().then(()=>{
        res.redirect('login')
    }).catch(()=>{
        res.send("Not Saved!!")  
    });
})

app.get("/login" ,(req,res)=>{
    res.sendFile(__dirname + "/login.html")
    
})

app.post("/login" , async (req,res)=>{
    try{
        const email=req.body.email;
        const password=req.body.password;
        // console.log(`${email} ${password}`)
        const useremail=await registration.findOne({email:email});
        // console.log(useremail);

        const isMatch =await bcrypt.compare(password,useremail.password); //---
        if(isMatch){
            res.redirect('student')
        }
        else{
            res.send("Username or password is invalid")
        }

    }catch(error){
        res.status(400).send("invalid Login details.")
    }
    
})

app.listen(port , ()=>{
    console.log(`The application started successfully on ${port}`)
})