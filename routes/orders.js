const routes = require('express').Router();
const ordersModel = require('../models/orders');
module.exports = (router, db) => {
    routes.get("/", async (req, res, next) => {
        try {
            console.log('we do it')
            await ordersModel.getAllOrders(db).then((item) => {
                return res.json({ item });
            })
        } catch (error) {
            console.log(error)
            res.status(401).send(error)
        }
    });
    routes.get("/:id", async (req, res, next) => {
        const userId = Number(req.params.id)
        try {
            let items = await ordersModel.getOrderById(db, userId).then((item) => {
                return res.json({ item });
            })
        } catch (error) {
            res.status(401).send(error)
        }
    });


    return routes;
}