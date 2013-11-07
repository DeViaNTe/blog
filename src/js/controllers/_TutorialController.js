angular.module('App.Controllers')
  .controller('TutorialCtrl', ['$scope', '$location', '$http', 'eventmanager', 'engine',
    function TutorialCtrl($scope, $location, $http, eventmanager, engine) {

      $scope.tutorial = engine.process({
        "title": "My first angular directive",
        "tags": ["angular", "js"],
        "steps": [
        {
          actions: [
            { space: 'element', command: 'create', id: 'title-wrapper', data: { append: 'root', element: '<div class="page-header"></div>' } },
            { space: 'element', command: 'create', id: 'title', data: { append: 'title-wrapper', element: '<h1></h1>' } },
            { space: 'element', command: 'write',  id: 'title', data: { text: 'Directivas en angular', effect: 'type', speed: 120 } },

            { space: 'element', command: 'create', id: 'explanation', data: { append:'insertAfter:title-wrapper', element: '<p></p>', effect: 'slide' } },
            { space: 'element', command: 'write',  id: 'explanation', data: { text: 'aaa', effect: 'fade', speed: 120  } },

            { space: 'editor', command: 'create',  id: 'directive01', data: { append: 'root', effect: 'slide', style: { height: "200px" } } },
            { space: 'editor', command: 'mode',    id: 'directive01', data: { lang: 'javascript' } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { position: [1,0], text: '// nuestras directivas deberán pertenecer a un módulo para \n', effect: 'type', speed: 60, wait: 120 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: '// que la aplicación pueda requerirlas posteriormente, con \n', effect: 'type', speed: 50, wait: 120 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: '// lo que podemos comenzar con el encapsulado modular: ', effect: 'type', speed: 50, wait: 120 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: '\n\n', effect: 'type', speed: 100, wait: 600 } },

            { space: 'editor', command: 'write',   id: 'directive01', data: { text: 'angular.module(', effect: 'type', speed: 100, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: "'miAplicacion.directivas'", effect: 'type', speed: 120, wait: 300 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: ", [])\n", effect: 'type', speed: 100, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: ".directive(", effect: 'type', speed: 100, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: "'miPrimeraDirectiva'", effect: 'type', speed: 120, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: ", [function (){ }]);\n", effect: 'type', speed: 100, wait: 1500 } },
          ]
        },
        {
          actions: [
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: 'angular.module(', effect: 'type', speed: 100, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: "'miAplicacion.directivas'", effect: 'type', speed: 120, wait: 300 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: ", [])\n", effect: 'type', speed: 100, wait: 800 } },
          ]
        },
        {
          actions: [
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: ".directive(", effect: 'type', speed: 100, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: "'miPrimeraDirectiva'", effect: 'type', speed: 120, wait: 800 } },
            { space: 'editor', command: 'write',   id: 'directive01', data: { text: ", [function (){ }]);\n", effect: 'type', speed: 100, wait: 1500 } },
          ]
        }]
      });



    }
  ]);