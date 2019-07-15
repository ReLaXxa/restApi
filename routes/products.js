const routes = require('express').Router();
const request = require('request');
const productsModel = require('../models/products');

module.exports = (checkToken, db) => {
    routes.get("/", async (req, res, next) => {
        try {
            await productsModel.getAllProducts(db).then((items) => res.status(200).send({ items }))
        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
    });
    routes.post("/", checkToken, async (req, res, next) => {
        if (!req.body.name) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a name' });
        if (!req.body.category) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a category' });
        if (!req.body.price) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a price' });
        if (!req.body.country_code) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a country code' });

        await request('http://jsonvat.com', async (error, response,body) => {
            if(error) return res.status(500).send({mgs:'We have some issues retrieving the vats'});
            
            console.log(typeof response.body.rates);

            let filtered = JSON.parse(body).rates.filter((desired_country) => desired_country.country_code === req.body.country_code.toUpperCase());
            if (filtered.length === 0) {
                return res.status(400).json({ error: 'cannot get vat info for country code ' + req.body.country_code });
            }
            let periods = filtered[0].periods;
            let date = new Date();
            let usage_period;
            for (let period of periods) {
                let eff = period.effective_from.split('-');
                //maybe we should check for month as well?!
                if (Number(eff[0]) < date.getFullYear()) { 
                    usage_period = period;
                    break;
                }
            }
            if (usage_period===undefined) return res.status(400).json({ error: 'cannot get effective vat record for country code ' + req.body.country_code});

            let productPrice = (Number(req.body.price) + (Number(req.body.price) * Number(usage_period.rates.standard) / 100)).toFixed(2);
            
            const product = {
                name: req.body.name,
                category: req.body.category,
                price: productPrice
            };
            try {
                await productsModel.createNewProduct(db, product).then((items) => {
                    console.log(items);
                    res.status(200).send({ msg: 'Item is saved' })
                });
            } catch (error) {
                console.log(error)
                res.status(400).send(error)
            }
        });
    });
    routes.get("/:id", checkToken, async (req, res, next) => {
        const productId = Number(req.params.id);
        try {
            await productsModel.getProductById(db, productId).then((items) => res.status(200).send({ items }));
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });
    routes.patch("/:id", checkToken, async (req, res, next) => {
        if (!req.params.id) return res.status(400).send({ msg: 'Form error.', reason: 'You need to point an ID' });
        if (!req.body.name) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a name' });
        if (!req.body.category) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a category' });
        if (!req.body.price) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a price' });

        const product = {
            id: req.params.id,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price
        };
        try {
            await productsModel.editProductById(db, product).then((items) =>
                res.json({ items })
            )
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });
    routes.delete("/:id", checkToken, async (req, res, next) => {
        if (!req.params.id) return res.json({ msg: 'Form error.', reason: 'You need to point an ID' });
        const productId = req.params.id;
        try {
            await productsModel.deleteProductById(db, productId).then((items) =>
                res.status(200).send({ msg: `Id with id:${productId} has been deleted ` })
            )
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });
    return routes;
}