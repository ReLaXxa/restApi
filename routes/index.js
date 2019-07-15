const routes = require('express').Router();
const db = require('../database/dbAdapter');
const config = require('../configs/index');
const checkAuth = require('../middlewares/auth_check');

routes.get('/', (req, res) => { res.status(200).json({ message: 'Connected!' }); });

routes.use('/auth', require('./auth.js')(db, config));
routes.use('/products', require('./products.js')(checkAuth.checkToken,db));
routes.use('/users', require('./users.js')(db));
routes.use('/orders', require('./orders.js')(checkAuth.checkToken,db));
// routes.use('/products', require('./products.js')(db));

module.exports = routes;