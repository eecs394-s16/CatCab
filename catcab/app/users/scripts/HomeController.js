angular
	.module('users')
	.controller("HomeController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {
		

		view = new supersonic.ui.View("users#home");
		view.start("home").then( function(startedView) {
		  supersonic.ui.layers.replace(startedView);
		});
			$scope.firstName = localStorage.getItem("firstName");

			$scope.homeTapped = function(){
			};

		}


	]);