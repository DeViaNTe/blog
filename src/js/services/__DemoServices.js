angular.module('App.Services')
.service('helloWorldFromService', function() {    // injecting service: return new this.
  this.sayHello = function() {
    return "hello world";
  };
})
.factory('helloWorldFromFactory', function() {  // injecting factory: returns what this function returns.
  return {
    sayHello: function () {
      return "Hello world!";
    }
  }
})
.provider('helloWorld', function() { // injecting provider: return what $get returns. permits configuration.
  this.name = "test";

  this.$get = function () { // injections here.
    /* .... */
  };

  this.setName = function(name) {
    this.name = name;
  };
})