$(document).ready(function() {
	var formWidth = $('#search-form').width();
	$('#search-bar').width((formWidth - 92) + 'px');
});

app = angular.module('MLFW', ['akoenig.deckgrid']);

app.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

app.controller('MlfwController', ['$scope', '$http', function($scope, $http) {
	$scope.getFaces = function getFaces() {
		console.log('Getting faces - ' + $scope.query);
		var tags = $scope.query;
		$http.get('http://mylittlefacewhen.com/api/v3/face', {
			params: {
				tags__any: tags
			}
		}).success(function(json, status, headers, config) {
			console.log(json);
			$scope.faces = json.objects;
			$scope.noResults = json.objects.length == 0;
		}).error(function(data, status, headers, config) {
			var err = "Failed - " + status + ' ' + headers;
			console.log(err);
		});
	};
}]);