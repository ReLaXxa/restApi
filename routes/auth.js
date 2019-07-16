const routes = require('express').Router();
const authModel = require('../models/auth');
const jwt = require('jsonwebtoken');

module.exports = (db, config) => {
    routes.post("/login", async (req, res, next) => {
        if (Object.keys(req.body).length == 0) return res.status(401).send('You need to provide username and password');
        const { username, password } = req.body;
        if (username == '' || password == '') return res.status(401).send('Both username and password needs to be values');
        try {
            let request = await authModel.doLogin(db, username, password).then((item) => {
                if (item === undefined) return res.status(401).send({msg:'Wrong username or password'});
                return res.json({
                    success: true,
                    message: 'Authentication successful!',
                    jwt: jwt.sign({
                        username: username,
                        country_code: 'IT'
                    }, config.secret, { expiresIn: 60 * 10 }
                    )
                });
             })

        } catch (error) {
            console.log(error)
            res.status(401).send(error)
        }
    });

    return routes;
}