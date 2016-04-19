angular.module('dotplay')

.controller('MenuCtrl', function($scope, $rootScope, $location, $window) {
  $scope.startGame = function () {
    $location.path('play');
  };

});
