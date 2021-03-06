angular.module('dotplay')

.factory('serverInterfaceService', function () {
  return {
    init: function ($scope, $rootScope, $timeout, $interval, $location, toastr, localStorageService, roomService) {
      $scope.connectionStatus = {
        color: 'yellow'
      };


      $rootScope.socket = io();

      $rootScope.socket.on('connect', function () {
        console.log('Connected to server');

        // Must be wrapped in a timeout to update in the next digest
        $timeout(function () {
          $scope.connectionStatus = {
            color: 'green'
          };
        });

        $rootScope.socket.on('taunted', function () {
          if($rootScope.isArtist){
            toastr.info('You taunted your opponent.');
          }
          else{
            toastr.info('Your opponent thinks you are very bad at this game.');
          }
        });

        $rootScope.socket.on('praised', function () {
          if($rootScope.isArtist){
            toastr.info('You praised your opponent.');
          }
          else{
            toastr.info('Your opponent thinks you made a great move.');
          }
        });

        $rootScope.socket.on('playersInsufficient', function () {
          console.log('Need 2 players to start.');
          toastr.warning('Need 2 players to start.');
        });

        $rootScope.socket.on('roomCreated', function (roomID) {
          console.log('New room created. ID: ' + roomID);
          roomService.setRoomID(roomID);

          $rootScope.socket.emit('joinRoom', roomID, localStorageService.get('username'));
        });

        $rootScope.socket.on('roomJoined', function (success, msg) {
          if (success) {
            $rootScope.$apply(function () {
              $location.path('play');
            });
          }
          else {
            console.log('Failed to join. ' + msg);
            toastr.error(msg, 'Hmm... That didn\'t work');
          }
        });

        $rootScope.socket.on('updatePlayerList', function (list) {
          roomService.setPlayerList(list);
        });

        $rootScope.socket.on('gameStarted', function (time) {
          console.log('Game started!');

          $rootScope.gameStarted = true;
          roomService.newTimer(time);
        });

        $rootScope.socket.on('artistSelected', function (name) {
          $rootScope.isArtist = false;
          $rootScope.artistName = name;
          if (name == localStorageService.get('username')) {
            console.log('I\'m the artist!');
            $rootScope.isArtist = true;

            toastr.info('Your move', 'Your turn');
          }
          else {
            toastr.info(name + ' is thinking now');
          }

        });
      });

      $rootScope.socket.on('minusTimer',function(){
          roomService.minusTimer(5);

          if ($rootScope.isArtist) {
            toastr.warning('You skipped the word!', '-5 seconds!');
          }
          else {
            toastr.warning('The artist skipped the word');
          }
      });

      $rootScope.socket.on('connect_error', function(err) {
        console.log('error');
        $timeout(function () {
          $scope.connectionStatus = {
            color: 'red'
          };
        });
      });
    }
  };
});
