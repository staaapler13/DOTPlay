angular.module('dotplay', ['ui.bootstrap','ngRoute', 'ngAnimate', 'picardy.fontawesome', 'toastr', 'LocalStorageModule'])

.config(function($routeProvider, localStorageServiceProvider) {
  $routeProvider

  .when('/app', {
    templateUrl: 'public/menu.html'
  })

  .otherwise({
    redirectTo: '/app'
  });

  localStorageServiceProvider.setPrefix('dotplay');
})

.run(function() {

});
