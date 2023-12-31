var express = require('express');
const sqlite3 = require('sqlite3').verbose();
const db = require('../database');
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
    console.log(data)
    res.render('index_public', { products: data });
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
router.get('/producto_modificar', function(req, res, next) {
  res.render('producto_modificar');
});

/* GET Insert Image page. */
router.get('/imagen_agregar', function(req, res, next) {
  res.render('imagen_agregar');
});

/* GET Modify Image page. */
router.get('/imagen_modificar', function(req, res, next) {
  db.updateImagen1((rows) => {
    console.log(rows);
    res.render("imagen_modificar", { data: rows });
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
router.get('/categoria_modificar', function(req, res, next) {
  res.render('categoria_modificar');
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
  let categoria_id = req.body.categoria;
  let id = req.body.id;

  console.log({ nombre, color, talla, codigo, precio, descripcion, categoria_id, id });

  db.updateProducto(nombre, color, talla, codigo, precio, descripcion, categoria_id, id);

  res.redirect('/producto_modificar');
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

  db.updateImagen(id);

  res.redirect('/producto_listado');
});

router.post('/modificarImagen1', function(req, res, next) {
  let id = req.body.id;

  console.log({ id });

  db.updateImagen1(id);

  res.redirect('/imagen_modificar')
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

  db.updateCategoria(nombre, id);

  res.redirect('/categoria_modificar');
});

module.exports = router;