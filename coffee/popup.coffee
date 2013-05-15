$(document).ready ->
  formWidth = $('#search-form').width()
  $('#search-bar').width (formWidth - 92) + 'px'

app = angular.module 'MLFW', []
app.config ['$httpProvider', ($httpProvider) ->
  $httpProvider.defaults.useXDomain = true
  delete $httpProvider.defaults.headers.common['X-Requested-With']
]
app.controller 'MlfwController', ($scope, $http) ->

  $scope.getFaces = () ->
    console.log 'Getting faces -', $scope.query
    tags = $scope.query
    $http.get("http://mylittlefacewhen.com/api/v3/face",
      params:
        tags__any: tags
    ).success((json, status, headers, config) ->
      console.log json
      $scope.faces = json.objects
      $scope.noResults = json.objects.length >= 1
    ).error (data, status, headers, config) ->
      err = "Failed " + status + " " + headers
      console.log err