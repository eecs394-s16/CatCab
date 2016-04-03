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
    $scope.users.$add({
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      phone: $scope.phone,
      terminal: $scope.terminal
    });
  };

  }]);

  // , supersonic