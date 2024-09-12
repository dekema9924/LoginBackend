
const route = require('express').Router();
const bodyParser = require('body-parser')
const cors = require('cors');
const Users = require('../module/database')
const bcrypt = require('bcrypt')
const jwtAuth = require('../Auth/jwt');
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');





//middlewares
route.use(bodyParser.urlencoded({ extended: true }))
route.use(bodyParser.json());
route.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));
route.use(cookieParser())



//create account in db
route.post('/register', async (req, res) => {
    const { name, email, password } = req.body
    let finduser = await Users.findOne({ email })
    if (!finduser) {
        bcrypt.hash(password, 10, (async (err, hashpswd) => {
            let newuser = await Users.create({ name, email, password: hashpswd })
            await newuser.save();
            res.status(200).json({ message: "account created. " })
            if (err) return res.status(400).json({ message: 'account could not be created.Try again !!' })
        }))
    } else {
        return res.status(400).json({ message: 'email already in use.' })
    }
})

route.post('/login', async (req, res) => {
    const { email, password } = req.body
    const findUser = await Users.findOne({ email: email }) //check if email exist
    if (findUser) {
        bcrypt.compare(password, findUser.password, ((err, match) => {
            if (match) {
                //auth jwt
                const accesstoken = jwtAuth(findUser)
                res.cookie("jwt", accesstoken, {
                    maxAge: 60 * 60 * 24 * 1 * 1000, //1days
                    // withCredential: true,
                    // httpOnly: false
                    // sameSite: true

                })
                // console.log(accesstoken)
                res.status(200).json({
                    success: true,
                    message: 'loggin in...',
                    auth:true,
                    token: accesstoken

                })
            } else {
                res.status(400).json({ password: 'invalid password' })
            }
            if(err){
                res.json(err)
            }

        }))
    } else {
        return res.status(400).json({ email: 'invalid email' })
    }

})


route.get('/dashboard', (req,res)=>{
 let jwttoken = (req.cookies.jwt);
 if(jwttoken){//verify token
        try{
            jwt.verify(jwttoken, process.env.TOKEN, ((err, decoded)=>{
                if(err) return err
                Users.findById(decoded.id)
                .then((result)=>{
                    result.password = null
                    res.json({
                        result,
                        isloggedin: true,
                        authenticated: true
                    })
                })
               
            }))
        }catch(err){
            console.log(err)
        }
 }else{
    res.status(400).json({
        error: 'invalid token',
        isloggedin: false,
        authenticated: false,
    })
 }

})




module.exports = route