angular.module('App.Services')
.provider('eventmanager', function() {
  var self = this;

  /* setup interface */
  self.callbacks = {};

  self.$on = function(eventName, eventCallback) {
    var callbacks = self.callbacks[eventName] || [];
    callbacks.push(eventCallback);
    self.callbacks[eventName] = callbacks;
    return function () { self.callbacks[eventName].splice(self.callbacks[eventName].indexOf(eventCallback), 1); };
  };

  self.$emit = function(eventName, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
    var callbacks = self.callbacks[eventName] || [];
    angular.forEach(callbacks, function (callback) { callback(arg1, arg2, arg3, arg4, arg5, arg6, arg7); });
  };

  /* setup event handler */
  window.addEventListener('orientationchange', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('orientationchange', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, true);

  /* vistos */
  document.addEventListener('pause', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('pause', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('resume', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('resume', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('menubutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('menubutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('backbutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('backbutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('online', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('online', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('offline', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('offline', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);

  /* no vistos */
  document.addEventListener('batterycritical', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('batterycritical', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('batterylow', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('batterylow', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('searchbutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('searchbutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('startcallbutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('startcallbutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('endcallbutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('endcallbutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('volumedownbutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('volumedownbutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);
  document.addEventListener('volumeupbutton', function(arg1, arg2, arg3, arg4, arg5, arg6, arg7) { self.$emit('volumeupbutton', arg1, arg2, arg3, arg4, arg5, arg6, arg7); }, false);

  /* make lib public */
  this.$get = function () {
    return {
      $on: self.$on,
      $emit: self.$emit
    };
  };
});