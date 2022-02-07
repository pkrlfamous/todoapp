const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req,res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('no token procided');
    try
    {
        const decodedToken = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decodedToken;
        next(); // passes control to next middl fn in the req processing pipeline.
    }
    catch(ex){
        res.status(400).send('invalid token');
    }
}

module.exports = auth;