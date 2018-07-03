const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlBodyParser = bodyParser.urlencoded({ extended: true, limit: '1mb' });
const jsonBodyParser = bodyParser.json();
const defaultBodyParser = bodyParser();
const products = require("../data/products").products;

router.get('/', function(req, res) {
  res.render('index.html');
});

router.post('/examples/add-another', urlBodyParser, jsonBodyParser, defaultBodyParser, function( req, res ){
  console.log(require('util').inspect(req.body, { depth: 4 }));
  res.redirect('/components/add-another');
});

router.get('/examples/filter-form', function( req, res ){
  var nunjucks = require('nunjucks');

  var p = products;

  if(typeof req.query.color === 'string') {
    p = products.filter(function(item) {
      return item.color == req.query.color;
    });
  } else if(Array.isArray(req.query.color)) {
    p = products.filter(function(product) {
      return req.query.color.includes(product.color);
    });
  }

  if(req.query.rating) {
    p = p.filter(function(item) {
      return item.rating == parseInt(req.query.rating, 10);
    });
  }

  var query = (Object.keys(req.query).length > 0) ? req.query : { };
  if(req.headers['x-requested-with'] === 'XMLHttpRequest') {
    res.json({
      query: query,
      productsHtml: JSON.stringify(nunjucks.render('partials/products.html', {
        products: p
      }))
    });
  } else {
    res.render( 'examples/filter-form.html', {
      products: p
    });
  }
} );

module.exports = router;