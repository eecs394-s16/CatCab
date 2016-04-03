angular
  .module('users')
  .controller("IndexController", function ($scope, Users, supersonic) {
    $scope.userss = null;
    $scope.showSpinner = true;

    Users.all().whenChanged( function (userss) {
        $scope.$apply( function () {
          $scope.userss = userss;
          $scope.showSpinner = false;
        });
    });
  });