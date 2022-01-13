require("dotenv").config();
const DB=process.env.DATABASE.replace('<password>',process.env.DBPASSWORD);

const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const jwt = require("jsonwebtoken");
const viewRouter = require('./routes/viewRoutes');
const userRouter = require('./routes/userRoutes');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require("cors");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('DB connection successful!'));





app.use('/api/users',userRouter);
app.use('/',viewRouter);


app.use((req, res) => {
    res.status(404).json("ERROR");
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
