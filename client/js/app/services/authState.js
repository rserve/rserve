define([], function () {

	'use strict';

	var factory = ['$http', '$rootScope', '$cookieStore', function ($http, $rootScope, $cookieStore) {


		return {

			isAuth: function () {
				return !!this.getUserState();
			},


			getUserState: function () {
				var userString = sessionStorage.getItem("user"),
					user;
				if (userString) {
					user = JSON.parse(userString);
				}
				return user;
			},

			refreshUserState: function () {
				$rootScope.user = this.getUserState();
			},

			setUserState: function (user) {
				sessionStorage.setItem("user", JSON.stringify(user));
				$rootScope.user = user;

			},

			removeUserState: function () {
				sessionStorage.removeItem("user");
				$rootScope.user = null;
			}
		}
	}];

	//export
	return factory;

});