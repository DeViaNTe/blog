/*global window */
var ngappRequires = ['ngRoute', 'ngAnimate', 'ngTouch', 'ngResource', 'ngSanitize', 'App.Services', 'App.Routes', 'App.Directives', 'App.Controllers'];

var app = {
  initialize: function () {
    this.bindEvents();
  },

  bindEvents: function() {
    $().ready(this.load);
    document.addEventListener('deviceready', function() { app.launch("deviceready") }, true);
  },

  load: function () {
    if (typeof cordova === "undefined") { setTimeout(function() { app.launch("load"); }, 500);  }
  },

  launch: function(mode) {
    $('#deviceready').html(mode + ' - started');
    setTimeout(function() { $('html').addClass('start') }, 1);
    setTimeout(function() { $('html').addClass('started'); }, 1000);
    setTimeout(function() { angular.bootstrap( $('html')[0], ngappRequires ); }, 2000);
  }
}

// Westridge: 609245