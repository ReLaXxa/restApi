

module.exports = {
    getAllUsers(db) {
        const sql = "select * from user";
        const params = [];
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    },
    getUserById(db, userId) {
        const sql = "select * from user where id = $1"
        let params = [userId]
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    },
    setNewUser(db, userId) {
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