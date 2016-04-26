angular.module('dotplay')

.controller('PlayCtrl', function($scope, $rootScope, $location, $window, toastr) {

  $scope.backToMenu = function () {
    $location.path('menu');
  };

  $scope.test = function () {
    toastr.info('This is a test message.');
  };

  $scope.setupDots = function (max_rows, max_collumns) {
		var collumn, row;
		var stage = new createjs.Stage("myCanvas");
		for(collumn = 1; collumn < max_collumns + 1; collumn++){
			for(row = 1; row < max_rows + 1; row++) {
				var circle = new createjs.Shape();
				circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 10);
				circle.x = 100 * row;
				circle.y = 100 * collumn;
				stage.addChild(circle);
				stage.update();
			}
		}
	};
  
  $scope.setupDots(5,5);
  
});


//scope.setupDots(5,5);