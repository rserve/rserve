define(function (require, exports, module) {

	'use strict';

	var _ = require('underscore');

	var Group = require('../services/api/domain/Group');

	var Controller = function ($scope, $state, $stateParams, groupsClient, authState, flash, socket) {

		var key = $stateParams.groupId,
			client = groupsClient;


		function getGroup() {
			client.findByKey(key,
				function (group) {
					$scope.group = group;
					$scope.currentMember = group.member($scope.user);

				},
				function (data) {
					flash.error = data.message;
				});
		}

		function changeMemberStatus(status) {
			client.updateMember(key, $scope.currentMember.id, { status: status },
				function () {
					// do nothing since we already updated the client
				},
				function (data) {
					flash.error = data.message;
				}
			);
			$scope.currentMember.status = status;
		}

		$scope.yes = function () {
			changeMemberStatus('Yes');
		};

		$scope.no = function () {
			changeMemberStatus('No');
		};

		$scope.maybe = function () {
			changeMemberStatus('Maybe');
		};


		$scope.update = function () {

			if ($scope.groupForm.$invalid) {
				if ($scope.groupForm.name.$invalid) {
					flash.error = 'Name cannot be empty';
				} else {
					flash.error = 'Please check form.';
				}

			} else {
				//NOTE: now group is the form model, but cannot send whole object to backend,
				// pick out the form values
				//var data = $scope.group;
				var data = {
					name: $scope.group.name,
					description: $scope.group.description,
					public: $scope.group.public
				};

				var startDate = $scope.group.startDate ? new Date($scope.group.startDate) : new Date();

				if ($scope.group._weekday) {
					var current = $scope.group.weekday() || new Date().getDay();
					var diff = current - $scope.group._weekday;
					startDate.setDate(startDate.getDate() - diff);
				}

				if ($scope.group._time) {
					var t = $scope.group._time.split(':');
					startDate.setHours(t[0]);
					startDate.setMinutes(t[1]);
				}

				data.startDate = startDate;

				client.update(key, data,
					function (data) {
						$scope.group = data;
						flash.success = 'Meetup updated';
					},
					function (data) {
						flash.error = data.message;
					});
			}
		};

		$scope.invite = function () {
			if ($scope.inviteForm.$invalid) {
				flash.error = 'Please enter a valid email';
			} else {
				client.invite(key, $scope.inviteModel,
					function (data) {
						$scope.group = data;
						flash.success = 'User invited';
						$scope.inviteModel.email = "";
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

		$scope.join = function (user) {
			var register;

			if (!user) {
				register = true;

				if ($scope.joinForm.$invalid) {
					flash.error = 'Please enter a valid email';
					return;
				}

			} else {
				register = false;
			}

			client.join(key, $scope.joinModel,
				function (group) {
					$scope.group = group;
					if (register) {
						authState.refreshUserState();
						flash.success = 'An account as be created for you, please check your mail to verify.';
						if ($scope.joinModel) {
							$scope.joinModel.email = "";
						}
					} else {
						flash.success = 'You have joined the meetup';
					}
					$scope.currentMember = group.member($scope.user);
				},
				function (data) {
					// TODO: Better validation error handling
					if (data.name == 'ValidationError' && data.messages.email.type == 'Email already exists') {
						flash.success = 'Email is already registered, %sign in:/% first to join this group';
					} else {
						flash.error = data.message;
					}
				}
			);
		};

		$scope.leave = function (member) {
			client.removeMember(key, member.id,
				function (data) {
					flash.success = 'You have left the meetup';
					$state.transitionTo('groups');
				},
				function (data) {
					flash.error = data.message;
				}
			);
		};

		$scope.removeMember = function (member) {
			client.removeMember(key, member.id,
				function (data) {
					$scope.group = data;
					flash.success = 'Member removed';
				},
				function (data) {
					flash.error = data.message;
				}
			);
		};

		$scope.addComment = function () {
			if ($scope.commentForm.comment.$invalid) {
				flash.error = 'Comment cannot be empty.';
			} else {
				var user = $scope.currentMember.user;
				var data = _.extend($scope.commentModel, {
					author: user.displayName(),
					userRefId: user.id,
					hashedEmail: user.hashedEmail
				});

				client.addComment(key, data,
					function (data) {
						$scope.group = data;
						flash.success = 'Comment added';
						$scope.commentModel.text = "";
					},
					function (data) {
						flash.error = data.message;
					}
				);
			}
		};

		$scope.deleteComment = function (comment) {

			client.deleteComment(key, comment.id,
				function (data) {
					$scope.group = data;
					flash.success = 'Comment deleted';
				},
				function (data) {
					flash.error = data.message;
				}
			);

		};


		$scope.commentHelper = {
			increase: 10,
			visible: 5,
			total: function () {
				return $scope.group && $scope.group.comments.length;
			},
			showMore: function () {
				this.visible = Math.min(this.visible + this.increase, this.total());
			},
			more: function () {
				return  Math.min(this.total() - this.visible, this.increase);
			}


		};

		$scope.$on('socket:groupChanged', function (ev, message) {

			if (message.id === $scope.group.id) {
				$scope.group = new Group(message.data);
			}

		});

		getGroup();
	};

	//inject dependencies
	Controller.$inject = ['$scope', '$state', '$stateParams', 'groupsClient', 'authState', 'flash', 'socket'];

	module.exports = Controller;

});
