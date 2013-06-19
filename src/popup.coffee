# Fix the width of the search form
$(document).ready ->
  formWidth = $('#search-form').width()
  $('#search-bar').width (formWidth - 92) + 'px'

# Define the module
app = angular.module 'MLFW', []

# Enable CORS
app.config ['$httpProvider', ($httpProvider) ->
  $httpProvider.defaults.useXDomain = true
  delete $httpProvider.defaults.headers.common['X-Requested-With']
]

# Define the controller for the view
app.controller 'MlfwController', ($scope, $http) ->

  apiRoot = 'http://mylittlefacewhen.com/api'

  $scope.getFaces = () ->
    tags = $scope.query
    $http.get(apiRoot + "/api/v3/face",
      params:
        tags__any: tags
    ).success((json, status, headers, config) ->
      $scope.faces = json.objects
      $scope.noResults = json.objects.length == 0
    ).error (data, status, headers, config) ->
      console.log data
      # Display an error message to the user here