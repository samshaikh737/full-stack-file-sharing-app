const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = ()=>{
    
    //Database connection
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser : true,
        useCreateIndex : true,
        useUnifiedTopology : true,
        useFindAndModify : true
    });
    const connection = mongoose.connection;

    connection.once("open",()=>{
        console.log("DB is connected");
    }).catch(err=>{
        console.log("Connection Faild");
    })
}

module.exports = connectDB;