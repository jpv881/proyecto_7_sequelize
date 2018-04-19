var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('registro', {
        title: 'Agencia Viajes',
        layout: 'layoutSinFooter'
    });
});

module.exports = router;