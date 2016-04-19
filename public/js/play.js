angular.module('dotplay')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, toastr) {

  $scope.backToMenu = function () {
    $location.path('menu');
  };

  $scope.test = function () {
    toastr.info('This is a test message.');
  };

});
