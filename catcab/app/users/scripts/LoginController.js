angular
	.module('users')
	.controller("LoginController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {

			$scope.loading = true;

			if (localStorage.getItem("phoneNumber") !== null) {
				login_gral(localStorage.getItem("phoneNumber"));
			} else {
				$scope.loading = false;
			}

			$scope.badLogin = false;

			// supersonic.logger.log("HI there!"+$scope.phone);

			$scope.login_user = function() {
				// supersonic.logger.log("Phone: "+localStorage.getItem("phoneNumber"));

				login_gral($scope.phone);
			};

			function login_gral(phone){
				$scope.loading = true;

				supersonic.logger.log("Phone is "+phone);

				if (phone === null){
					$scope.loading = false;
					$scope.badLogin = true;
					return;
				}

				var userRef = new Firebase("https://catcab.firebaseio.com/users/"+phone);
				var obj = new $firebaseObject(userRef);
				obj.$loaded().then(function() {
					if (obj.$value === null) {
						// user not in database, 
						// display a message saying "not in database"
						// and show a sign-up button
						$scope.badLogin = true;
						$scope.loading = false;
					} else {
						supersonic.logger.log("Name is "+obj.firstName);
						localStorage.setItem("firstName",obj.firstName);
						localStorage.setItem("lastName", obj.lastName);
						localStorage.setItem("phoneNumber", phone);
						localStorage.setItem("imgSrc", obj.imgSrc);
						localStorage.setItem("matches", obj.matches);

						var homeView = new supersonic.ui.View({
  							location: "users#home"	,
  							id: "home"					
  						});

						homeView.isStarted().then(function(started){
							if (started){
								supersonic.ui.layers.replace(homeView);	
							}
							else
							{
								homeView.start().then(function () {
									supersonic.ui.layers.replace(homeView);
								});

							}
						});

					}
				});
			}
		}
	]);