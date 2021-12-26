require("dotenv").config();
const DB=process.env.DATABASE.replace('<password>',process.env.DBPASSWORD);

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./models/user");

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
//     Name:'Abhishek',
//     Email:'abhish@0101',
//     Password:'hello'
// });
// TestUser.save().then(doc => {
//     console.log(doc);
// }).catch(err => {
//     console.log(err);
// })

app.get("/", async(req, res) => {
    res.render("home");
})


app.use((req, res) => {
    res.status(404).redirect("notFound");
  });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
