angular
  .module('users')
  .controller("ShowController", ($scope, Users, supersonic) ->
    $scope.users = null
    $scope.showSpinner = true
    $scope.dataId = undefined

    _refreshViewData = ->
      Users.find($scope.dataId).then (users) ->
        $scope.$apply ->
          $scope.users = users
          $scope.showSpinner = false

    supersonic.ui.views.current.whenVisible ->
      _refreshViewData() if $scope.dataId

    supersonic.ui.views.current.params.onValue (values) ->
      $scope.dataId = values.id
      _refreshViewData()

    $scope.remove = (id) ->
      $scope.showSpinner = true
      $scope.users.delete().then ->
        supersonic.ui.layers.pop()
  )
