const multer = require( 'multer' );
const bodyParser = require('body-parser');

const upload = multer( {
	dest: './tmp-uploads'//,
	// limits: '1mb',
	// fileFilter: function( req, file, cb ){

	// 	let ok = false;

	// 	if( file.mimetype === 'image/jpeg' ){
	// 		ok = true;
	// 	}

	// 	cb( null, ok );
	// }
} );

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

	app.get('/examples/select-box', function( req, res ){
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

	app.get('/examples/stepper', function( req, res ){
		res.render('examples/stepper.html');
	});

	app.get('/examples/search-form', function( req, res ){
		res.render('examples/search-form.html');
	});

	app.get('/examples/dropzone', function( req, res ){
		res.render('examples/dropzone.html');
	});

	app.post('/examples/upload', upload.array( 'documents', 10 ), function( req, res ){
		console.log(req.files);
		res.render( 'examples/dropzone.html', { files: req.files } );
	} );

	app.post('/ajax-upload', upload.array( 'documents', 10 ), function( req, res ){
		console.log(req.files);

		res.json({ files: req.files });

	} );

};
