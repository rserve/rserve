define(function (require, exports, module) {

	'use strict';

	var angular = require('angular'),
		config = require('json!data/config.json');


	//create app as module
	var app = angular.module(config.appName, ['ngCookies']).

		//add config values
		value('version', config.version).
		value('name', config.appName);

	module.exports = app;
});
