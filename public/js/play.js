angular.module('dotplay')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, toastr, $interval, localStorageService, roomService) {

  $scope.backToMenu = function () {
    $location.path('menu');
  };

  $scope.test = function () {
    toastr.info('This is a test message.');
  };

  $scope.setupDots = function (max_collumns, max_rows) {
		var collumn, row;
		var stage = new createjs.Stage("myCanvas");
		for(collumn = 1; collumn < max_collumns + 1; collumn++){
			for(row = 1; row < max_rows + 1; row++) {

				// draw dots
				var circle = new createjs.Shape();
				circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
				circle.x = 25 + (750/max_rows) * row;
				circle.y = 25 + (750/max_collumns) * collumn;
				stage.addChild(circle);

				// draw horiontal lines
				if(collumn > 1) {
					var line = new createjs.Shape();
					line.name = "vertical_line"+row+"x"+(collumn-1);
					line.graphics.beginFill("DeepSkyBlue").drawRect(0,0,10,-(750/max_rows));
					line.x = 20 + (750/max_rows) * row;
					line.y = 25 + (750/max_collumns) * collumn;
					line.alpha = 0.05;
					stage.addChild(line);
					//line.graphics.beginFill("FireBrick").drawRect(0,0,10,-(750/max_rows));
					line.on("click", function(evt) {
						//alert("type: "+evt.type+" target: "+evt.target);
						this.alpha = 1;
						stage.update();
					});
				}
				// draw verticle lines
				if(row > 1) {
					var line = new createjs.Shape();
					line.name = "horiontal_line"+(row-1)+"x"+collumn;
					line.graphics.beginFill("DeepSkyBlue").drawRect(0,0,-(750/max_collumns),10);
					line.x = 25 + (750/max_rows) * row;
					line.y = 20 + (750/max_collumns) * collumn;
					line.alpha = 0.05;
					stage.addChild(line);
					line.on("click", function(evt) {
						this.alpha = 1;
						stage.update();
					});
				}
			}
		}
		stage.update();
	};

  $scope.setupDots(10,10);

  $scope.playerList = roomService.getPlayerList();
  roomService.setPlayerListCallback(function (list) {
    $scope.playerList = list;
    $scope.$apply();
  });

  $scope.roomID = roomService.getRoomID();
  roomService.setRoomIDCallback(function (id) {
    $scope.roomID = id;
  });

  $scope.time = 0;
  roomService.setTimerCallback(function (t) {
    if (t < 0) {
      $scope.time = 0;
    }
    else {
      $scope.time = t;
    }

    if(document.getElementById("bar") !== null) {
      document.getElementById("bar").style.width = ($scope.time) / roomService.getMaxTime() * 100 + "%";
      document.getElementById("bar").innerHTML = ($scope.time) / roomService.getMaxTime() * 100 + "%";
    }
  });

  $scope.startGame = function () {
    $rootScope.socket.emit('startGame', roomService.getRoomID());
  };



});
