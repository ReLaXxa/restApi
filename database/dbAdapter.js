const dbConfig=require('./dbConfig');

module.exports={
    all:function(sql,params){
        return new Promise((resolve, reject) => {
            dbConfig.all(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    },
    get: function (sql, params) {
        return new Promise((resolve, reject) => {
            dbConfig.get(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    },
    run: function (sql, params) {
        return new Promise((resolve, reject) => {
            dbConfig.run(sql, params, (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            })
        });
    }
}

