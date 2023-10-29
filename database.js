const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');

    db.run("CREATE TABLE IF NOT EXISTS categorias (nombre TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS productos (nombre TEXT NOT NULL, color TEXT NOT NULL, talla TEXT NOT NULL, codigo TEXT NOT NULL, precio INTEGER NOT NULL, descripcion TEXT NOT NULL, categoria_id INTEGER PRIMARY KEY AUTOINCREMENT)")
    db.run("CREATE TABLE IF NOT EXISTS imagenes (producto_id INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT NOT NULL, destacado TEXT NOT NULL)")
});


module.exports = {
    insert: function (name, email, comment, date, myIP, pais, contraseña) {
        db.run("INSERT INTO contactos (name, email, comment, date, myIP, pais, contraseña) VALUES (?, ?, ?, ?, ?, ?)", [name, email, comment, date, myIP, pais, contraseña], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    },
    select: function (callback) {
        db.all("SELECT * FROM contactos", [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    }
}