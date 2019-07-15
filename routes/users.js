const routes = require('express').Router();
const userModel = require('../models/users');
module.exports = (db) => {
    routes.get("/", async (req, res, next) => {
        try {
            await userModel.getAllUsers(db).then((items) => {
                console.log(items)
                return res.json({ items });
            })
        } catch (error) {
            res.status(401).send(error)
        }
    });
    routes.get("/:id", async (req, res, next) => {
        const userId = Number(req.params.id);
        console.log(typeof userId, userId)
        if (typeof userId !== Number) return res.status(401).send({ error: 'you need to pass an integer as a param' });
        try {
            await userModel.getUserById(db, userId).then((item) => {
                return res.json({ item });
            })
        } catch (error) {
            res.status(401).send(error)
        }
    });


    return routes;
}