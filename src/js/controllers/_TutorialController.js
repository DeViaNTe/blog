angular.module('App.Controllers')
  .controller('TutorialCtrl', ['$scope', '$location', 'eventmanager', 'engine',
    function TutorialCtrl($scope, $location, eventmanager, engine) {
      $scope.tutorial = engine.tutorial();

      // fake
      $scope.tutorial.addStep();
      $scope.tutorial.title('Titulo del parrafo 1');

      $scope.tutorial.addStep();
      $scope.tutorial.paragraph("Un parrafo con bla bla bla...");
      $scope.tutorial.file("index.html", 'html', [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '  <meta charset="UTF-8">',
        '  <title>xxxxx</title>',
        '</head>',
        '<body>',
        '',
        '</body>',
        '</html>'
      ].join("\n"));

      $scope.tutorial.addStep();
      $scope.tutorial.title('Titulo del parrafo 2');

      $scope.tutorial.addStep();
      $scope.tutorial.title('Titulo del parrafo 3');

      $scope.tutorial.init();


      /*
var tutorial = {
  title: "my-tuto-rail",
  subtitle: "como quieras colacao",
  image: "/holder.js/300x200/industrial",
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras euismod dapibus metus ac faucibus. Phasellus velit magna, aliquam ut facilisis ut, porttitor interdum nisl. Etiam nec nisl orci. Aenean vitae dolor dolor. Curabitur vel tellus molestie, vehicula tellus eu, iaculis nulla. Suspendisse mattis luctus tortor. Nam nulla nisl, gravida in eros blandit, vestibulum accumsan eros. Integer interdum, lectus at iaculis hendrerit, ligula magna adipiscing dui, nec laoreet nisi ante et orci. Aenean at pretium dui. Sed ornare iaculis arcu a bibendum. Mauris sodales dolor in lorem cursus, vel auctor est pharetra. Duis semper vestibulum semper. In varius sagittis orci, vitae lobortis tellus consequat a. In hac habitasse platea dictumst. Suspendisse venenatis vehicula est nec consequat.",
  tags: ["css3", "bootstrap", "angularjs", "js"],
  timeline: [
  ng.title("Titulo del parrafo"),
  ng.paragraph("Un parrafo con bla bla bla..."),
  ng.file("index.html", [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="UTF-8">',
    '  <title>xxxxx</title>',
    '</head>',
    '<body>',
    '',
    '</body>',
    '</html>'].join("\n"))
  ]
};
*/


    }
  ]);