angular
  .module('users')
  .controller("MatchFormController", ["$scope", "$firebaseArray",
    function($scope, $firebaseArray) {
      //create connection with the db, put users into the "users" folder on firebase
      var dest_ref = new Firebase("https://catcab.firebaseio.com/destinations");
      var org_ref = new Firebase("https://catcab.firebaseio.com/origins");
      var loc_ref = new Firebase("https://catcab.firebaseio.com/locations");
      // download the data into a local object
      // $scope.destinations = $firebaseArray(dest_ref);
      // $scope.origins = $firebaseArray(org_ref);
      $scope.locations = $firebaseArray(loc_ref);

      $scope.leaveNowLater = "now";

      // Initialize date/time info
      $scope.departDate = null;
      $scope.departTime = null;
      // This sets datetime to the current date and time
      // This variable stores the combined datetime info we will use for the match
      $scope.datetime = new Date();

      // Get user's info from local storage
      $scope.phone = localStorage.getItem("phoneNumber");
      $scope.firstName = localStorage.getItem("firstName");
      $scope.lastName = localStorage.getItem("lastName");
      $scope.imgSrc = localStorage.getItem("imgSrc");

      // Situate ourselves in the Firebase DB
      var user_ref = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone);
      var user_matches_ref = new Firebase("https://catcab.firebaseio.com/users/"+$scope.phone+"/matches");
      
      //get current location of the user
      var found_location = false;
      $scope.searchText = "";
      supersonic.device.geolocation.getPosition().then( function(position) {

          found_location = true;
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
            $scope.searchText = "Midway";
          }
      }).then(function(){
          //display options or display nothing
          supersonic.logger.log("Hi there, position found");
          if (found_location === true)
          {
              supersonic.logger.log("Search location is "+$scope.searchText);

              supersonic.logger.log("Candidates are"+$scope.locations);

              
              supersonic.logger.log($scope.origins);

              $scope.destinations = $scope.locations;
          }
          else
          {
              $scope.origins = $scope.locations;
              $scope.destinations = $scope.locations;
          }
      });

      $scope.locations.$loaded().then(function(){

          if ($scope.searchText === "")
          {
            $scope.origins = $scope.locations;
          }
          else
          {
              $scope.origins = $scope.locations.filter(function(obj){
                  // var truth = (obj.location === $scope.searchText);
                  return obj.location === $scope.searchText;
              });    
          }
          $scope.destinations = $scope.locations;
      });

      $scope.$watch('leaveNowLater', function(value) {
        
        supersonic.logger.log(value);
        if (value === "now")
        {
          if (found_location === true)
          {
            supersonic.logger.log("Search location is "+$scope.searchText);

            $scope.origins = $scope.locations.filter(function(obj){
                return obj.location === $scope.searchText;
            });
            $scope.destinations = $scope.locations;
          }
          else
          {
              $scope.origins = $scope.locations;
              $scope.destinations = $scope.locations;
          } 
        }
        else
        {
          $scope.origins = $scope.locations;
          $scope.destinations = $scope.locations;
        }

      
      });

      $scope.$watch('origin', function(value) {
          supersonic.logger.log("Value is "+value);
          $scope.destinations = $scope.locations.filter(function(obj){
              if (value === null){ return true; }
              return obj.name != value;
          });
      });

      $scope.findMatch = function(){

       // Leave datetime empty if they are looking for a match now
       if ($scope.leaveNowLater == "now"){
          $scope.datetime = "";
       }

        // Push this trip data to the users/<phoneNumber>/matches array
        trip_data = ({
          destination: $scope.destination,
          origin: $scope.origin,
          time: "" + String($scope.datetime),
          type: $scope.leaveNowLater,
          myMatch: "",
          status: "waiting"
        });

        user_matches_ref.push(trip_data);

        // Fade into the home page once we put in the match
        var view = new supersonic.ui.View("users#home");
        var customAnimation = supersonic.ui.animate("fade");
        supersonic.ui.layers.pop();//push(view, {animation:customAnimation});


    };

    $scope.homeTapped = function(){

          var view = new supersonic.ui.View("users#home");
          var customAnimation = supersonic.ui.animate("flipVerticalFromBottom");
          supersonic.ui.layers.pop(); //push(view, { animation: customAnimation });

    };


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



     //get current location of the user - CURRENTLY UNUSED
      // supersonic.device.geolocation.getPosition().then( function(position) {
      //     var latitude = position.coords.latitude;
      //     var longitude = position.coords.longitude;
      //     //current location is northwestern
      //     if (latitude >= 42.01 && latitude <= 42.08){
      //       $scope.currLocation = "Northwestern";
      //       $scope.searchText = "Northwestern";
      //     }
      //     //current location is O'Hare
      //     if (longitude >= -87.94 && longitude <= -87.87){
      //       $scope.currLocation = "O'Hare";
      //       $scope.searchText = "O'Hare";
      //     }
      //     //current location is Midway
      //     if (latitude >= 41.775 && latitude <= 41.795){
      //       $scope.currLocation = "Midway";
      //       $scope.currLocation = "Midway";
      //     }




      // });


      
    }

  ]);

// , supersonic