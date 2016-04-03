angular
  .module('users')
  .controller("EditController", function ($scope, Users, supersonic) {
    $scope.users = null;
    $scope.showSpinner = true;

    // Fetch an object based on id from the database
    Users.find(steroids.view.params.id).then( function (users) {
      $scope.$apply(function() {
        $scope.users = users;
        $scope.showSpinner = false;
      });
    });

    $scope.submitForm = function() {
      $scope.showSpinner = true;
      $scope.users.save().then( function () {
        supersonic.ui.modal.hide();
      });
    }

    $scope.cancel = function () {
      supersonic.ui.modal.hide();
    }

  });
