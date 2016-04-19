angular.module('dotplay')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window) {

  $scope.backToMenu = function () {
    $location.path('menu');
  };

});
