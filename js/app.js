'use strict';

angular.module('dotplay', [
    'ngRoute',
    'dotplay.menu'           // Newly added home module
]).
config(['$routeProvider', function($routeProvider) {
    // Set defualt view of our app to home

    $routeProvider.otherwise({
        redirectTo: '/menu'
    });
}]);
