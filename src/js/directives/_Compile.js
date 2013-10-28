angular.module('App.Directives')
  .directive('ngCompile', function($compile) {
    return {
      restrict: 'A',
      replace: true,
      scope: false,
      controller: '',
      compile: function(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, $element, $attributes, controller) {
            scope.$watch(
              function (scope) {
                return scope.$eval( $attributes.ngCompile );
              },
              function (value) {
                $element.html(value);
                $compile($element.contents())(scope);
              }
            );
          }
        };
      }
    }
  });