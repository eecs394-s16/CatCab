angular
  .module('users')
  .controller("IndexController", ["$scope", "$firebaseArray",
    function ($scope, $firebaseArray) {
    //create connection with the db
    var ref = new Firebase("https://catcab.firebaseio.com/");
     // download the data into a local object
    $scope.users = $firebaseArray(ref);
  }]);

  // , supersonic