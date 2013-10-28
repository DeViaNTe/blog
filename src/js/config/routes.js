angular
  .module('App.Routes', [])
  .config(['$routeProvider', '$locationProvider', '$compileProvider',
    function config($routeProvider, $locationProvider, $compileProvider) {

      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

      $routeProvider.when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      });

      $routeProvider.when('/tuto/:id', {
        templateUrl: 'views/tutorial.html',
        controller: 'TutorialCtrl'
      });

      $routeProvider.otherwise({
        redirectTo: '/home'
      });

    }
  ]).
run(['$location',
  function run($location) {
    $('html').addClass('started');
    setTimeout(function() {
      $('#loading-layer:visible').fadeOut().remove();
      $('#loading:visible').fadeOut().remove();
      $('#forbusiness:visible').fadeOut().remove();
    }, 3000);
  }
]);