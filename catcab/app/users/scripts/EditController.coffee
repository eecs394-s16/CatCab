angular
  .module('users')
  .controller("EditController", ($scope, Users, supersonic) ->
    $scope.users = null
    $scope.showSpinner = true

    supersonic.ui.views.current.params.onValue (values) ->
      Users.find(values.id).then (users) ->
        $scope.$apply ->
          $scope.users = users
          $scope.showSpinner = false

    $scope.submitForm = ->
      $scope.showSpinner = true
      $scope.users.save().then ->
        supersonic.ui.modal.hide()

    $scope.cancel = ->
      supersonic.ui.modal.hide()
  )
