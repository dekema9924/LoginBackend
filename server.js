const express = require('express');
const app = express()
const port = 3000;
require('dotenv').config()
const route = require('./Routes/routes')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors');






//route middleware
app.use('/routes', route);
app.use(cookieParser())
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));



app.get('/', (req,res)=>{
    res.redirect('/routes')
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log(`server open on http://localhost:${port}`)
    mongoose.connect(process.env.MONGODBURL)
    .then(console.log('connected to db'))

})

