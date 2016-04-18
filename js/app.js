var doplay = angular.module('dotplay', []);

    // create the controller and inject Angular's $scope
    doplay.controller('mainController', function($scope) {

        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });
