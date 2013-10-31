angular.module('App.Controllers')
.controller('MainCtrl', ['$route', '$routeParams', '$location', '$scope', '$rootScope', '$log', '$window', '$timeout', '$document', 'eventmanager',
  function MainCtrl($route, $routeParams, $location, $scope, $rootScope, $log, $window, $timeout, $document, eventmanager) {
    this.$route         = $route;
    this.$location      = $location;
    this.$routeParams   = $routeParams;
    this.$rootScope     = $rootScope;

    $rootScope.theme = "theme-dark";

    /* prevent unauth users */
    $rootScope.$on('$locationChangeStart', function (event, next, current) {
      /*if ((next.indexOf("/login") <= 0) && ($rootScope.logged === false)) {
        $location.path("/login");
        return;
      }*/
    });

    /* setup event service */
    $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) { eventmanager.$emit('routechangeerror', event, current, previous, rejection); });
    $rootScope.$on('$routeChangeStart', function (event, next, current) { eventmanager.$emit('routechangestart', event, next, current); });
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) { $timeout(Holder.run, 1); eventmanager.$emit('routechangesuccess', event, current, previous); });
    $rootScope.$on('$routeUpdate', function () { eventmanager.$emit('routeupdate', arguments); });

  }]);