const express = require("express");
const cors = require("cors");
const env = require("dotenv");
const path = require("path");
env.config();

const mongoose = require('mongoose');

const user = require("./routes/user");
const expense = require("./routes/expense");
const purchase = require("./routes/purchase");
const premium = require("./routes/premium");
const forgotPassword = require("./routes/password");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", user);

app.use("/expense", expense)

app.use("/purchase", purchase)

app.use("/", premium);

app.use("/", forgotPassword);

app.use((req,res)=> {
    res.sendFile(path.join(__dirname, `public/${req.url}`))
})

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lmia5ej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(result =>{
    console.log("connected")    
    app.listen(3000);
}).catch(err => console.log(err))