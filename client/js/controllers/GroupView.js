define(['tools/logger'], function (logger) {

	'use strict';

	var Controller = function ($scope, $http) {

		$http.get('data/group.json').success(function (data) {
			logger.log('GroupView - data received', data);
			$scope.group = data;
		});
	};


	//export
	return Controller;

});
