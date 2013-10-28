angular.module('App.Services')
  .provider('engine', function() {
    var self = this;

    /* engine */
    var Engine = function Engine() {
      this.props = {
        async: false,
        type: "unknown"
      };
    };

    Engine.prototype.async = function() {
      this.props.async = true;
      return this;
    };

    /* tutorial */
    var Tutorial = function Tutorial() {
      this._files = {};
      this._currentStep = 0;
      this._running = false;
      this._steps = [];
    };

    Tutorial.prototype.title = function(text) {
      var obj = new Engine();
      obj.props.type = "title";
      obj.props.content = text;
      this._steps.push(obj);
      return obj;
    };

    Tutorial.prototype.paragraph = function(text) {
      var obj = new Engine();
      obj.props.type = "paragraph";
      obj.props.content = text;
      this._steps.push(obj);
      return obj;
    };

    Tutorial.prototype.file = function(name, language, contents) {
      var obj = new Engine();
      obj.props.type = "file";
      obj.props.name = name;
      obj.props.lang = language;
      obj.props.content = contents;
      if (this._files.hasOwnProperty(name)) {
        this._files[name].push(contents);
        obj.props.fileIndex = this._files[name].length - 1;
      } else {
        this._files[name] = [contents];
        obj.props.fileIndex = 0;
      }
      this._steps.push(obj);
      return obj;
    };

    /* views */
    Tutorial.prototype.view = function() {
      var i = this._currentStep;
      var template = "";
      var step = null;
      for (;i<this._steps.length;i++) {
        step = this._steps[i];
        template += "<div ng-include=\" 'tutorial-element/" + step.props.type + ".html' \"></div>";
        if (step.props.async === false) { break; }
      }
      return template;
    };

    Tutorial.prototype.next = function() {
      this._currentStep++;
      if (this._currentStep >= this._steps.length) { this._currentStep = this._steps.length; }
    };

    Tutorial.prototype.prev = function() {
      this._currentStep--;
      if (this._currentStep < 0) { this._currentStep = 0; }
    };

    /* exports */
    this.$get = function () {
      return { tutorial: function tuto() { return new Tutorial(); } };
    };

  })
  .run(['$templateCache', function ($templateCache) {
    $templateCache.put('tutorial-element/title.html', '<h1> titulo xD </h1>');
    $templateCache.put('tutorial-element/paragraph.html', '<p> parrafo </p>');
    $templateCache.put('tutorial-element/file.html', '<p> código </p>');
  }]);

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