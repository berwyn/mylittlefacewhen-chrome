$(document).ready(function() {
	var formWidth = $('#search-form').width();
	$('#search-bar').width((formWidth - 92) + 'px');
});

app = angular.module('MLFW', ['akoenig.deckgrid']);

var config = function config($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
}

angular
	.module('MLFW')
	.config(config);

var FaceService = function FaceService($http, $q) {
	var FaceServiceHost = {};
	FaceServiceHost.getFaces = function getFaces(tags) {
		var deferred = $q.defer();
		$http
			.get('http://mylittlefacewhen.com/api/v3/face', {
				params: {
					tags__any: tags
				}
			})
			.success(function(json, status, headers, config) {
				deferred.resolve(json.objects);
			})
			.error(function(data, status, headers, conifg) {
				deferred.reject(data);
			});
			return deferred.promise;
	};
	return FaceServiceHost;
};

angular
	.module('MLFW')
	.service('FaceService', FaceService);

var MLFWCtrl = function MLFWCtrl(FaceService) {
	var vm = this;

	vm.getFaces = function getFaces() {
		console.log('Getting faces - ' + vm.query);
		var tags = vm.query;
		FaceService
			.getFaces(tags)
			.then(function(faces) {
				vm.faces = faces;
			});
	};
};

angular
	.module('MLFW')
	.controller('MLFWCtrl', MLFWCtrl);