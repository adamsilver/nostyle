
function env( name, defaultValue ){

	var exists = ( typeof process.env[ name ] !== 'undefined' );

	return ( exists ? process.env[ name ] : defaultValue );
}

module.exports = {
    server: {
        protocol: env( 'SERVER_PROTOCOL', 'http' ),
        host: env( 'SERVER_HOST', 'localhost' ),
        port: env( 'SERVER_PORT', env( 'PORT', 8080 ) ),
        workers: env( 'SERVER_WORKERS', 1 )
    },
    views: {
        cache: env( 'CACHE_VIEWS', false )
    }
};
