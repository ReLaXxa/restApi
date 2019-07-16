const routes = require('express').Router();
const ordersModel = require('../models/orders');
module.exports = (checkToken, db) => {
    routes.get("/", checkToken,async (req, res, next) => {
        try {
            await ordersModel.getAllOrders(db).then((item) => res.json({ item }))
        } catch (error) {
            console.log(error)
            res.status(401).send(error)
        }
    });
    routes.get("/:id", checkToken, async (req, res, next) => {
        const orderId = Number(req.params.id)
        try {
            let items = await ordersModel.getOrderById(db, orderId).then((item) => {
                return res.json({ item });
            })
        } catch (error) {
            res.status(401).send(error)
        }
    });
    routes.post("/", checkToken, async (req, res, next) => {
        if (!req.body.products) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a products' });
        if (!req.body.status) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a status' });
        const order = {
            products: req.body.products,
            status: req.body.status
        };
        try {
            await ordersModel.createNewOrder(db, order).then((items) => res.status(201).send({ msg: 'Order is made' }));
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });
    routes.patch("/:id", checkToken, async (req, res, next) => {
        if (!req.params.id) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a id' });
        if (!req.body.status) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a status' });
        const order = {
            id: req.params.id,
            status: req.body.status
        };
        try {
            await ordersModel.changeOrderStatus(db, order).then((items) => res.status(200).send({ msg: "Order's staus has been changed" }));
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });
    routes.put("/:id*?", checkToken, async (req, res, next) => {
        // if (!req.body.id) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a id' });
        if (!req.body.status) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a status' });
        const order = {
            id: req.params.id||0,
            status: req.body.status,
            products: req.body.products
        };
        try {
            await ordersModel.getOrderById(db, order.id).then(async(item) => {
               if(item===undefined){
                   await ordersModel.createNewOrder(db, order).then((items) => res.status(201).send({ msg: 'Order is made' }));
               }else{
                   await ordersModel.changeOrderStatus(db, order).then((items) => res.status(200).send({ msg: "Order has been updated" }));
               }
            })
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });

    return routes;
}