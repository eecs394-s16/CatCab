angular
  .module('users')
  .controller("IndexController", ["$scope", "$firebaseArray",
    function ($scope, $firebaseArray) {
    //create connection with the db, put users into the "users" folder on firebase
    var ref = new Firebase("https://catcab.firebaseio.com/users");
     // download the data into a local object
    $scope.users = $firebaseArray(ref);

    $scope.image = null;
    $scope.imgData = null;

    // add a new user to the database when a new person fills out the form 
    $scope.addUser = function() {
    $scope.users.$add({
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      phone: $scope.phone,
      terminal: $scope.terminal
    });
  };

  	// PHOTO UPLOADING/DISPLAYING CODE
  	// Will go into the image tag once user uploades a photo
	 $scope.imgSrc = null;
  
	// Note/Feature to add: Allow users to use camera to take a current photo of themselves using front-cam?

	// Get the image from the user's camera roll
	$scope.getImage = function() {
		var options = {
			quality: 50,
			allowEdit: true,
			encodingType: "png",
			sourceType: 0,
			// destinationType: navigator.camera.DestinationType.FILE_URI, // for image URI method
			destinationType: navigator.camera.DestinationType.DATA_URL, // for base64 method
			targetWidth: 300
		};
		navigator.camera.getPicture(onCameraSuccess, onCameraFail, options);
		$scope.$apply();
	};    
    
	// Uses the imageData (base64 string) to create a full image source for the HTML img tag
    function onCameraSuccess(imageData) {
        $scope.imgSrc = "data:image/png;base64,"+imageData;
        $scope.imgData = imageData;
        $scope.$apply();
    }

    // Displays a pop-up message if either no photo is selected, or another error occurs
    function onCameraFail(message) {
        alert('Failed because: ' + message);
        $scope.$apply();
	}


  }]);

  // , supersonic