angular
  .module('users')
  .controller("IndexController", ($scope, Users, supersonic) ->
    $scope.userss = null
    $scope.showSpinner = true

    Users.all().whenChanged (userss) ->
      $scope.$apply ->
        $scope.userss = userss
        $scope.showSpinner = false
  )