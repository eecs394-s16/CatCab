angular
  .module('users')
  .controller("IndexController", ["$scope", "$firebaseArray",
    function ($scope, $firebaseArray, supersonic) {

    var ref = new Firebase("https://catcab.firebaseio.com/");
    $scope.users = $firebaseArray(ref);
  }]);