angular.module('App.Services')
  .provider('engine', function() {
    var self = this;

    /* constants */
    var constants = {
      events: {
        ENGINE_PROCESS_CMD: '__event_tutorial_step_process_command_900cv7dfv',
        ENGINE_COMMAND_DONE: '__event_tutorial_step_command_done_090dfg73ad'
      }
    };

    /* Engine class */
    function Engine(src, eventmanager) {
      this.debug = false;
      this.step = 0;
      this.action = 0;
      this.numsteps = src.steps.length;
      this.src = src;
      this.running = false;
      this.busy = false;
      this.eventmanager = eventmanager;
      this.options = {
        speedfactor: 2,
        skip: false
      };
    };

    Engine.prototype.nextAction = function() {
      if (this.step === this.gotoStep) { delete this.gotoStep; return; }
      var currentStep = this.src.steps[this.step];
      var currentAction = currentStep.actions[this.action];
      var self = this;

      /* set busy, setup handler of command done. */
      this.busy = true;
      var clearCallback = this.eventmanager.$on(constants.events.ENGINE_COMMAND_DONE, function() {
        clearCallback();
        self.nextActionDone.call(self);
      });

      /* tell tutorial directive to perform next action */
      this.eventmanager.$emit(constants.events.ENGINE_PROCESS_CMD, 0 /*this.step*/, this.options, currentAction);
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
      this.action = 0; this.step++;
      if (this.gotoStep && this.step < this.gotoStep) { return this.nextAction(); }
      if (this.step >= this.src.steps.length) { return this.tutorialDone(); } else { this.busy = false; }
    };

    Engine.prototype.tutorialDone = function() { this.busy = false; };
    Engine.prototype.play = function() { this.debug = true; this.nextAction(); };
    Engine.prototype.next = function() { this.nextAction(); };
    Engine.prototype.prev = function() {
      var self = this;
      var clearCallback = this.eventmanager.$on(constants.events.ENGINE_COMMAND_DONE, function() {
        clearCallback();
        self.action = 0;
        self.gotoStep = self.step - 1;
        console.log("going to " + self.gotoStep);
        self.step = 0;
        self.nextAction();
      });
      this.eventmanager.$emit(constants.events.ENGINE_PROCESS_CMD, 0, this.options, { space: 'manage', command: 'reset' });
    };

    /* exports */
    this.$get = ['eventmanager',
      function(eventmanager) {
        return {
          process: function(source) {
            return new Engine(source, eventmanager);
          },
          constants: constants
        };
      }
    ];

  });