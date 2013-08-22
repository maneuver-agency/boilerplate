;(function($, undefined){

	"use strict";

	var Application = function(){
    this.ticking = false;

	};

  Application.prototype.init = function() {

  };

  Application.prototype.requestTick = function() {
    if (!self.ticking) {
      window.requestAnimationFrame(App.onAnimationFrame);
      self.ticking = true;
    }
  };

  Application.prototype.onAnimationFrame = function() {
    // do stuff here
    self.ticking = false;
  };

	var self = new Application();

	// create global reference.
	window.App = self;

})(jQuery);



