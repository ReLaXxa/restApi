module.exports = {
    getAllProducts(db) {
        const sql = "select * from products";
        const params = [];
        return db.all(sql, params);
    },
    getProductById(db, productId) {
        const sql = "select * from products where id = ?"
        let params = [productId]
        return db.get(sql, params);
    },
    createNewProduct(db, product) {
        const sql = "INSERT INTO products (name, category,price) VALUES (?,?,?);"
        let params = [product.name, product.category, product.price];
        return db.run(sql, params);
    },
    editProductById(db, product) {
        const sql = `UPDATE products 
                    SET
                        name='${product.name}',
                        category='${product.category}',
                        price='${product.price}'
                    where
                        id=${product.id}`;
        return db.run(sql, []);
    },
    deleteProductById(db, productId) {
        const sql = `DELETE from products
                     WHERE id=${productId}`;
        return db.run(sql, []);
    },
}