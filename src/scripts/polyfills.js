
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


/*! matchMedia() polyfill - Test a CSS media type/query in JS. Authors & copyright (c) 2012: Scott Jehl, Paul Irish, Nicholas Zakas. Dual MIT/BSD license */
window.matchMedia = window.matchMedia || (function( doc, undefined ) {

  "use strict";

  var bool,
      docElem = doc.documentElement,
      refNode = docElem.firstElementChild || docElem.firstChild,
      // fakeBody required for <FF4 when executed in <head>
      fakeBody = doc.createElement( "body" ),
      div = doc.createElement( "div" );

  div.id = "mq-test-1";
  div.style.cssText = "position:absolute;top:-100em";
  fakeBody.style.background = "none";
  fakeBody.appendChild(div);

  return function(q){

    div.innerHTML = "&shy;<style media=\"" + q + "\"> #mq-test-1 { width: 42px; }</style>";

    docElem.insertBefore( fakeBody, refNode );
    bool = div.offsetWidth === 42;
    docElem.removeChild( fakeBody );

    return {
      matches: bool,
      media: q
    };

  };

}( document ));

/*! matchMedia() polyfill addListener/removeListener extension. Author & copyright (c) 2012: Scott Jehl. Dual MIT/BSD license */
(function(){
    // monkeypatch unsupported addListener/removeListener with polling
    if( !window.matchMedia('min-width:1px').addListener ){
        var oldMM = window.matchMedia;

        window.matchMedia = function( q ){
            var ret = oldMM( q ),
                listeners = [],
                last = ret.matches,
                timer,
                check = function(){
                    var list = oldMM( q ),
                        unmatchToMatch = list.matches && !last,
                        matchToUnmatch = !list.matches && last;

                                        //fire callbacks only if transitioning to or from matched state
                    if( unmatchToMatch || matchToUnmatch ){
                        for( var i =0, il = listeners.length; i< il; i++ ){
                            listeners[ i ].call( ret, list );
                        }
                    }
                    last = list.matches;
                };

            ret.addListener = function( cb ){
                listeners.push( cb );
                if( !timer ){
                    timer = setInterval( check, 1000 );
                }
            };

            ret.removeListener = function( cb ){
                for( var i =0, il = listeners.length; i< il; i++ ){
                    if( listeners[ i ] === cb ){
                        listeners.splice( i, 1 );
                    }
                }
                if( !listeners.length && timer ){
                    clearInterval( timer );
                }
            };

            return ret;
        };
    }
}());
