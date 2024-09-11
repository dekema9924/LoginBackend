var jwt = require('jsonwebtoken');
require('dotenv').config();

//avoid dashboard route
const DashboardAuth = (req, res, next)=>{
    let token = req.cookies.token
    if(token){
        jwt.verify(token, process.env.TOKEN, ((err, verified)=>{
            console.log(verified)
            if(verified){
                next
            }else{
                res.redirect('/routes/login')

            }
            
        }))
    }else{
        res.redirect('/routes/login')
    }
}


modules.export = DashboardAuth;