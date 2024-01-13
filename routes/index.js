var express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = require('../database');
const jwt = require('jsonwebtoken');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* GET admin home page. */
router.get('/index_admin', function(req, res, next) {
  res.render('index_admin');
});

/* GET public home page */
router.get('/index_public', function(req, res, next) {
  db.selectProdImg((data) => {
    res.render('index_public', { products: data });
  });
});

/* GET Product page */
router.get('/index_public/producto_venta/:id', function(req, res, next) {

  let prodID = req.params.id;

  console.log(prodID);

  db.selectVenta(prodID, (data) => {
    console.log(data);
    res.render('producto_venta', { products: data })
  });
});

/* GET Product Buying page. */
router.get('/index_public/producto_venta/:id/producto_compra', function(req, res, next) {

  let prodID = req.params.id;

  console.log(prodID);

  db.selectVenta(prodID, (data) => {
    console.log(data);
    res.render('producto_compra', { products: data })
  });
});

/* GET Product Listing page. */
router.get('/producto_listado', function(req, res, next) {
  db.selectProductoImagen((rows, rows2) => {
    console.log(rows, rows2);
    res.render("producto_listado", {
      data: rows,
      data2: rows2
    });
  });
});

/* GET Insert Product page. */
router.get('/producto_insertar', function(req, res, next) {
  res.render('producto_insertar');
});

/* GET Modify Product page. */
router.get('/producto_listado/producto_modificar/:id', function(req, res, next) {

  let prodID = req.params.id;

  db.updateProducto1(prodID, (rows) => {
    console.log(rows);
    res.render('producto_modificar', { data: rows });
  });
});

/* GET Insert Image page. */
router.get('/imagen_agregar', function(req, res, next) {
  res.render('imagen_agregar');
});

/* GET Modify Image page. */
router.get('/producto_listado/imagen_modificar/:id', function(req, res, next) {

  let imgID = req.params.id;

  db.updateImagen1(imgID, (rows) => {
    console.log(rows);
    res.render('imagen_modificar', { data: rows });
  });
});

/* GET Category Listing page. */
router.get('/categoria_listado', function(req, res, next) {
  db.selectCategoria((rows) => {
    console.log(rows);
    res.render("categoria_listado", { data: rows });
  });
});

/* GET Insert Category page. */
router.get('/categoria_insertar', function(req, res, next) {
  res.render('categoria_insertar');
});

/* GET Modify Category page. */
router.get('/categoria_listado/categoria_modificar/:id', function(req, res, next) {

  let catID = req.params.id;

  db.updateCategoria1(catID, (rows) => {
    console.log(rows);
    res.render('categoria_modificar', { data: rows });
  });
});

/* GET Clients Listing page. */
router.get('/clientes_listado', function(req, res, next) {
  db.selectCliente((rows, rows2) => {
    console.log(rows, rows2);
    res.render('clientes_listado', {
      data: rows,
      data2: rows2
    });
  });
});

/* GET Clients signup page. */
router.get('/clientes_registro', function(req, res, next) {
  res.render('clientes_registro');
});

/* GET Clients signin page. */
router.get('/clientes_ingreso', function(req, res, next) {
  res.render('clientes_ingreso');
});

router.post('/login', function(req, res, next) {
  let admin = req.body.admin;
  let pwd = req.body.pwd;

  console.log({ admin, pwd });

  if (admin === process.env.ADMIN && pwd === process.env.PASSWORD) {
    res.redirect('/index_admin');
  } else {
    res.redirect('/');
  }
});

router.post('/insertarProducto', function(req, res, next) {
  let nombre = req.body.nombre;
  let color = req.body.color;
  let talla = req.body.talla;
  let codigo = req.body.codigo;
  let precio = req.body.precio;
  let descripcion = req.body.descripcion;
  let categoria_id = req.body.categoria;

  console.log({ nombre, color, talla, codigo, precio, descripcion, categoria_id });

  db.insertProducto(nombre, color, talla, codigo, precio, descripcion, categoria_id);

  res.redirect('/producto_insertar');
});

