let jwt = require('jsonwebtoken');
const config = require('../configs/index');

let checkToken = (req, res, next) => {

    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (token) {

        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log(err)
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    }
    else if (req.method == 'GET' && req.baseUrl.includes('/products')) {
        next();
    } else {
        return res.json({
            success: false,
            message: 'Auth token is not supplied'
        });
    }
};

module.exports = {
    checkToken: checkToken
}