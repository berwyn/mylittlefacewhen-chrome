module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
				'*.js',
				'!**/node_modules/**',
				'!**/bower_components/**'
			],
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true
			}
		},

		less: {
			extension: {			
				files: {
					'extension/rainbow_dash.css': 'extension/rainbow_dash.less'
				}
			}
		}
	});
	require('load-grunt-tasks')(grunt);
}