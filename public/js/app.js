
angular.module('dotplay', ['ui.bootstrap','ngRoute', 'ngAnimate', 'picardy.fontawesome', 'toastr', 'LocalStorageModule'])

.config(function($routeProvider) {
  $routeProvider

  .when('/menu', {
    templateUrl: 'menu.html',
    controller: 'MenuCtrl'
  })

  .when('/play', {
    cache: false, // Means controller will fire each time app enters /play
    templateUrl: 'play.html',
    controller: 'PlayCtrl'
  })


  .otherwise({
    redirectTo: '/menu'
  });

})

.run(function() {

});
