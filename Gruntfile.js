var exec = require( 'child_process' ).exec;

module.exports = function( grunt ){

	grunt.initConfig({

		pkg: grunt.file.readJSON( 'package.json' ),

		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today( "yyyy-mm-dd" ) %> */\n'
			}
		},

		clean: {
			dist: [ 'dist' ],
			components: [ 'src/public/components' ]
		},

		copy: {

			main: {
				files: [
					{
						expand: true,
						src: [ 'server.js', 'package.json', 'npm-shrinkwrap.json' ],
						dest: 'dist/'
					},{
						expand: true,
						src: [ 'run/**/*', '!**/*.{log,pid}' ],
						dest: 'dist/'
					}
				]
			},

			app: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [
							'app/**/*',
							'components/**/*.html',
							'!**/*.{js,es}hintrc'
						],
						dest: 'dist/'
					}
				]
			},

			pub: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [
							'public/**/*',
							'!*/{css,js}/**',
							'!**/*.{js,es}hintrc',
							'!**/*.map'
						],
						dest: 'dist/'
					}
				]
			},

			componentJs: {
				files: [
					{
						expand: true,
						cwd: 'src/',
						src: [
							'components/**/*.js'
						],
						dest: 'src/public/'
					}
				]
			}
		},

		useminPrepare: {
			html: 'dist/app/views/**/*.html'
		},

		usemin: {
			html: 'dist/app/views/**/*.html',
			js: 'dist/public/**/*.js',
			css: 'dist/public/**/*.css',
			options: {
				assetsDirs: [ 'dist', 'dist/public' ],
				patterns: {
					js: [
						[ /(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images' ]
					]
				}
			}
		},

		filerev: {
			options: {
				algorithm: 'md5',
				length: 8
			},
			pub: {
				src: [ 'dist/public/**/*', '!**/*.scss' ]
			}
		}
	});

	require( 'load-grunt-tasks' )( grunt );

	grunt.registerTask( 'dist', [ 'default:dev' ] );

	grunt.registerTask( 'default', 'Default prod build', function(){

		grunt.task.run([
			'clean',
			'copy',
			'useminPrepare',
			'concat:generated',
			'cssmin:generated',
			'uglify:generated',
			'filerev',
			'usemin',
			'clean:components'
		]);
	} );
};
