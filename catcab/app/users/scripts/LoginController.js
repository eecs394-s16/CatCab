angular
	.module('users')
	.controller("LoginController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {

			if (localStorage.getItem("phoneNumber") !== null) {
				supersonic.ui.views.start("users#home").then(function (startedView) {
			  		supersonic.ui.layers.replace(startedView);
				});
			}

			$scope.badLogin = false;

			// supersonic.logger.log("HI there!"+$scope.phone);

			$scope.login_user = function() {
				// supersonic.logger.log("Phone: "+localStorage.getItem("phoneNumber"));

				var userRef = new Firebase("https://catcab.firebaseio.com/users/"+phone);
				var obj = new $firebaseObject(userRef);
				obj.$loaded().then(function() {
					if (obj === null) {
						// user not in database, 
						// display a message saying "not in database"
						// and show a sign-up button
						$scope.badLogin = true;
					}
					else
					{
						// got the user approved

						// save local storage
						supersonic.logger.log("Name is "+obj.firstName);

						localStorage.setItem("firstName",obj.firstName);

						localStorage.setItem("lastName", obj.lastName);

						localStorage.setItem("phoneNumber", phone);

						localStorage.setItem("imgSrc", obj.imgSrc);

						localStorage.setItem("matches", obj.matches);


						// move to home view
						// var view = new supersonic.ui.View("users#home");
						// var customAnimation = supersonic.ui.animate("flipVerticalFromBottom");
						// supersonic.ui.layers.push(view, { animation: customAnimation });
						supersonic.ui.views.start("users#home").then(function (startedView) {
					  		supersonic.ui.layers.replace(startedView);
						});
					}
				});
			};
		}
	]);