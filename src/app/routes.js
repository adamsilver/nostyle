const multer = require( 'multer' );
const bodyParser = require('body-parser');



const urlBodyParser = bodyParser.urlencoded({ extended: true, limit: '1mb' });
const jsonBodyParser = bodyParser.json();
const defaultBodyParser = bodyParser();

module.exports = function( express, app ){

	app.get('/', function(req, res) {
		res.render('index.html');
	});

	//
	//
	// Styles
	//
	//

	app.get( '/styles/', function( req, res ){
		res.render('styles/index.html');
	});

	app.get( '/styles/colours', function( req, res ){
		res.render('styles/colours.html');
	});

	//
	//
	// Components
	//
	//

	app.get('/components/', function(req, res) {
		res.render('components/index.html');
	});

	app.get( '/components/autocomplete', function( req, res ){
		res.render('components/autocomplete.html');
	});

	app.get( '/components/buttons', function( req, res ){
		res.render('components/buttons.html');
	});

	app.get( '/components/character-countdown', function( req, res ){
		res.render('components/character-countdown.html');
	});

	app.get( '/components/checkbox-group', function( req, res ){
		res.render('components/checkbox-group.html');
	});

	app.get( '/components/date-picker', function( req, res ){
		res.render('components/date-picker.html');
	});

	app.get( '/components/file-picker', function( req, res ){
		res.render('components/file-picker.html');
	});

	app.get( '/components/memorable-date', function( req, res ){
		res.render('components/memorable-date.html');
	});

	app.get( '/components/menu', function( req, res ){
		res.render('components/menu.html');
	});

	app.get( '/components/password-reveal', function( req, res ){
		res.render('components/password-reveal.html');
	});

	app.get( '/components/radio-buttons', function( req, res ){
		res.render('components/radio-buttons.html');
	});

	app.get( '/components/search-box', function( req, res ){
		res.render('components/search-box.html');
	});

	app.get( '/components/select-box', function( req, res ){
		res.render('components/select-box.html');
	});

	app.get( '/components/stepper', function( req, res ){
		res.render('components/stepper.html');
	});

	app.get( '/components/textarea', function( req, res ){
		res.render('components/textarea.html');
	});

	app.get( '/components/text-box', function( req, res ){
		res.render('components/text-box.html');
	});

	//
	//
	// Patterns
	//
	//

	app.get('/patterns/', function(req, res) {
		res.render('patterns/index.html');
	});


	app.get('/patterns/add-another', function(req, res) {
		res.render('patterns/add-another.html');
	});

	app.get('/patterns/validation', function( req, res ){
		res.render('patterns/validation.html');
	});

	app.get('/patterns/payment', function( req, res ){
		res.render('patterns/payment.html');
	});

	app.get('/patterns/dates', function( req, res ){
		res.render('patterns/dates.html');
	});

	app.get('/patterns/seats', function( req, res ){
		res.render('patterns/seats.html');
	});

	app.get('/patterns/upload', function( req, res ){
		res.render('patterns/upload.html');
	});

	app.get('/patterns/search', function( req, res ){
		res.render('patterns/search.html');
	});

	//
	//
	// Examples
	//
	//

	app.get('/examples/add-another', function( req, res ){
		res.render('examples/add-another.html');
	});

	app.post('/examples/add-another', urlBodyParser, jsonBodyParser, defaultBodyParser, function( req, res ){
		console.log(require('util').inspect(req.body, { depth: 4 }));
		res.redirect('/components/add-another');
	});

	app.get('/examples/primary-button', function( req, res ){
		res.render('examples/primary-button.html');
	});

	app.get('/examples/secondary-button', function( req, res ){
		res.render('examples/secondary-button.html');
	});


	app.get('/examples/payment', function( req, res ){
		res.render('examples/payment.html');
	});

	app.get('/examples/validation', function( req, res ){
		res.render('examples/validation.html');
	});

	app.get('/examples/seat-chooser', function( req, res ){
		res.render('examples/seat-chooser.html');
	});

	app.get('/examples/seat-chooser-nested', function( req, res ){
		res.render('examples/seat-chooser-nested.html');
	});

	app.get('/examples/seat-chooser-nested', function( req, res ){
		res.render('examples/seat-chooser-nested.html');
	});

	app.get( '/examples/menu', function( req, res ){
		res.render('examples/menu.html');
	});

	app.get('/examples/text-box', function( req, res ){
		res.render('examples/text-box.html');
	});

	app.get('/examples/file-picker', function( req, res ){
		res.render('examples/file-picker.html');
	});

	app.get('/examples/select-box', function( req, res ){
		res.render('examples/select-box.html');
	});

	app.get('/examples/search-box', function( req, res ){
		res.render('examples/search-box.html');
	});

	app.get('/examples/textarea', function( req, res ){
		res.render('examples/textarea.html');
	});

	app.get('/examples/radio-buttons', function( req, res ){
		res.render('examples/radio-buttons.html');
	});

	app.get('/examples/checkbox-group', function( req, res ){
		res.render('examples/checkbox-group.html');
	});

	app.get('/examples/memorable-date', function( req, res ){
		res.render('examples/memorable-date-field.html');
	});

	app.get('/examples/date-picker-always', function( req, res ){
		res.render('examples/date-picker-always.html');
	});

	app.get('/examples/date-picker-detect', function( req, res ){
		res.render('examples/date-picker-detect.html');
	});

	app.get('/examples/autocomplete', function( req, res ){
		res.render('examples/autocomplete.html');
	});

	app.get('/examples/character-countdown', function( req, res ){
		res.render('examples/character-countdown.html');
	});

	app.get('/examples/password-reveal', function( req, res ){
		res.render('examples/password-reveal.html');
	});

	app.get('/examples/stepper', function( req, res ){
		res.render('examples/stepper.html');
	});

	app.get('/examples/search-form', function( req, res ){
		res.render('examples/search-form.html');
	});

	app.get('/examples/dropzone', function( req, res ){
		res.render('examples/dropzone.html');
	});

	app.get('/examples/download-to-upload', function( req, res ){
		res.render('examples/download-to-upload.html');
	});

	app.get('/examples/filter-form/', function( req, res ){
		var nunjucks = require('nunjucks');

		var products = [1, 2, 3];

		if(req.query.color) {
			products = [1, 2, 3, 4, 5, 6];
		}
		if(req.query.color && req.query.rating) {
			products = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		}

		var query = (Object.keys(req.query).length > 0) ? req.query : { };
		if(req.headers['x-requested-with'] === 'XMLHttpRequest') {
			res.json({
				query: query,
				productsHtml: JSON.stringify(nunjucks.render('partials/products.html', {
					products: products
				}))
			});
		} else {
			res.render( 'examples/filter-form.html', {
				products: products
			});
		}
	} );


	// const upload = multer( {
	// 	dest: './tmp-uploads',
	// 	limits: { fileSize: 20000000 },
	// 	fileFilter: function( req, file, cb ){

	// 		let ok = false;

	// 		if( file.mimetype !== 'image/png' ){
	// 			ok = true;
	// 		} else {
	// 			req.failedfiles = req.failedfiles || [];
	// 			req.failedfiles.push(file);
	// 		}
	// 		cb( null, ok );
	// 	}
	// } ).array('documents', 10);

	const upload = multer( {
		dest: './tmp-uploads',
		limits: { fileSize: 000000 },
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
					error.text = 'You can only upload PNG files.';
				} else if(error.code == 'LIMIT_FILE_SIZE') {
					error.text = 'The file must be less than 2MB.';
				}
				res.json({ error });
			} else {
				res.json({ file: req.file });
			}
		} )
	} );

};