router.post('/eliminarProducto', function(req, res, next) {
  let id = req.body.id;

  console.log({ id });

  db.deleteProducto(id);

  res.redirect('/producto_listado');
});

router.post('/modificarProducto', function(req, res, next) {
  let nombre = req.body.nombre;
  let color = req.body.color;
  let talla = req.body.talla;
  let codigo = req.body.codigo;
  let precio = req.body.precio;
  let descripcion = req.body.descripcion;
  let categoria_id = req.body.categoria_id;
  let id = req.body.id;

  console.log({ nombre, color, talla, codigo, precio, descripcion, categoria_id, id });

  db.updateProducto2(nombre, color, talla, codigo, precio, descripcion, categoria_id, id);

  res.redirect('/producto_listado');
});

router.post('/agregarImagen', function(req, res, next) {
  let url = req.body.url;
  let producto_id = req.body.producto_id;
  let destacado = req.body.destacado;

  console.log({ url, producto_id, destacado });

  db.insertImagen(url, producto_id, destacado);

  res.redirect('/imagen_agregar');
});

router.post('/eliminarImagen', function(req, res, next) {
  let id = req.body.id;

  console.log({ id });

  db.deleteImagen(id);

  res.redirect('/producto_listado');
});

router.post('/modificarImagen', function(req, res, next) {
  let url = req.body.url;
  let producto_id = req.body.producto_id;
  let destacado = req.body.destacado;
  let id = req.body.id;

  console.log({ url, producto_id, destacado, id })

  db.updateImagen2(url, producto_id, destacado, id)

  res.redirect('/producto_listado')
})

router.post('/insertarCategoria', function(req, res, next) {
  let nombre = req.body.nombre;

  console.log({ nombre });

  db.insertCategoria(nombre);

  res.redirect('/categoria_insertar');
});

router.post('/modificarCategoria', function(req, res, next) {
  let nombre = req.body.nombre;
  let id = req.body.id;

  console.log({ nombre, id });

  db.updateCategoria2(nombre, id);

  res.redirect('/categoria_listado');
});

router.post('/registro', function(req, res, next) {
  let email = req.body.email;
  let contraseña = req.body.pwd;

  const token = jwt.sign({ 'email': email, 'pwd': contraseña }, process.env.JWT_KEY, { expiresIn: '30m' });

  console.log({ email, token });

  db.insertCliente(email, token);

  res.redirect('/');
});

router.post('/eliminarCliente', function(req, res, next) {
  let id = req.body.id;

  console.log({ id });

  db.deleteCliente(id);

  res.redirect('/clientes_listado');
});

router.post('/realizarCompra', function(req, res) {

  const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiBEb2UiLCJkYXRlIjoiMjAyNC0wMS0xM1QwMjozMjowMS41MTZaIiwiaWF0IjoxNzA1MTEzMTIxfQ.yTOnrLajL2aQfqdLjdNl7MLtDZPGv96w7WlKeQBvcPk";
  const apiUrl = "https://fakepayment.onrender.com";

  const paymentData = {
    "amount": req.body.amount,
    "card-number": req.body.card_number,
    "cvv": req.body.cvv,
    "expiration-month": req.body.expiration_month,
    "expiration-year": req.body.expiration_year,
    "full-name": req.body.full_name,
    "currency": "USD",
    "description": "N/A",
    "reference": "N/A"
  };

  jwt.verify(sessionToken, JWT, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido, por favor inicie sesión' })
    }
  })

  console.log({ paymentData} );

  fetch(apiUrl + "/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(paymentData),
  })
  .then((response) => response.json())
  .then((data) => {
    if (data.error === "token") {
      window.location.href = "/clientes_ingreso";
    } else {
      console.log("Response:", data);
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });

  res.redirect('/index_public');
});

module.exports = router;