var myPhoneNumber = 0
supersonic.logger.log("Outside angular")

angular
	.module('users')
	.controller("LoginController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {

			$scope.badLogin = false;

			// var ref = new Firebase("https://catcab.firebaseio.com/users");
			// $scope.users = $firebaseArray(ref);

			$scope.phone_num = 0;
			// supersonic.logger.log("HI there!"+$scope.phone);

			$scope.login_user = function() {

				$scope.phone_num = $scope.phone;
				localStorage.setItem("phoneNumber", $scope.phone );
				// supersonic.logger.log("Phone: "+localStorage.getItem("phoneNumber"));

				var testRef = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone_num);
				var obj = new $firebaseObject(testRef);
				obj.$loaded().then(function() {
						obj = obj.$value;
					});
				var myRecord = obj;
				// var myRecord = $scope.users.$getRecord($scope.phone_num);

				if (myRecord === null){
					// user not in database, 
					// display a message saying "not in database"
					// and show a sign-up button
					$scope.badLogin = true;
				}
				else
				{
					// got the user approved 

					// save local storage
					supersonic.logger.log("Name is "+myRecord.firstName);

					localStorage.setItem("firstName",myRecord.firstName);

					localStorage.setItem("lastName", myRecord.lastName);

					localStorage.setItem("phoneNumber",$scope.phone);

					localStorage.setItem("imgSrc", myRecord.imgSrc);

					localStorage.setItem("matches", myRecord.matches);


					// move to home view

					var view = new supersonic.ui.View("users#home");
					var customAnimation = supersonic.ui.animate("flipVerticalFromBottom");
					supersonic.ui.layers.push(view, { animation: customAnimation });

				}

			}; 


		}

	]);