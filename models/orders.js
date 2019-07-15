module.exports = {
    getAllOrders(db) {
        const sql = "select * from orders";
        const params = [];
        return db.all(sql, params);
    },
    getOrderById(db, userId) {
        const sql = "select * from orders where id = $1"
        let params = [userId]
        return db.get(sql, params);
    },
    createNewOrder(db, order) {
        const sql = `INSERT into orders (date,products,status) VALUES (date('now'),?,?)`
        let params = [order.products, order.status]
        return db.run(sql, params);
    },
    changeOrderStatus(db, order) {
        const sql = "UPDATE orders set status=? where id=?"
        let params = [order.status,order.id]
        return db.run(sql, params);
    }
}