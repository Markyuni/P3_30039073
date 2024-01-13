var express = require('express');
const config = require('../config');
const db = require('../database');
const axios = require('axios');
const nodemailer = require('nodemailer');
var router = express.Router();

// GET home page.
router.get('/', function(req, res, next) {
  res.render('index');
});

// GET contacts page.
router.get('/contactos', function(req, res, next) {
  db.select((rows) => {
    console.log(rows);
    res.render("contactos", { data: rows });
  });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/', async function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let comment = req.body.comment;
  let date = new Date(); // @todo falta formatear la fecha
  let ip = req.ip; // @todo falta formatear la ip

  const myIP = ip.split(",")[0];

  console.log({ name, email, comment, date, myIP });

  // axios.get(`http://ip-api.com/json/186.92.93.151?fields=country`).then((res) => { /* local */

  // axios.get(`http://ip-api.com/json/${myIP}`).then((res) => {                         /* render */
    // const pais = res.data.country;

    // console.log({ name, email, comment, date, myIP, pais });

    // db.insert(name, email, comment, date, myIP, pais);

    /*

    const transporter = nodemailer.createTransport({
      host: config.HOST,
      port: 465,
      secure: true,
      auth: {
        user: config.AUTH_USER_FROM,
        pass: config.AUTH_PASS
      }
    });

    const mailOptions = {
      from: config.AUTH_USER_FROM,
      to: config.TO,
      subject: 'Envío de datos',
      text: 'Datos de formulario:\nCorreo: ' + email + '\nNombre: ' + name + '\nComentario: ' + comment + '\nFecha: ' + date + '\nIP: ' + myIP + '\nPaís: ' + pais
    }

    transporter.sendMail(mailOptions, function(error,info){
      if (error) {
        console.log(error);
      } else {
        console.log('Correo enviado: ' + info.response);
      }
    });

    

  }).catch((error)=>{
    console.log(error)
  })
  
  */

  res.redirect('/login');
});

router.post('/login', function(req, res, next) {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.pwd;

  console.log({ name, email, password });

  if (name === config.FAKE_USER && email === config.FAKE_EMAIL && password === config.FAKE_PWD) {
    db.select(function(rows) {
      console.log(rows);
      res.redirect('/contactos');
    })
  } else {
    res.redirect('/login');
  };
});

router.post('/contactos', function(req, res, next) {

  db.select(function (rows) {
    console.log(rows);
    res.redirect('contactos');
  });
});

module.exports = router;
