var myId;
var waiting = false;

angular
  .module('users')
  .controller("IndexController", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray) {
      //create connection with the db, put users into the "users" folder on firebase
      var ref = new Firebase("https://catcab.firebaseio.com/users");
      // download the data into a local object
      $scope.users = $firebaseArray(ref);

      // add a new user to the database when a new person fills out the form 
      $scope.addUser = function() {
        waiting = true;
        $scope.users.$add({
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          phone: $scope.phone,
          terminal: $scope.terminal,
          matchId: "",
          timeStamp: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {
          // Save current user's key
          myId = ref.key();
          supersonic.logger.log("My key is " + myId);

          var unwatch = $scope.users.$watch(function(event) {
            supersonic.logger.log(event);

            var myRecord = $scope.users.$getRecord(myId);

            // Someone matched with us
            if (event.event === "child_changed" && event.key === myId) {
              var matchRecord = $scope.users.$getRecord(myRecord.matchId)
              $scope.match = {
                firstName: matchRecord.firstName,
                lastName: matchRecord.lastName,
                phone: matchRecord.phone,
                terminal: matchRecord.terminal,
                matchId: matchRecord.matchId
              };
              waiting = false;

              // Stop watching
              unwatch();
            } else if (event.event === "child_added" && event.key !== myId) {
              var newRecord = $scope.users.$getRecord(event.key);
              var terminal = newRecord.terminal;

              //found a match
              if (terminal === $scope.terminal && newRecord.matchId === "") {

                //change the newRecord match 
                newRecord.matchId = myId;

                //change my own match
                myRecord.matchId = newRecord.$id;

                $scope.match = {
                  firstName: newRecord.firstName,
                  lastName: newRecord.lastName,
                  phone: newRecord.phone,
                  terminal: newRecord.terminal,
                  matchId: newRecord.matchId
                };

                $scope.users.$save(newRecord);
                $scope.users.$save(myRecord);
                waiting = false;

                // Stop watching
                unwatch();
              }
            }
          });
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
	
    }
  ]);

// , supersonic