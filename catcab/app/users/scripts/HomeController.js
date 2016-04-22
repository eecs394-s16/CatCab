angular
	.module('users')
	.controller("HomeController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {
		
		view = new supersonic.ui.View("users#home");
		view.start("home").then( function(startedView) {
		  supersonic.ui.layers.replace(startedView);
		});

			$scope.phone = localStorage.getItem("phoneNumber");
			// var ref = new Firebase("https://catcab.firebaseio.com/users");
			// $scope.users = $firebaseArray(ref);

			var ref1 = new Firebase("https://catcab.firebaseio.com/users/" + $scope.phone);
			$scope.userme = $firebaseObject(ref1);

			$scope.cancel_ride = function(v) {
				// Not Working Yet
				var newuser = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone+"/"+v);
				newuser.update({ status: 'cancelled'});
			}

			$scope.decline_ride = function(v) {
				// Not Working Yet
				var newuser = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone+"/"+v);
				newuser.update({ status: 'waiting'});
			}

		}


	]);