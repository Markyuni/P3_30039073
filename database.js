const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./lentesSol.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');

    db.run("CREATE TABLE IF NOT EXISTS categorias (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT NOT NULL, color TEXT NOT NULL, talla TEXT NOT NULL, codigo TEXT NOT NULL, precio FLOAT NOT NULL, descripcion TEXT NOT NULL, categoria_id INTEGER NOT NULL, FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE CASCADE)");
    db.run("CREATE TABLE IF NOT EXISTS imagenes (id INTEGER PRIMARY KEY AUTOINCREMENT, url STRING, destacado TEXT, producto_id INTEGER, FOREIGN KEY (producto_id) REFERENCES productos (id) ON DELETE CASCADE)");

    db.run("CREATE TABLE IF NOT EXISTS clientes (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL, contraseña TEXT NOT NULL)");
    db.run("CREATE TABLE IF NOT EXISTS clientesDatos (id INTEGER PRIMARY KEY AUTOINCREMENT, cliente_id INTEGER NOT NULL, producto_id INTEGER NOT NULL, cantidad INTEGER NOT NULL, total_pagado FLOAT NOT NULL, fecha DATETIME, ip_cliente VARCHAR(15))");

    db.get("PRAGMA foreign_keys = ON");
});


module.exports = {
    insertProducto: function (nombre, color, talla, codigo, precio, descripcion, categoria_id) {
        db.run("INSERT INTO productos (nombre, color, talla, codigo, precio, descripcion, categoria_id) VALUES (?, ?, ?, ?, ?, ?, ?)", [nombre, color, talla, codigo, precio, descripcion, categoria_id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            // get the last insert id
            console.log(`A row in "productos" has been inserted with rowid ${this.lastID}`);
        });
    },
    insertImagen: function (url, producto_id, destacado) {
        db.run("INSERT INTO imagenes (url, producto_id, destacado) VALUES (?, ?, ?)", [url, producto_id, destacado], function (err) {
            if (err) {
                return console.log(err.message);
            }
            //get the last insert id
            console.log(`A row in "imagenes" has been inserted with rowid ${this.lastID}`);
        });
    },
    insertCategoria: function (nombre) {
        db.run("INSERT INTO categorias (nombre) VALUES (?)", [nombre], function (err) {
            if (err) {
                return console.log(err.message);
            }
            //get the last insert id
            console.log(`A row in "categorias" has been inserted with rowid ${this.lastID}`);
        });
    },
    insertCliente: function (email, contraseña) {
        db.run("INSERT INTO clientes (email, contraseña) VALUES (?, ?)", [email, contraseña], function (err) {
            if (err) {
                throw err;
            }
            //get the last insert id
            console.log(`A row in "clientes" has been inserted with rowid ${this.lastID}`);
        });
    },
    updateProducto1: function (prodID, callback) {
        db.all("SELECT * FROM productos WHERE id = ?", [prodID], function (err, rows) {
            if (err) {
                throw err;
            }

            callback(rows);
        });
    },
    updateProducto2: function (nombre, color, talla, codigo, precio, descripcion, categoria_id, id) {
        db.run("UPDATE productos SET (nombre, color, talla, codigo, precio, descripcion, categoria_id) = (?, ?, ?, ?, ?, ?, ?) WHERE id = ?", [nombre, color, talla, codigo, precio, descripcion, categoria_id, id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            //get the last updated id
            console.log(`A row in "productos" has been updated on rowid: `, id);
        });
    },
    updateCategoria1: function (catID, callback) {
        db.all("SELECT * FROM categorias WHERE id = ?", [catID], function (err, rows) {
            if (err) {
                throw err;
            }

            callback(rows);
        });
    },
    updateCategoria2: function (nombre, id) {
        db.run("UPDATE categorias SET nombre = ? WHERE id = ?", [nombre, id], function (err) {
            if (err) {
                return console.log(err.message);
            }
            //get the last updated id
            console.log(`A row in "categorias" has been updated on rowid: `, id);
        });
    },
    updateImagen1: function (imgID, callback) {
        db.all("SELECT * FROM imagenes WHERE id = ?", [imgID], function (err, rows) {
            if (err) {
                throw err;
            }

            callback(rows);
        });
    },
    updateImagen2: function (url, producto_id, destacado, id) {
        db.run("UPDATE imagenes SET (url, producto_id, destacado) = (?, ?, ?) WHERE id = ?", [url, producto_id, destacado, id], function (err) {
            if (err) {
                throw err;
            }

            //get the last updated id
            console.log(`A row in "imagenes" has been updated on rowid: `, id);
        });
    },
    deleteCategoria: function (id) {
        db.run("DELETE FROM categorias WHERE id = ?", [id], function (err) {
            if (err) {
                throw err;
            };
        });
    },
    deleteProducto: function (id) {
        db.run("DELETE FROM productos WHERE id = ?", [id], function (err) {
            if (err) {
                throw err;
            };
        });
    },
    deleteImagen: function (id) {
        db.run("DELETE FROM imagenes WHERE id = ?", [id], function (err) {
            if (err) {
                throw err;
            };
        });
    },
    deleteCliente: function (id) {
        db.run("DELETE FROM clientes WHERE id = ?", [id], function (err) {
            if (err) {
                throw err;
            };
        });
    },
    selectProductoImagen: function (callback) {
        db.all("SELECT * FROM productos", [], (err, rows) => {
            if (err) {
                throw err;
            } else {
                db.all("SELECT * from imagenes ORDER BY producto_id, destacado DESC", [], (err, rows2) => {
                    if (err) {
                        throw err;
                    }
                    callback(rows, rows2);
                });
            };
        });
    },
    selectCategoria: function (callback) {
        db.all("SELECT * FROM categorias", [], (err, rows) => {
            if (err) {
                throw err;
            }
            callback(rows);
        });
    },
    selectProdImg: function (callback) {
        db.all("SELECT * FROM productos", [], (err, info_prod) => {
            if (err) {
                throw err;
            } else {
                db.all("SELECT url, producto_id FROM imagenes WHERE destacado = 1", [], (err, info_img) => {
                    if (err) {
                        throw err;
                    }

                    // Crear un nuevo arreglo que combina info_prod e info_img
                    const combined = info_prod.map(prod => {
                        // Encontrar la imagen correspondiente para este producto
                        const img = info_img.find(i => i.producto_id === prod.id);

                        // Devolver un nuevo objeto que combina la información del producto e imagen
                        return {
                            ...prod,
                            img: img ? img.url : null
                        };
                    });

                    callback(combined);
                });
            };
        });
    },
    selectVenta: function (prodID, callback) {
        db.all("SELECT * FROM productos WHERE id = ?", [prodID], (err, info_prod) => {
            if (err) {
                throw err;
            } else {
                db.all("SELECT * FROM imagenes WHERE producto_id = ?", [prodID], (err, info_img) => {
                    if (err) {
                        throw err;
                    }

                    // Crear un nuevo arreglo que combina info_prod e info_img
                    const combined = info_prod.map(prod => {
                        // Encontrar la imagen correspondiente para este producto
                        const img = info_img.find(i => i.producto_id === prod.id);

                        // Devolver un nuevo objeto que combina la información del producto e imagen
                        return {
                            ...prod,
                            img: img ? img.url : null
                        };
                    });

                    callback(combined);
                });
            };
        });
    },
    selectCliente: function (callback) {
        db.all("SELECT * FROM clientes", [], (err, rows) => {
            if (err) {
                throw err;
            } else {
                db.all("SELECT * FROM clientesDatos", [], (err, rows2) => {
                    if (err) {
                        throw err;
                    }

                    callback(rows, rows2);
                });
            };
        });
    }
}