angular.module('dotplay')

.controller('MenuCtrl', function($scope, $rootScope, $location, $window) {
   var socket = io();
  $scope.startGame = function () {
    $location.path('play');
  };

  $scope.test = function () {
    socket.emit('test');
  };

  socket.on('hello client', function(){
    console.log('hello!');
  });

});
