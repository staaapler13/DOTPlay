angular.module('dotplay')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, toastr, $interval, localStorageService, roomService) {

  var stage = new createjs.Stage("myCanvas");
  var last_clicked;

  $scope.backToMenu = function () {
    $rootScope.socket.emit('leaveRoom', roomService.getRoomID(), $scope.username);
    roomService.cleanup();
    $location.path('menu');
  };

  $scope.addPoint = function () {
  $rootScope.socket.emit('add');
  };

  $scope.confirmMove = function () {
	$scope.check_points();
    $rootScope.socket.emit('confirm');
  };

  $scope.taunt = function () {
    $rootScope.socket.emit('taunt',roomService.getRoomID());
  };

  $scope.praise = function () {
    $rootScope.socket.emit('praise',roomService.getRoomID());
  };

  $scope.setupDots = function (max_collumns, max_rows) {
		var collumn, row;

		for(collumn = 1; collumn < max_collumns + 1; collumn++){
			for(row = 1; row < max_rows + 1; row++) {

				// draw dots
				var circle = new createjs.Shape();
				circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
				circle.x = 25 + (750/max_rows) * row;
				circle.y = 25 + (750/max_collumns) * collumn;
				stage.addChild(circle);

				// draw horizontal lines
				if(collumn > 1) {
					var line = new createjs.Shape();
					line.name = "vertical_linex"+row+"x"+(collumn-1);
					line.graphics.beginFill("DeepSkyBlue").drawRect(0,0,10,-(750/max_rows));
					line.x = 20 + (750/max_rows) * row;
					line.y = 25 + (750/max_collumns) * collumn;
					line.alpha = 0.05;

          line.isclicked = 0;

					stage.addChild(line);
					//line.graphics.beginFill("FireBrick").drawRect(0,0,10,-(750/max_rows));
					line.on("click", function(evt) {
						//alert("type: "+evt.type+" target: "+evt.target);
						//this.alpha = 1;
						//stage.update();
            if($rootScope.isArtist){
              $rootScope.socket.emit('click', roomService.getRoomID(), this.name);
            }
					});
				}
				// draw verticle lines
				if(row > 1) {
					var line = new createjs.Shape();
					line.name = "horizontal_linex"+(row-1)+"x"+collumn;
					line.graphics.beginFill("DeepSkyBlue").drawRect(0,0,-(750/max_collumns),10);
					line.x = 25 + (750/max_rows) * row;
					line.y = 20 + (750/max_collumns) * collumn;
					line.alpha = 0.05;

          line.isclicked = 0;

					stage.addChild(line);
					line.on("click", function(evt) {
						//this.alpha = 1;
						//stage.update();
            if($rootScope.isArtist){
              $rootScope.socket.emit('click', roomService.getRoomID(), this.name);
            }
					});


				}
			}
		}
		stage.update();
	};

  $scope.setupDots(10,10);

  $rootScope.socket.on('clicked',function(name){
    var clickedline = stage.getChildByName(name);
    if(clickedline.isclicked == 0){
		if(last_clicked) {
			last_clicked.isclicked = 0;
			last_clicked.alpha = 0.05;
		}
      clickedline.alpha = 1;
      clickedline.isclicked = 1;
	  last_clicked = clickedline;
    }
    else if (clickedline.isclicked == 1){
      clickedline.alpha = 0.05;
      clickedline.isclicked = 0;
    }
    stage.update();
    console.log(name + " " + clickedline.isclicked);
  });

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

  $scope.check_points = function () {
		if(last_clicked) {
	  
			var line_name = last_clicked.name;
			
			// check if line is horizontal, otherwise, assume it is vertical;
			if(!line_name.indexOf("horizontal_line")) {
				var coordinates = line_name.split("x");
				var x = parseInt(coordinates[1]);
				var y = parseInt(coordinates[2]);
				var up, down, left, right;
				// check upper box
				if(x) {
					up = stage.getChildByName("horizontal_linex"+x+"x"+(y-1));
					left = stage.getChildByName("vertical_linex"+x+"x"+(y-1));
					right = stage.getChildByName("vertical_linex"+(x+1)+"x"+(y-1));
					if(up.isclicked && left.isclicked && right.isclicked) {
						$scope.addPoint();
					}
				}
				// check lower box
				if(x < 9) {
					down = stage.getChildByName("horizontal_linex"+x+"x"+(y+1));
					left = stage.getChildByName("vertical_linex"+x+"x"+y);
					right = stage.getChildByName("vertical_linex"+(x+1)+"x"+y);
					if(down.isclicked && left.isclicked && right.isclicked) {
						$scope.addPoint();
					}
				}
			} 
			else {
				var coordinates = line_name.split("x");
				var x = parseInt(coordinates[1]);
				var y = parseInt(coordinates[2]);
				var up, down, left, right;
				// check left box
				if(y) {
					up = stage.getChildByName("horizontal_linex"+(x-1)+"x"+y);
					left = stage.getChildByName("vertical_linex"+(x-1)+"x"+y);
					down = stage.getChildByName("horizontal_linex"+(x-1)+"x"+(y+1));
					if(up.isclicked && left.isclicked && down.isclicked) {
						$scope.addPoint();
					}
				}
				// check right box
				if(y < 9) {
					down = stage.getChildByName("horizontal_linex"+x+"x"+(y+1));
					up = stage.getChildByName("horizontal_linex"+x+"x"+y);
					right = stage.getChildByName("vertical_linex"+(x+1)+"x"+y);
					if(down.isclicked && up.isclicked && right.isclicked) {
						$scope.addPoint();
					}
				}
			}
			last_clicked = 0;
		}
  };

  
   $rootScope.socket.on('clear_last_clicked',function(){
    last_clicked = 0;
	console.log("resting last_clicked")
  });

});
