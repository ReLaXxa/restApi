const routes = require('express').Router();
const request = require('request');
const productsModel = require('../models/products');

module.exports = (checkToken, db) => {
    routes.get("/", checkToken, async (req, res, next) => {
        try {
            await request('http://jsonvat.com', async (error, response, body) => {
                let usage_period;
            
                if (req.decoded) {
                    if (error) return res.status(500).send({ mgs: 'We have some issues retrieving the vats' });

                    let filtered = JSON.parse(body).rates.filter((desired_country) => desired_country.country_code === req.decoded.country_code.toUpperCase());
                    if (filtered.length === 0) {
                        return res.status(404).json({ error: 'Cannot get vat info for country code ' + req.body.country_code });
                    }
                    let periods = filtered[0].periods;
                    let date = new Date();

                    for (let period of periods) {
                        let eff = period.effective_from.split('-');
                        //maybe we should check for month as well?!
                        if (Number(eff[0]) < date.getFullYear()) {
                            usage_period = period;
                            break;
                        }
                    }
                    if (usage_period === undefined) return res.status(404).json({ error: 'Cannot get effective vat record for country code ' + req.body.country_code });
                }
                await productsModel.getAllProducts(db).then((items) => {
                    if (usage_period == undefined) return res.status(200).send({ msg: 'No VAT for annonymous users. Loging to recieve VAT prices', items })
                    let evaluatedItems;
                    let productPrice = (Number(req.body.price) + (Number(req.body.price) * Number(usage_period.rates.standard) / 100)).toFixed(2);
                    evaluatedItems = items.forEach((el) => {
                        el.price = (Number(el.price) + (Number(el.price) * Number(usage_period.rates.standard) / 100)).toFixed(2);
                    })
                 
                    return res.status(200).send({ items })
                })
            });
        } catch (error) {
            console.log(error)
            return res.status(400).send(error)
        }
    });
    routes.post("/", checkToken, async (req, res, next) => {
        if (!req.body.name) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a name' });
        if (!req.body.category) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a category' });
        if (!req.body.price) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a price' });
        const product = {
            name: req.body.name,
            category: req.body.category,
            price: req.body.price
        };
        try {
            await productsModel.createNewProduct(db, product).then((items) => {
                console.log(items);
                res.status(201).send({ msg: 'Item is saved' })
            });
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
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
    routes.put("/:id*?", checkToken, async (req, res, next) => {
        // if (!req.body.id) return res.status(400).send({ msg: 'Form error.', reason: 'You need to point an ID' });
        if (!req.body.name) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a name' });
        if (!req.body.category) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a category' });
        if (!req.body.price) return res.status(400).send({ msg: 'Form error.', reason: 'You need to provide a price' });
        const product = {
            id: req.params.id||0,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price
        };
        try {
            await productsModel.getProductById(db, product.id).then(async(items) => {
        
                if (items === undefined) {
                    await productsModel.createNewProduct(db, product).then((items) => 
                        res.status(201).send({ msg: 'Item is created' })
                    );
                } else {
                    await productsModel.editProductById(db, product).then((items) =>
                        res.status(201).send({ msg: 'Item is updated' })
                    )
                }
            });

        } catch (error) {
            console.log(error)
            let msg=error.errno==19? 'Name should be unique':'Something went wrong. Try again';
            let code = error.errno == 19 ? 400:500;
            res.status(code).send({msg})
        }
    });
    routes.delete("/:id", checkToken, async (req, res, next) => {
        if (!req.params.id) return res.json({ msg: 'Form error.', reason: 'You need to point an ID' });
        const productId = req.params.id;
        try {
            await productsModel.deleteProductById(db, productId).then((items) =>
                res.status(204).send({ msg: `Id with id:${productId} has been deleted ` })
            )
        } catch (error) {
            console.log(error)
            res.status(400).send(error)
        }
    });
    return routes;
}