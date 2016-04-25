
angular
	.module('users')
	.controller("SignupController", ["$scope", "$firebaseArray","$firebaseObject",
		function($scope, $firebaseArray, $firebaseObject) {

			$scope.phone_stored = localStorage.getItem("phoneNumber");
			// var ref = new Firebase("https://catcab.firebaseio.com/users");
			// $scope.users = $firebaseArray(ref);

	     	$scope.imgData = null;
			$scope.imgSrc = 0;
			$scope.firstName = "";
			$scope.lastName = "";
			$scope.phone = null;
			$scope.email = "@u.northwestern.edu";

			$scope.valid_email = true;

			$scope.addUser = function() {

				supersonic.logger.log("Adding new user");

				$scope.valid_email = $scope.email.endsWith("northwestern.edu");

				if ($scope.valid_email === true)
				{
					supersonic.logger.log("Email is valid");

					var newuser = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone);
				
					var obj = new $firebaseObject(newuser);

					obj.$loaded().then(function() {
					  	supersonic.logger.log(obj.$value); // "bar"
					});

					var data = {
							firstName: $scope.firstName,
							lastName: $scope.lastName,
							phone: $scope.phone,
							imgSrc: $scope.imgSrc,
							matches: "",
							history: "",
							sent_welcome: 0,
							email: $scope.email
					};
					
					localStorage.setItem("phoneNumber",$scope.phone);
					localStorage.setItem("firstName",data.firstName);
					localStorage.setItem("lastName", data.lastName);
					localStorage.setItem("imgSrc", data.imgSrc);
					
					obj.$value = data;
	  				obj.$save().then(function(ref) {
	  					supersonic.logger.log("Added a user "+data.firstName+" and phone "+data.phone);

					localStorage.setItem("phoneNumber",$scope.phone);
					localStorage.setItem("firstName",data.firstName);
					
					var view = new supersonic.ui.View("users#home");
					var customAnimation = supersonic.ui.animate("flipVerticalFromBottom");
					supersonic.ui.layers.push(view, { animation: customAnimation });

	  				});

					
				}
				else
				{
					supersonic.logger.log("Email is NOT valid");

				}

				
			}; 


	    	// Note/Feature to add: Allow users to use camera to take a current photo of themselves using front-cam?

	     	// Get the image from the user's camera roll
	      	$scope.getImage = function() {
		        var options = {
		         	quality: 60,
		          	encodingType: "png",
		          	mediaType: "picture",
		          	targetWidth: 600,
		          	targetHeight: 600,
		          	allowEdit: true,
		          	destinationType: "dataURL"
		        };
		        supersonic.media.camera.getFromPhotoLibrary(options).then(function(result) {
		          	$scope.imgSrc = "data:image/png;base64," + result;
		          	$scope.imgData = result;
		          	$scope.$evalAsync();
		        });
	      };
		
		}

	]);