define(function (require, exports, module) {

	'use strict';

	var Controller = function ($scope, $http, $location, usersClient, authState) {


		usersClient.logout(function (res) {
				console.log('success', res);
				authState.removeUserState();
				$location.path("/");
			},
			function (res) {
				console.log('error', res);
				//alert('logout failed, fuck off');
			});
	};

	Controller.$inject = ['$scope', '$http', '$location', 'usersClient', 'authState'];


	module.exports = Controller;

});
