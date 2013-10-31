angular.module('App.Services')
  .provider('engine', function() {
    var self = this;

    function Engine(src, eventmanager) {
      this.debug        = false;
      this.step         = 0;
      this.action       = 0;
      this.numsteps     = src.steps.length;
      this.src          = src;
      this.running      = false;
      this.busy         = false;
      this.eventmanager = eventmanager;
    };

    Engine.prototype.nextAction = function (cb) {
      var currentStep = this.src.steps[this.step];
      var currentAction = currentStep.actions[this.action];
      var self = this;

      /* copy action array, prepend tutorialengine event */
      var command = angular.copy(currentAction);
      command.splice(0, 0, 'tutorialengine');

      /* set busy, setup action end handler */
      this.busy = true;
      var clearCallback = this.eventmanager.$on('tutorialenginecb', function () {
        clearCallback();
        self.nextActionDone.call(self);
      });

      /* tell tutorial directive to perform next action */
      this.eventmanager.$emit.apply(this.eventmanager, command);
    };

    Engine.prototype.nextActionDone = function() {
      this.action++;
      if (this.action >= this.src.steps[this.step].actions.length) { return this.slideDone(); }
      else {
        this.busy = false;
        if (this.debug === false) { this.nextAction(); }
      }
    };

    Engine.prototype.slideDone = function() {
      this.action = 0;
      this.step++;
      if (this.step >= this.src.steps.length) { return this.tutorialDone(); }
      else { this.busy = false; }
    };

    Engine.prototype.tutorialDone = function() {
      console.log("tutorial ended");
      this.busy = false;
    };

    Engine.prototype.play = function() {
      this.debug = true;
      this.nextAction();
    };

    Engine.prototype.next = function () {
      this.nextAction();
    };

    Engine.prototype.prev = function() {

    };

    /* exports */
    this.$get = ['eventmanager', function (eventmanager) {
      return {
        process: function(source) {
          return new Engine(source, eventmanager);
        }
      };
    }];

  });