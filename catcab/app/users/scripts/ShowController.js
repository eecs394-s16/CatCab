angular
  .module('users')
  .controller("ShowController", function ($scope, Users, supersonic) {
    $scope.users = null;
    $scope.showSpinner = true;
    $scope.dataId = undefined;

    var _refreshViewData = function () {
      Users.find($scope.dataId).then( function (users) {
        $scope.$apply( function () {
          $scope.users = users;
          $scope.showSpinner = false;
        });
      });
    }

    supersonic.ui.views.current.whenVisible( function () {
      if ( $scope.dataId ) {
        _refreshViewData();
      }
    });

    supersonic.ui.views.current.params.onValue( function (values) {
      $scope.dataId = values.id;
      _refreshViewData();
    });

    $scope.remove = function (id) {
      $scope.showSpinner = true;
      $scope.users.delete().then( function () {
        supersonic.ui.layers.pop();
      });
    }
  });