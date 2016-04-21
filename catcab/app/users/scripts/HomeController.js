angular
	.module('users')
	.controller("HomeController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {
		
		view = new supersonic.ui.View("users#home");
		view.start("home").then( function(startedView) {
		  supersonic.ui.layers.replace(startedView);
		});
			$scope.firstName = localStorage.getItem("firstName");
			$scope.phone = localStorage.getItem("phoneNumber");

			var myDataRef = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone);
	        myDataRef.on('value', function(snapshot) {
	          var user = snapshot.val();
	          $scope.matches = user.matches;
	        });			

			$scope.homeTapped = function(){
			};

		}


	]);