const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");

const cors = require('cors')
//app.use(cors())
app.use(express.json())

//Template engine
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs")

app.use(express.static(path.join(__dirname,"public")))

const connectDB = require("./config/db");
connectDB()

//Routes
app.get("/",(req,res)=>{
    res.render("index")
})

app.use('/api/files',require("./routes/files"));
app.use("/files",require("./routes/show"));
app.use("/files/download",require("./routes/download"));

app.listen(port,()=>console.log(`listing on port : ${port}`))