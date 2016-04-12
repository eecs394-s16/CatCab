var myId;
var waiting = false;

angular
  .module('users')
  .controller("IndexController", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray) {
      //create connection with the db, put users into the "users" folder on firebase
      var ref = new Firebase("https://catcab.firebaseio.com/users");
      var dest_ref = new Firebase("https://catcab.firebaseio.com/destinations");
      var org_ref = new Firebase("https://catcab.firebaseio.com/origins");
      // download the data into a local object
      $scope.destinations = $firebaseArray(dest_ref);
      $scope.origins = $firebaseArray(org_ref);
      $scope.users = $firebaseArray(ref);
      $scope.matchStatus = false;
      $scope.match = null;
      $scope.waiting = false;
      $scope.showUsers = false;
      $scope.imgData = null;

      // add a new user to the database when a new person fills out the form 
      $scope.addUser = function() {
        waiting = true;
        $scope.users.$add({
          firstName: $scope.firstName,
          lastName: $scope.lastName,
          phone: $scope.phone,
          terminal: $scope.terminal,
          destination: $scope.destination,
          matchId: "",
          imgSrc: $scope.imgSrc,
          timeStamp: Firebase.ServerValue.TIMESTAMP
        }).then(function(ref) {
          // $scope.firstName = "";
          // $scope.lastName = "";
          // $scope.phone = "";
          // $scope.terminal = "";
          // $scope.imgSrc = null;
          // Save current user's key
          myId = ref.key();
          supersonic.logger.log("My key is " + myId);

          var unwatch = $scope.users.$watch(function(event) {
            supersonic.logger.log(event);

            var myRecord = $scope.users.$getRecord(myId);
            // Someone matched with us
            if (event.event === "child_changed" && event.key === myId) {
              matchRecord = $scope.users.$getRecord(myRecord.matchId);
              $scope.match = {
                firstName: matchRecord.firstName,
                lastName: matchRecord.lastName,
                phone: matchRecord.phone,
                terminal: matchRecord.terminal,
                destination: matchRecord.destination,
                matchId: matchRecord.matchId,
                imgSrc: matchRecord.imgSrc
              };
              waiting = false;
              $scope.matchStatus = true;
              $scope.match = matchRecord;

              // Stop watching
              unwatch();
            } else if (event.event === "child_added" && event.key !== myId) {
              var newRecord = $scope.users.$getRecord(event.key);
              var terminal = newRecord.terminal;

              //found a match
              if (terminal === $scope.terminal && newRecord.matchId === "" &&
                newRecord.destination === $scope.destination) {

                //change the newRecord match 
                newRecord.matchId = myId;

                //change my own match
                myRecord.matchId = newRecord.$id;

                $scope.match = {
                  firstName: newRecord.firstName,
                  lastName: newRecord.lastName,
                  phone: newRecord.phone,
                  terminal: newRecord.terminal,
                  destination: newRecord.destination,
                  matchId: newRecord.matchId
                };

                $scope.users.$save(newRecord);
                $scope.users.$save(myRecord);
                waiting = false;
                $scope.matchStatus = true;
                $scope.match = matchRecord;
                // Stop watching
                unwatch();
              }
            }
          });
        });
        $scope.waiting = true;
      };

      // PHOTO UPLOADING/DISPLAYING CODE
      // Will go into the image tag once user uploades a photo
      $scope.imgSrc = null;

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

      $scope.showTravelers = function() {
        $scope.showUsers = !$scope.showUsers;
      };

    }
  ]);

// , supersonic