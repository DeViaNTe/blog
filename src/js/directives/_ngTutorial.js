angular.module('App.Directives')
  .directive('ngTutorial', ['$timeout', '$sanitize',
    function($timeout, $sanitize) {
      return {
        restrict: 'A',
        transclude: false,
        scope: {},
        controller: ['$scope', '$rootScope', 'eventmanager', '$timeout',
          function($scope, $rootScope, eventmanager, $timeout) {

            var done = function() {
              eventmanager.$emit('tutorialenginecb');
              if (!($scope.$$phase) && !($rootScope.$$phase)) {
                $rootScope.$digest();
              }
            };

            var lib = {
              element_create: function(name, content) {
                var $el = $($sanitize(content));
                $scope.elements[name] = $el;
                return done();
              },
              element_set_html: function (name, content) {
                var $el = $scope.elements[name];
                $el.html($sanitize(content));
                return done();
              },
              element_hide: function (name) {
                var $el = $scope.elements[name];
                $el.hide();
                return done();
              },
              element_fadein: function (name, delay) {
                var $el = $scope.elements[name];
                $el.fadeIn(delay || 1000, function() { done(); });
                return null;
              },
              element_slidedown: function (name, delay) {
                var $el = $scope.elements[name];
                $el.slideDown(delay || 1000, function() { done(); });
                return null;
              },
              element_add_html: function (name, content) {
                var $el = $scope.elements[name];
                $el.html($el.html() + content);
                return done();
              },
              element_append: function (from, to) {
                var $el = $scope.elements[from];
                var $child = $scope.elements[to];
                $child.appendTo($el);
                return done();
              },
              element_css: function (name, property, value) {
                var $el = $scope.elements[name];
                $el.css(property, value);
                return done();
              },
              element_write: function (name, text, delay, stop) {
                var $el = $scope.elements[name];
                var delay = delay || 60;
                var stop = stop || 1;
                for (var i=0;i<text.length;i++) {
                  (function (i) { $timeout(function() { $el.html($el.html() +text[i]); }, i*delay); }(i));
                }
                $timeout(done, (text.length * delay) + stop );
                return null;
              },

              wait: function(delay) {
                $timeout(done, delay);
              },

              editor_attach: function (name) {
                var $el = $scope.elements[name];
                var id = $el.attr('id');
                if (typeof id !== "string") {
                  id = 'ace_editor_'+name;
                  $el.attr('id', id);
                }
                $scope.editors[name] = ace.edit(id);
                $scope.editors[name].setReadOnly(true);
                $scope.editors[name].setBehavioursEnabled(false);
                $scope.editors[name].setAnimatedScroll(true);
                $scope.editorMarkers[name] = {};

                window.editor = $scope.editors[name];

                if ($rootScope.theme === "theme-light") { $scope.editors[name].setTheme('ace/theme/chrome'); }
                if ($rootScope.theme === "theme-dark") { $scope.editors[name].setTheme('ace/theme/monokai'); }

                var $cover = $('<div>');
                $cover.css({position:'absolute', top: 0, left: 0, right: 0, bottom: 0, 'z-index': 200});
                $cover.on('click, mousedown, touchstart', function(event) { event.preventDefault(); return false; });
                $el.append($cover);
                return done();
              },
              editor_session: function (editorName, command) {
                var editor = $scope.editors[editorName];
                var session = editor.getSession();
                var args = Array.prototype.slice.call(arguments);
                args.splice(0,2);
                session[command].apply(session, args);
                return done();
              },
              editor_command: function (editorName, command) {
                var editor = $scope.editors[editorName];
                var args = Array.prototype.slice.call(arguments);
                args.splice(0,2);
                editor[command].apply(editor, args);
                return done();
              },
              editor_write: function (editorName, text, delay, stop) {
                var editor = $scope.editors[editorName];
                var delay = delay || 100;
                var stop = stop || 1;
                for (var i=0;i<text.length;i++) {
                  (function (i) { $timeout(function() { editor.insert(text[i]); }, i*delay); }(i));
                }
                $timeout(done, (text.length * delay) + stop);
                return null;
              },
              editor_select: function (editorName, col, row, toCol, toRow) {
                var editor = $scope.editors[editorName];
                editor.moveCursorTo(col, row);
                editor.selection.selectTo(toCol,toRow);
                return done();
              },
              editor_find: function(editorName, text) {
                var editor = $scope.editors[editorName];
                editor.find(text);
                return done();
              },
              editor_addmarker: function(editorName, markerName, clazz) {
                var editor = $scope.editors[editorName];
                $scope.editorMarkers[editorName][markerName] = editor.session.addMarker(editor.getSelectionRange(), clazz, "text", true);
                return done();
              },
              editor_removemarker: function(editorName, markerName) {
                var editor = $scope.editors[editorName];
                var marker = $scope.editorMarkers[editorName][markerName];
                editor.getSession().removeMarker(marker);
                delete $scope.editorMarkers[editorName][markerName];
                return done();
              }
            };

            var $clear = eventmanager.$on('tutorialengine', function (command) {
              if (lib[command]) {
                var args = Array.prototype.slice.call(arguments);
                args.splice(0,1);
                lib[command].apply(this, args);
                return;
              }
              alert('command unknown! ' + command);
            });

            $scope.$on('$destroy', function() { $clear(); });
          }
        ],
        compile: function(tElement, tAttrs, transclude) {
          return {
            pre: function preLink(scope, $element, $attributes, controller) {
              scope.$element = $element;
              scope.elements = { tutorial: $element };
              scope.editors = {};
              scope.editorMarkers = {};
            }
          };
        }
      }
    }
  ])