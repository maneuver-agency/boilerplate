define([], function(){

  "use strict";

  var ticking, handlers;

  function initialize(){
    ticking = false;

    bindEvents();

    outdatedBrowser({
      bgColor: '#f25648',
      color: '#ffffff',
      lowerThan: 'transform',
      languagePath: ''
    });
  }

  /*
   * Main method for binding some events to the document or window.
   */
  function bindEvents(){
    $(window)
    .on('resize scroll', requestTick)
    .trigger('resize');

    $(document)
    .on('click', function(e){

    });
  }

  function requestTick(e) {
    var func = 'on' + e.type.capitalize();
    // console.log(func.apply());
    if (!ticking && func in handlers) {
      window.requestAnimationFrame(handlers[func]);
      ticking = true;
    }
  }

  /*
   * Event Handlers object.
   */
  handlers = {

    onResize: function() {
      // do stuff here

      ticking = false;
    },

    onScroll: function() {
      // do stuff here

      ticking = false;
    }

  };

  return {
    init: initialize
  };

});



