require.config({
  paths: {
    "googlemaps": "modules/googlemaps",
    "async": "modules/async",
    "webfont": "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"
  },
});

require(['polyfills', 'jquery', 'webfont'], function(pol, $){
  require(['components'], function(pol, com){
    require(['utils', 'application'], function(util, app){
      // angular.bootstrap(document, ['instorecomm']);
      app.init();
    });
  });
});
