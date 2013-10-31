angular.module('App.Directives')
  .directive('ngAce', [
    function() {
      return {
        restrict: 'A',
        replace: true,
        scope: false,
        controller: '',
        compile: function(tElement, tAttrs, transclude) {
          return {
            post: function postLink(scope, $element, $attributes, controller) {
              var obj = scope.$eval($attributes.ngAce);
              console.log(obj);
              var editorId = obj.file.replace(/[^a-z0-9]/ig, "_");
              var oldEditor = angular.element('#' + editorId);
              var editor;
              if (oldEditor.length > 0) {
                editor = ace.edit(oldEditor[0]);
              } else {
                editor = ace.edit($element[0]);
                $element[0].id = editorId;
              }

              editor.getSession().setMode("ace/mode/" + obj.lang);
              editor.setTheme("ace/theme/chrome");
              editor.setReadOnly(false);
              editor.setValue(obj.contents);

              editor.getSession().selection.clearSelection();
              editor.gotoLine(1);
              scope.editor = editor;

              var Emmet = ace.require("ace/ext/emmet");
              editor.setOption("enableEmmet", true);
              editor.setBehavioursEnabled(true);

              $element[0].style.fontSize = '14px';
              $element[0].style.height = "200px";
            }
          };
        }
      }
    }
  ])
  .directive('ngAceCommand', ['$timeout',
    function($timeout) {
      return {
        restrict: 'A',
        replace: true,
        scope: false,
        controller: '',
        compile: function(tElement, tAttrs, transclude) {
          return {
            post: function postLink(scope, $element, $attributes, controller) {
              var obj = scope.$eval($attributes.ngAceCommand);
              var editorId = obj.props.name.replace(/[^a-z0-9]/ig, "_");
              var oldEditor = angular.element('#' + editorId);
              var editor;

              console.log("compile post link");
              console.log(obj);

              if (oldEditor.length > 0) {
                editor = ace.edit(oldEditor[0]);
              } else {
                editor = ace.edit($element[0]);
              }

              $timeout(function() {
                switch (obj.props.command) {
                  case "insert":
                    for (var i = 0; i <= obj.props.opts.length; i++) {
                      (function(i) {
                        $timeout(function() {
                          editor.insert(obj.props.opts[i]);
                        }, i * 200);
                      }(i));
                    }
                    break;
                  default:
                    break;
                }
              }, obj._delay);

            }
          };
        }
      }
    }
  ]);