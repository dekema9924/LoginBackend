var jwt = require('jsonwebtoken');
require('dotenv').config();



const jwtAuth = (finduser)=>{
    const token = jwt.sign(
        { id: finduser._id },
        process.env.TOKEN,
        {
            expiresIn: '1h'
        }
       
    )
    return token    
}


module.exports = jwtAuth;