angular
  .module('users')
  .controller("NewController", function ($scope, Users, supersonic) {
    $scope.users = {};

    $scope.submitForm = function () {
      $scope.showSpinner = true;
      newusers = new Users($scope.users);
      newusers.save().then( function () {
        supersonic.ui.modal.hide();
      });
    };

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });