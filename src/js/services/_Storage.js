angular.module('App.Services')
  .provider('storage', function() {
    var self = this;

    var permanentStorage = window.localStorage;
    var sessionStorage = window.sessionStorage;

    self.lib = {
      permanent : {
        get: function (key, defValue) { return permanentStorage.getItem(key) && JSON.parse(permanentStorage.getItem(key)) || defValue; },
        set: function (key, value) { permanentStorage.setItem(key, JSON.stringify(value) ); },
        length: function () { return permanentStorage.length; },
        keys: function () { var i = 0, k = []; for (i=0;i<permanentStorage.length;i++) { k.push(permanentStorage.key(i)); } return k; }
      },
      session: {
        get: function (key, defValue) { return sessionStorage.getItem(key) && JSON.parse(sessionStorage.getItem(key)) || defValue; },
        set: function (key, value) { sessionStorage.setItem(key, JSON.stringify(value) ); },
        length: function () { return sessionStorage.length; },
        keys: function () { var i = 0, k = []; for (i=0;i<sessionStorage.length;i++) { k.push(sessionStorage.key(i)); } return k; }
      }
    };

    this.$get = function() { return self.lib; };

  });