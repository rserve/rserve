define(['app/partials', ], function (partials) {

	'use strict';

	var Controller = function ($scope, $http, $location, $rootScope) {

		$scope.template = {name: 'version', url: partials.userInfo};

	};

	Controller.$inject = ['$scope', '$http', '$location', '$rootScope'];
//export
	return Controller;

})
;
