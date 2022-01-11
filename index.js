require("dotenv").config();
const DB=process.env.DATABASE.replace('<password>',process.env.DBPASSWORD);

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('DB connection successful!'));

// const TestUser =new User({
//     name:'Abhishek',
//     email:'abhish@0101.io',
//     password:'hello1234'
// });
// TestUser.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

// const TestUser = await User.create({
//     name:'Abhishek_',
//     email:'abhish@101.io',
//     password:'hello1234'
// });

//Login after insert.
// const token = jwt.sign({id:"id_login" }, process.env.JWT_SECRET, {expiresIn:90d});

//Login 
// const email = "abhish@0101.io";
// const password = "hello1234";

// if(!email || !password){
//     console.log('email and pass isnot empty.')
// }

// const user = await User.findOne({email}).select('+password');

// if(!user || !(await user.correctPassword(password, user.password))){
//   console.log('Please enter correct details');
// }
// else{
// const token = jwt.sign({id:"user._id" }, process.env.JWT_SECRET, {expiresIn:90d});
// console.log('success log')
// }



app.get("/", async(req, res) => { 
  res.render("home");
})


app.use((req, res) => {
    res.status(404).json("ERROR");
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
