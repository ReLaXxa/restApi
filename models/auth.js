let md5 = require('md5')
module.exports = {
    doLogin(db, username, password) {
        const sql = "select id from users where username=? and password=?";
        const params = [username, md5(password)];
        return db.get(sql, params);
    }
}