angular.module('App.Directives')
  .directive('ngParallax', ['$document',
    function($document) {
      return {
        restrict: 'A',
        transclude: false,
        scope: {},
        controller: '',
        compile: function(tElement, tAttrs, transclude) {
          return {
            post: function postLink(scope, $element, $attributes, controller) {
              var factors = scope.$eval($attributes.ngParallax);
              var scrollerElement = $('.mainview')[0];
              var binding = function(){
                var topIncrement = Math.ceil( factors.top * scrollerElement.scrollTop );
                var leftIncrement = Math.ceil( factors.left * scrollerElement.scrollTop );
                if (factors.right) {
                  $element.css('margin-right', (leftIncrement)+"px");
                } else {
                  $element.css('margin-left', (leftIncrement)+"px");
                }
                if (factors.bottom) {
                  $element.css('margin-bottom', (topIncrement)+"px");
                } else {
                  $element.css('margin-top', (topIncrement)+"px");
                }
              };
              // attach and remove event on clean-up
              $(scrollerElement).bind('scroll',binding);
              scope.$on("$destroy", function() { $(scrollerElement).unbind('scroll', binding); });
            }
          };
        }
      }
    }
  ])