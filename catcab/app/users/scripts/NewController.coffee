angular
  .module('users')
  .controller("NewController", ($scope, Users, supersonic) ->
    $scope.users = {}

    $scope.submitForm = ->
      $scope.showSpinner = true
      newusers = new Users($scope.users)
      newusers.save().then ->
        supersonic.ui.modal.hide()

    $scope.cancel = ->
      supersonic.ui.modal.hide()
  )
