
var cluster = require( 'cluster' );
var config = require( './config' );

var numberOfWorkers = config.server.workers;
var isClustered = ( numberOfWorkers > 1 );

function listenForWorkerMessages( worker ){

	worker.on( 'message', function( msg ){

		console.log( 'Master sending message to workers' );

		Object.keys( cluster.workers ).forEach( function( workerId ){
			cluster.workers[ workerId ].send( msg );
		} );
	} );
}

function startApp(){

	var express = require( 'express' );
	var routes = require( './routes' );
	var nunjucks = require( 'nunjucks' );
	var serveStatic = require( 'serve-static' );
	var path = require( 'path' );
	var logger = require( 'morgan' );

	var app = express();
	var serverConfig = config.server;
	var pathToPublic = path.resolve( __dirname, '../public' );
	var pathToComponents = path.resolve( __dirname, '../components' );
	var env = app.get( 'env' );
	var isDev = ( 'development' === env );

	app.set( 'view engine', 'html' );
	app.set( 'view cache', config.views.cache );

	nunjucks.configure( [( __dirname + '/views' ), pathToComponents], {
		autoescape: true,
		watch: config.isDev,
		noCache: !config.views.cache,
		express: app
	} );

	app.use( '/public', serveStatic( pathToPublic ) );
	if(isDev) {
		app.use( '/public/components', serveStatic( pathToComponents ) );
	}
	app.use( logger( ( isDev ? 'dev' : 'combined' ) ) );

	// Strip .html and .htm if provided
	app.get(/\.html?$/i, function (req, res) {
	  var path = req.path;
	  var parts = path.split('.');
	  parts.pop();
	  path = parts.join('.');
	  res.redirect(path);
	});

	// Auto render any view that exists

	// Try to match a request to a template, for example a request for /test
	// would look for /app/views/test.html
	// or /app/views/text/index.html
	function matchRoutes(req, res) {
	  var path = (req.params[0]);
	  res.render(path, function (err, html) {
	    if (err) {
	      res.render(path + '/index', function (err2, html) {
	        if (err2) {
	          res.status(404).send(err + '<br>' + err2);
	        } else {
	          res.end(html);
	        }
	      })
	    } else {
	      res.end(html);
	    }
	  });
	}

	routes( express, app );

	// App folder routes get priority
	app.get(/^\/([^.]+)$/, function (req, res) {
	  matchRoutes(req, res);
	});

	// Redirect all POSTs to GETs - this allows users to use POST for autoStoreData
	app.post(/^\/([^.]+)$/, function (req, res) {
	  res.redirect('/' + req.params[0]);
	});

	var server = app.listen( serverConfig.port, function(){

		if( isClustered ){

			console.log( 'Worker ' + cluster.worker.id + ' created: App running in %s mode, listening at http://%s:%s', env, serverConfig.host, serverConfig.port );

		} else {

			console.log( '\nApp running in %s mode\nListening at http://%s:%s', env, serverConfig.host, serverConfig.port );
		}
	});

	if( isClustered ){

		cluster.worker.on( 'message', function( msg ){

			console.log( 'Worker ' + cluster.worker.id + ' received message' + msg );
		} );

		if( isDev ){
			app.use( function( req, res, next ){

				console.log( 'Worker: %s, handling request: %s', cluster.worker.id, req.url );
				next();
			} );
		}
	}
}

if( isClustered ){

	//if this is the master then create the workers
	if( cluster.isMaster ){

		for( var i = 0; i < numberOfWorkers; i++ ) {

			listenForWorkerMessages( cluster.fork() );
		}

	//if we are a worker then create an HTTP server
	} else {

		startApp();
	}

} else {

	startApp();
}
