var express = require('express');
const db = require('../database');
const nodemailer = require('nodemailer');
var router = express.Router();

/* GET public home page */
router.get('/', function(req, res, next) {
  let user = req.session.status;
  if(user == undefined) {
    req.session.status = 'inactive';
  } 

  db.selectProdImg((data) => {
    res.render('index_public', { products: data });
  });
});

/* GET admin login page. */
router.get('/admin_login', function(req, res, next) {
  res.render('login');
});

/* GET admin home page. */
router.get('/index_admin', function(req, res, next) {
  res.render('index_admin');
});

/* GET Product page */
router.get('/producto_venta/:id', function(req, res, next) {
  let prodID = req.params.id;

  console.log(prodID);

  db.selectVenta(prodID, (data) => {
    console.log(data);
    res.render('producto_venta', { products: data })
  });
});

/* GET Product Buying page. */
router.get('/producto_compra/:id', function(req, res, next) {
  let prodID = req.params.id;

  const status = req.session.status;
  if (status !== 'active') {
    res.redirect('/clientes_ingreso');
  }

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

/* GET Password recovery page. */
router.get('/recover', function (req, res) {
  res.render('contraseña_recuperar');
});

/* GET Ratings average */
router.get('/api/ratings/average/:id', (req, res) => {
  const producto_id = req.params.id;

  db.averageRating(producto_id, (row) => {
    res.json({ average: row.average });
  });
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
  let correo = req.body.email;
  let contraseña = req.body.pwd;
  let contraseña2 = req.body.pwd2;

  console.log({ correo, contraseña, contraseña2 });

  if (contraseña === contraseña2) {
    db.insertCliente(correo, contraseña);

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.AUTH_USER_FROM,
      pass: process.env.AUTH_PASS
    }
  });

  const mailOptions = {
    from: process.env.AUTH_USER_FROM,
    to: process.env.TO,						// local
  //  to: correo,										// render
    subject: 'Registro hecho exitosamente',
    text: 'Bienvenido, nuevo usuario. Es un placer tenerlo en nuestro sitio web.\nQue disfrute su estadía.'
  }

  transporter.sendMail(mailOptions, function(error,info){
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });

    res.redirect('/');
  } else {
    console.log("Las contraseñas no coinciden");
    
    res.redirect('/clientes_registro');
  };
});

router.post('/ingreso', function(req, res, next) {
  let correo = req.body.email;
  let contraseña = req.body.pwd;

  db.loginCliente(correo, (row) => {
    console.log(row);

    if (row[0].contraseña === contraseña) {
      console.log("Inicio de sesión exitoso.");
      
      req.session.correo = row[0].email;
      req.session.userID = row[0].id;
      req.session.status = "active";

      res.redirect('/');
    } else {
      res.send("Contraseña incorrecta.");
    }
  });
});

router.post('/recover', function(req, res) {
  let correo = req.body.email;

  db.recoverContraseña(correo, (datos) => {
  	if (!datos) {
    	console.log('No se encontraron datos para el correo electrónico proporcionado.');
    	return;
  	}

	  const transporter = nodemailer.createTransport({
	    host: process.env.HOST,
	    port: 465,
	    secure: true,
	    auth: {
	      user: process.env.AUTH_USER_FROM,
	      pass: process.env.AUTH_PASS
	    }
	  });

	  const mailOptions = {
	    from: process.env.AUTH_USER_FROM,
	    to: process.env.TO,								// local
	  //  to: correo,												// render
	    subject: 'Recuperación de contraseña',
	    text: `Parece ser que había perdido su contraseña.\nContraseña: ${datos[0].contraseña}`,
	    html: `<p>Parece ser que había perdido su contraseña.<p><br><p>Contraseña: ${datos[0].contraseña}</p>`
	  }

	  transporter.sendMail(mailOptions, function(error,info){
	    if (error) {
	      console.log(error);
	    } else {
	      console.log('Correo enviado: ' + info.response);
	    }
	  });
  });

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

  let correo = req.session.correo;
  let cliente_id = req.session.userID;
  let producto_id = req.body.producto_id;
  let rating = req.body.rating;
  let cantidad = req.body.cantidad;
  let amount = req.body.amount;
  let date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  const cliente_ip = ip.split(",")[0];

  console.log({ correo, cliente_id, producto_id, rating, cantidad, amount, date, cliente_ip });

  db.countRating(producto_id, cliente_id, rating);
  db.insertClienteDatos(cliente_id, producto_id, cantidad, amount, date, cliente_ip);

  const paymentData = {
    "amount": amount,
    "card-number": req.body.card_number,
    "cvv": req.body.cvv,
    "description": req.body.description,
    "expiration-month": req.body.expiration_month,
    "expiration-year": req.body.expiration_year,
    "full-name": req.body.full_name,
    "currency": "USD",
    "reference": "N/A"
  };

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
    console.log("Response:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.AUTH_USER_FROM,
      pass: process.env.AUTH_PASS
    }
  });

  const mailOptions = {
    from: process.env.AUTH_USER_FROM,
    to: process.env.TO,								// local
  //  to: correo,												// render
    subject: 'Compra realizada correctamente',
    text: `Su compra ha sido realizada correctamente.\nMuchas gracias por comprar en Lentes de Sol para Toda la Familia.`
  }

  transporter.sendMail(mailOptions, function(error,info){
    if (error) {
      console.log(error);
    } else {
      console.log('Correo enviado: ' + info.response);
    }
  });

  res.redirect('/');
});

module.exports = router;