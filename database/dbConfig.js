var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, async(err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.')
        await db.run(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username text UNIQUE,
            password text,
            CONSTRAINT username_unique UNIQUE (username)
            )`,
            (err) => {
                if (err) {
                    console.log('We already have table "users". Skipping...');
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO users (username, password) VALUES (?,?)'
                    db.run(insert, ["admin", md5("pass123")])
                    db.run(insert, ["user", md5("pass123")])
                   
                }
            });
        await db.run(`CREATE TABLE products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name text,
            category text,
            price text,
            CONSTRAINT name_unique UNIQUE (name)
            )`,
            (err) => {
                if (err) {
                    console.log('We already have table "products". Skipping...');
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO products (name, category,price) VALUES (?,?,?)';
                    db.run(insert, ["Apple",'Fruit','1']);
                    db.run(insert, ["Milk", 'Diary', '2.5']);
                }
            });
        await db.run(`CREATE TABLE orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date text,
            products text,
            status text
            )`,
            (err) => {
                if (err) {
                    console.log('We already have table "orders". Skipping...');
                } else {
                    // Table just created, creating some rows
                    var insert = 'INSERT INTO orders (date, products,status) VALUES (?,?,?)';
                    db.run(insert, ["2018-05-29", '[1, 2]','Delivered']);
                    db.run(insert, ["2018-05-30", '[1]','Pending']);
                }
            });    
       
    }
    

});

module.exports = db