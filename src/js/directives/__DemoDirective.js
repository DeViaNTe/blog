angular.module('App.Directives')
.directive('ngDemoDirective', ['$timeout',
    function($timeout) {
      return {
        restrict: 'A',      //attribute
        template: '',       //template replacement markup
        replace: true,      //replace original markup with template
        transclude: false,  // do not copy original markup
        require: '^ngModel',  //require binding ng-model="..."
        scope: {
          name: "@",        // pass by value (string one-way)
          ammount: "=",     // pass by reference (two-way)
          save: "&"         // event binding
        },
        controller: ['$scope', function($scope) { }], //controller
        compile: function(tElement, tAttrs, transclude) {
          return {
            pre: function preLink(scope, $element, $attributes, controller) {
              console.log("pre-linking");
              // do hard work, no element modifications
              // only event bindings
            },
            post: function postLink(scope, $element, $attributes, controller) {
              console.log("post-linking");
              // do element modifications
              // light bindings
            }
          };
        }
      }
    }
  ])