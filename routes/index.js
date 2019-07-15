const routes = require('express').Router();
const db = require('../database/dbConfig');
const config = require('../configs/index');

routes.get('/', (req, res) => { res.status(200).json({ message: 'Connected!' }); });

routes.use('/users', require('./users.js')(db));

module.exports = routes;