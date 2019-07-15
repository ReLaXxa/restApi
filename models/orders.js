module.exports = {
    getAllOrders(db) {
        const sql = "select * from user";
        const params = [];
        return db.all(sql, params);
    },
    getOrderById(db, userId) {
        const sql = "select * from user where id = $1"
        let params = [userId]
        return db.get(sql, params);
    },
    createNewOrder(db, userId) {
        const sql = "select * from user where id = $1"
        let params = [userId]
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    },
    deleteOrderById(db, userId) {
        const sql = "select * from user where id = $1"
        let params = [userId]
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    },
    changeOrderStatus(db, userId) {
        const sql = "select * from user where id = $1"
        let params = [userId]
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    }
}