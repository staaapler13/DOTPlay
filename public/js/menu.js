angular.module('dotplay.menu', ['ngRoute'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/menu', {
        templateUrl: 'menu.html',
        controller: 'MenuCtrl'
    });
}])

// Home controller
.controller('MenuCtrl', [function() {

}]);
