angular.module('App.Directives')
  .directive('ngTutorial', ['$timeout', '$sanitize', 'engine',
    function($timeout, $sanitize, engine) {
      return {
        restrict: 'A',
        transclude: false,
        scope: {},
        controller: ['$scope', '$rootScope', 'eventmanager', '$timeout',
          function($scope, $rootScope, eventmanager, $timeout) {

            var done = function() {
              eventmanager.$emit(engine.constants.events.ENGINE_COMMAND_DONE);
              if (!($scope.$$phase) && !($rootScope.$$phase)) {
                $rootScope.$digest();
              }
            };

            var lib = {
              manage: {
                reset: function(stepNumber, options, cmd) {
                  for (var edit in $scope.$slides[stepNumber].editors) {
                    $scope.$slides[stepNumber].editors[edit].editor.destroy();
                    $scope.$slides[stepNumber].editors[edit].element.remove()
                  }
                  var stored = { elements: { root: $scope.$element }, editors: {} };
                  $scope.$slides[stepNumber] = stored;
                  $($scope.$element[0]).children().remove();
                  return done();
                }
              },
              editor: {
                create: function(stepNumber, options, cmd) {
                  var $el = $('<div>');
                  if (cmd.data.append) {
                    // extract position and reference:
                    var position = "";
                    var reference = "";
                    var x = cmd.data.append.split(":");
                    if (x.length > 1) {
                      position = x[0];
                      reference = x[1];
                    } else {
                      reference = x[0];
                      position = "appendTo";
                    }

                    // grab reference
                    var $reference = $scope.$slides[stepNumber].elements[reference];
                    if (typeof $reference === "undefined" || $reference === null) {
                      throw new Error("Element " + reference + " not found.");
                    }

                    // apply special css
                    $el.css(cmd.data.style || {});

                    // append:
                    $el[position]($reference);

                    // store new element
                    var editor = ace.edit($el[0]);
                    editor.setHighlightActiveLine(false);
                    editor.setReadOnly(true);
                    editor.setBehavioursEnabled(false);
                    $scope.$slides[stepNumber].editors[cmd.id] = {
                      element: $el,
                      editor: editor
                    };

                    // set theme
                    if ($rootScope.theme === "theme-light") {
                      editor.setTheme('ace/theme/chrome');
                    }
                    if ($rootScope.theme === "theme-dark") {
                      editor.setTheme('ace/theme/monokai');
                    }

                    // animations?
                    if (cmd.data.effect && !options.skip) {
                      switch (cmd.data.effect) {
                        case "slide":
                          $el.hide();
                          $el.slideDown(function() {
                            editor.resize();
                            done();
                          });
                          return;
                        case "fade":
                          $el.hide();
                          $el.fadeIn(500, function() {
                            editor.resize();
                            done();
                          });
                          return;
                      }
                    }
                    return done();
                  }
                  throw new Error("dead end 03");
                },
                mode: function(stepNumber, options, cmd) {
                  var edit = $scope.$slides[stepNumber].editors[cmd.id];
                  edit.editor.getSession().setMode('ace/mode/' + cmd.data.lang);
                  return done();
                },
                write: function(stepNumber, options, cmd) {
                  var edit = $scope.$slides[stepNumber].editors[cmd.id];
                  var data = cmd.data;
                  // goto position first:
                  var pos = data.position;
                  if (pos && pos.length && pos instanceof Array) {
                    edit.editor.moveCursorTo(pos[0], pos[1]);
                  }

                  if (data.effect && !options.skip) {
                    // insert text
                    switch (data.effect) {
                      case "type":
                        var delay = (data.speed * (1 / options.speedfactor)) || 60;
                        var stop = (data.wait * (1 / options.speedfactor)) || 1;
                        var i = 0;
                        for (i = 0; i < data.text.length; i++) {
                          (function(i) {
                            $timeout(function() {
                              edit.editor.insert(data.text[i]);
                            }, i * delay);
                          }(i));
                        }
                        $timeout(done, (data.text.length * delay) + stop);
                        return;
                    }
                  }
                  edit.editor.insert(data.text);
                  return done();
                }
              },
              element: {
                create: function(stepNumber, options, cmd) {

                  var $el = $($sanitize(cmd.data.element));
                  if (cmd.data.append) {
                    // extract position and reference:
                    var position = "";
                    var reference = "";
                    var x = cmd.data.append.split(":");
                    if (x.length > 1) {
                      position = x[0];
                      reference = x[1];
                    } else {
                      reference = x[0];
                      position = "appendTo";
                    }

                    // grab reference
                    var $reference = $scope.$slides[stepNumber].elements[reference];
                    if (typeof $reference === "undefined" || $reference === null) {
                      throw new Error("Element " + reference + " not found.");
                    }

                    // apply special css
                    $el.css(cmd.data.style || {});

                    // store new element
                    if (cmd.id) {
                      $scope.$slides[stepNumber].elements[cmd.id] = $el;
                    }

                    // append:
                    $el[position]($reference);

                    // exit;
                    return done();
                  }
                  throw new Error("dead end 01;");
                },
                write: function(stepNumber, options, cmd) {
                  var $element = $scope.$slides[stepNumber].elements[cmd.id];
                  if ($element) {
                    if (cmd.data.effect && !options.skip) {
                      switch (cmd.data.effect) {
                        case "type":
                          var delay = (cmd.data.speed * (1 / options.speedfactor)) || 60;
                          var stop = (cmd.data.wait * (1 / options.speedfactor)) || 1;
                          var i = 0;
                          for (i = 0; i < cmd.data.text.length; i++) {
                            (function(i) {
                              $timeout(function() {
                                $element.html($element.html() + cmd.data.text[i]);
                              }, i * delay);
                            }(i));
                          }
                          $timeout(done, (cmd.data.text.length * delay) + stop);
                          return null;
                          break;
                        case "fade":
                          var delay = null || 60;
                          var stop = null || 1;
                          $element.html($element.html() + cmd.data.text);
                          return done();
                          break;
                      }
                    }
                    $element.html($element.html() + cmd.data.text);
                    return done();
                  }
                  throw new Error("dead end 02;");
                }

              }
            };


            var libb = {
              editor_attach: function() {
                var $cover = $('<div>');
                $cover.css({
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  'z-index': 200
                });
                $cover.on('click, mousedown, touchstart', function(event) {
                  event.preventDefault();
                  return false;
                });
                $el.append($cover);
                return done();
              },
              editor_session: function(editorName, command) {
                var editor = $scope.editors[editorName];
                var session = editor.getSession();
                var args = Array.prototype.slice.call(arguments);
                args.splice(0, 2);
                session[command].apply(session, args);
                return done();
              },
              editor_command: function(editorName, command) {
                var editor = $scope.editors[editorName];
                var args = Array.prototype.slice.call(arguments);
                args.splice(0, 2);
                editor[command].apply(editor, args);
                return done();
              },
              editor_write: function(editorName, text, delay, stop) {
                var editor = $scope.editors[editorName];
                var delay = delay || 100;
                var stop = stop || 1;
                for (var i = 0; i < text.length; i++) {
                  (function(i) {
                    $timeout(function() {
                      editor.insert(text[i]);
                    }, i * delay);
                  }(i));
                }
                $timeout(done, (text.length * delay) + stop);
                return null;
              },
              editor_select: function(editorName, col, row, toCol, toRow) {
                var editor = $scope.editors[editorName];
                editor.moveCursorTo(col, row);
                editor.selection.selectTo(toCol, toRow);
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

            var $clearHandler = eventmanager.$on(engine.constants.events.ENGINE_PROCESS_CMD, function(stepNumber, options, command) {
              $scope.options = options;
              $scope.step = stepNumber;

              // prepare context
              var stored = $scope.$slides[stepNumber] || {
                elements: {
                  root: $scope.$element
                },
                editors: {}
              };

              $scope.$slides[stepNumber] = stored;

              // exists function ?
              var fn = lib[command.space];
              if (fn === null || typeof fn === "undefined") {
                throw new Error("Command namespace not found: " + command.space);
              }
              fn = fn[command.command];
              if (fn === null || typeof fn === "undefined") {
                throw new Error("Function " + command.command + " not found in " + command.space + " namespace.");
              }

              // exec command!
              try {
                return fn(stepNumber, options, command);
              } catch (err) {
                throw new Error(err);
              }
            });

            $scope.$on('$destroy', function() {
              $clearHandler();
              $clearFirst();
            });
          }
        ],
        compile: function(tElement, tAttrs, transclude) {
          return {
            pre: function preLink(scope, $element, $attributes, controller) {
              scope.$element = $element;
              scope.$slides = {};
            }
          };
        }
      }
    }
  ])