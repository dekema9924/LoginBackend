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
app.use(cors({
    origin: function(origin, callback){
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true
  }));



app.get('/', (req,res)=>{
    res.redirect('/routes')
})

app.listen( 3000, ()=>{
    console.log(`server open on http://localhost:${port}`)
    mongoose.connect(process.env.MONGODBURL)
    .then(console.log('connected to db'))

})

