var myId;
var matched = false;
var waiting = false;

angular
  .module('users')
  .controller("IndexController", ["$scope", "$firebaseArray",
    function ($scope, $firebaseArray) {
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
        matchId: "no one"
      }).then(function(ref) {
      myId = ref.key();
      supersonic.logger.log("My key is "+myId);

      $scope.users.$watch(function(event) {
        supersonic.logger.log(event);
        if (matched){
          return;
        }
        var myRecord = $scope.users.$getRecord(myId);

        if (event.event==="child_changed" && event.key===myId)
        {
          //someone matched with us
          var matchRecord = $scope.users.$getRecord(myRecord.matchId)
          $scope.match = {
            firstName: matchRecord.firstName,
            lastName: matchRecord.lastName,
            phone: matchRecord.phone,
            terminal: matchRecord.terminal,
            matchId: matchRecord.matchId
          };
          matched = true;
          waiting = false;
        }
        else if(event.event==="child_added" && event.key!==myId){
          var newRecord = $scope.users.$getRecord(event.key);
          var terminal = newRecord.terminal;
          if (terminal === $scope.terminal && (newRecord.matchId==="no one"))
          {
            //found a match

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
            matched = true;
            waiting = false;
          }
        }
      });
    });

  };

  }]);

  // , supersonic