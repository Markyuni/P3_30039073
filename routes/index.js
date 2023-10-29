var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Datos del Estudiante',
    nombre: 'Jesús', apellido: 'Ramírez',
    cedula: '30.039.073',
    seccion: '1'
  });
});

router.post('/', function(req, res, next) {

  res.redirect('/');
});

module.exports = router;
