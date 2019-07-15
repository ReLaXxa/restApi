const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./database/dbConfig')
const config=require('./configs')
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/', (req, res) => res.send('Hello World!'));
app.use('/apiv1', routes);

app.listen(config.port, () => console.log(`Living on ${config.port}!`))