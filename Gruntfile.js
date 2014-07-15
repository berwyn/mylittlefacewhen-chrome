module.exports = function(grunt) {
	'use strict';
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: [
				'js/*.js'
			],
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				browser: true
			}
		}
	});
	require('load-grunt-tasks')(grunt);
}