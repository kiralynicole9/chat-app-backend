const jwt = require('jsonwebtoken')
const SECRET_KEY = "my_secret_key";

const authenticateToken = (req,res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log(token, "in token function");

    if(!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = authenticateToken;