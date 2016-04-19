angular
  .module('users')
  .controller("MatchFormController", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray) {
      //create connection with the db, put users into the "users" folder on firebase
      var ref = new Firebase("https://catcab.firebaseio.com/users");
      var dest_ref = new Firebase("https://catcab.firebaseio.com/destinations");
      var org_ref = new Firebase("https://catcab.firebaseio.com/origins");
      var loc_ref = new Firebase("https://catcab.firebaseio.com/locations");
      // download the data into a local object
      $scope.destinations = $firebaseArray(dest_ref);
      $scope.origins = $firebaseArray(org_ref);
      $scope.locations = $firebaseArray(loc_ref);
      $scope.users = $firebaseArray(ref);
      $scope.matchStatus = false;
      $scope.match = null;
      $scope.waiting = false;
      $scope.showUsers = false;
      $scope.imgData = null;
      $scope.matched_previously = false;


      $scope.leaveNowLater = "now";

      // Initialize date/time info
      $scope.departDate = null;
      $scope.departTime = null;
      // This sets datetime to the current date and time
      // This variable stores the combined datetime info we will use for the match
      $scope.datetime = new Date();


      // This combines the selected date and selected time into a single datetime object
    $scope.combineDateWithTime = function()
    {
      d = $scope.departDate;
      t = $scope.departTime;
      // Take the date data from departDate and time data from departTime
      $scope.datetime = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        t.getHours(),
        t.getMinutes(),
        t.getSeconds(),
        t.getMilliseconds()
        );
    }


      // add a new user to the database when a new person fills out the form 

     //get current location of the user
      supersonic.device.geolocation.getPosition().then( function(position) {
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          //current location is northwestern
          if (latitude >= 42.01 && latitude <= 42.08){
            $scope.currLocation = "Northwestern";
            $scope.searchText = "Northwestern";
          }
          //current location is O'Hare
          if (longitude >= -87.94 && longitude <= -87.87){
            $scope.currLocation = "O'Hare";
            $scope.searchText = "O'Hare";
          }
          //current location is Midway
          if (latitude >= 41.775 && latitude <= 41.795){
            $scope.currLocation = "Midway";
            $scope.currLocation = "Midway";
          }




      });


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
          myId = ref.key();
          supersonic.logger.log("My key is " + myId);

          var unwatch = $scope.users.$watch(function(event) {
            supersonic.logger.log(event);
            supersonic.logger.log("I am "+myId+" and my match is "+myMatchId);

            var myRecord = $scope.users.$getRecord(myId);
            // Someone matched with us
            if (event.event === "child_changed" && event.key === myId) {
              matchRecord = $scope.users.$getRecord(myRecord.matchId);
              supersonic.logger.log("Child Changed, matchRecord is "+matchRecord.firstName);
              $scope.match = {
                firstName: matchRecord.firstName,
                lastName: matchRecord.lastName,
                phone: matchRecord.phone,
                terminal: matchRecord.terminal,
                destination: matchRecord.destination,
                matchId: matchRecord.matchId,
                imgSrc: matchRecord.imgSrc
              };
              myMatchId = myRecord.matchId;
              $scope.matched_previously = true;
              if (matchRecord){
                waiting = false;
                $scope.matchStatus = true;
                $scope.match = matchRecord;
              }
              else{
                waiting = true;
                $scope.matchStatus = false;
                $scope.match = matchRecord;
              }

              // Stop watching
              // unwatch();
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
                myMatchId = myRecord.matchId;

                $scope.match = {
                  firstName: newRecord.firstName,
                  lastName: newRecord.lastName,
                  phone: newRecord.phone,
                  terminal: newRecord.terminal,
                  destination: newRecord.destination,
                  matchId: newRecord.matchId
                };
                $scope.matched_previously = true;

                $scope.users.$save(newRecord);
                $scope.users.$save(myRecord);
                waiting = false;
                $scope.matchStatus = true;
                $scope.match = matchRecord;
                // Stop watching
                // unwatch();
              }
            }
            else if (event.event === "child_removed" && event.key === myMatchId){

              supersonic.logger.log("You killed my child!");
              waiting = true;
              $scope.matchStatus = false;

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

      $scope.cancel = function() {
        //cancels the request

        var myRecordRef = new Firebase("https://catcab.firebaseio.com/users/"+myId);
        var myRecord = $scope.users.$getRecord(myId);
        supersonic.logger.log("My matched id is "+myRecord.matchId);

        if ($scope.waiting && !$scope.matchStatus)
        {
          supersonic.logger.log("Cancel a waiting request");
          // done
        }

        if ($scope.matchStatus)
        {
          supersonic.logger.log("Cancel a matched request");
          // deal with the match id of the other person
          
          var matchedRecord = $scope.users.$getRecord(myRecord.matchId);
          matchedRecord.matchId = "";
          $scope.users.$save(matchedRecord);

        }
        supersonic.logger.log("My ID (to be removed) is "+myId);

        myRecordRef.remove();
        // take out of the database

        // set not matched previously 
        supersonic.logger.log("1- Matched_previously is: "+$scope.matched_previously);
        $scope.matched_previously = false;
        supersonic.logger.log("2- Matched_previously is: "+$scope.matched_previously);


        // go back to the home page
        $scope.matchStatus = false;
        $scope.waiting = false;

      }

    }

  ]);

// , supersonic