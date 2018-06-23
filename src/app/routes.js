const multer = require( 'multer' );
const bodyParser = require('body-parser');
const urlBodyParser = bodyParser.urlencoded({ extended: true, limit: '1mb' });
const jsonBodyParser = bodyParser.json();
const defaultBodyParser = bodyParser();
const products = require("./data/products").products;

module.exports = function( express, app ){

	app.get('/', function(req, res) {
		res.render('index.html');
	});

	app.post('/examples/add-another', urlBodyParser, jsonBodyParser, defaultBodyParser, function( req, res ){
		console.log(require('util').inspect(req.body, { depth: 4 }));
		res.redirect('/components/add-another');
	});

	app.get('/examples/filter-form', function( req, res ){
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

	const upload = multer( {
		dest: './tmp-uploads',
		limits: { fileSize: 2000000 },
		fileFilter: function( req, file, cb ){
			let ok = false;

			if(!req.rejectedFiles) {
				req.rejectedFiles = [];
			}

			if( file.mimetype !== 'image/png') {
				cb(null, false);
				req.rejectedFiles.push({
					file: file,
					error: {
						code: 'FILE_TYPE'
					}
				});
			} else {
				cb(null, true);
			}
		}
	} ).array('documents', 10);

	// degraded
	app.post('/examples/upload', function( req, res ){
		upload(req, res, function(err) {
			console.log(req.rejectedFiles);

			if(err) {
				console.log(err)
			}
			res.render( 'examples/dropzone.html', { files: req.files } );
		});
	} );


	const uploadAjax = multer( {
		dest: './tmp-uploads',
		limits: { fileSize: 2000000 },
		fileFilter: function( req, file, cb ){
			let ok = false;
			if( file.mimetype !== 'image/png' ){
				return cb({
					code: 'FILE_TYPE',
					field: 'documents',
					file: file
				}, false);
			} else {
				return cb(null, true);
			}
		}
	} ).single('documents');

	// ajax
	app.post('/ajax-upload', function( req, res ){
		uploadAjax(req, res, function(error) {
			if(error) {
				if(error.code == 'FILE_TYPE') {
					error.text = error.file.originalname + ' is in the wrong format. You can only upload PNG files.';
				} else if(error.code == 'LIMIT_FILE_SIZE') {
					error.text = error.file.originalname + ' is too big. The file must be less than 2MB.';
				}
				res.json({ error });
			} else {
				res.json({ file: req.file });
			}
		} )
	} );

};
