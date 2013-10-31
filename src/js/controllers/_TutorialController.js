angular.module('App.Controllers')
  .controller('TutorialCtrl', ['$scope', '$location', '$http', 'eventmanager', 'engine',
    function TutorialCtrl($scope, $location, $http, eventmanager, engine) {

      $scope.tutorial = engine.process({
        "title": "My first angular directive",
        "tags": ["angular", "js"],
        "steps": [
        {
          actions: [
            // create title wrapper:
            ['element_create',    'titlewrapper', '<div class="page-header"></div>'],
            ['element_append',    'tutorial', 'titlewrapper'],
            // create title
            ['element_create',    'maintitle', '<h2 />'],
            ['element_append',    'titlewrapper', 'maintitle'],
            // write title
            ['element_write',     'maintitle', 'Directivas en angular', 120],

            // create ace editor
            ['element_create',    'editor1', '<div />'],
            ['element_css',       'editor1', 'height', '200px'],
            ['element_append',    'tutorial', 'editor1'],
            ['editor_attach',     'editor1'],
            ['element_hide',      'editor1'],
            ['wait', 1000],
            ['element_slidedown', 'editor1', 1500],

            ['editor_session',    'editor1', 'setMode', 'ace/mode/javascript'],
            ['wait', 500],

            ['editor_command',    'editor1', 'gotoLine', 1],
            ['editor_write',      'editor1', "// nuestras directivas deberán pertenecer a un módulo para \n", 60, 120],
            ['editor_write',      'editor1', "// que la aplicación pueda requerirlas posteriormente, con \n", 50, 120],
            ['editor_write',      'editor1', "// lo que podemos comenzar con el encapsulado modular: ", 50, 1500],
            ['editor_write',      'editor1', "\n\n", 100, 600],

            ['editor_write',      'editor1', "angular.module(", 100, 800],
            ['editor_write',      'editor1', "'miAplicacion.directivas'", 120, 300],
            ['editor_write',      'editor1', ", [])\n", 100, 800],
            ['editor_write',      'editor1', ".directive(", 100, 800],
            ['editor_write',      'editor1', "'miPrimeraDirectiva'", 120, 800],
            ['editor_write',      'editor1', ", [function (){ }]);\n", 100, 1500],
            ['editor_command',    'editor1', 'setHighlightActiveLine', false],

            // create explanation
            ['element_create',    'explanation', '<p class="lead"></p>'],
            ['element_append',    'tutorial', 'explanation'],
            ['element_write',     'explanation', 'Primero podemos observar dos puntos clave, el primero, tras la declaración del módulo, dónde pasamos como segundo argumento una lista vacía.', 60],
            ['wait', 500],
            ['editor_select',     'editor1', 4,42, 4,44],
            ['editor_addmarker',  'editor1', 'module-dependencies', 'ace_marker-flashing-gold'],
            ['wait', 1500],
            ['element_add_html',  'explanation', '<br>'],
            ['element_write',     'explanation', 'En esta primera lista deberíamos introducir los módulos de los que depende nuestro nuevo módulo. En este caso no utilitzaremos ningún módulo pero en posteriores ejemplos veremos su utilidad.', 60, 1500],
            ['editor_removemarker', 'editor1', 'module-dependencies'],

            ['element_add_html',  'explanation', '<br>'],
            ['element_write',     'explanation', 'El segundo punto clave es la declaración de la directiva, dónde no pasamos directamente una función, sino una lista con un elemento del tipo función.', 60, 500],
            ['editor_find',       'editor1', '[function (){ }]'],
            ['editor_addmarker',  'editor1', 'directive-dependencies', 'ace_marker-flashing-gold'],
          ]
        }]
      });



    }
  ]);