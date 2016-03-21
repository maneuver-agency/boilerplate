require.config({
  paths: {
    "googlemaps": "modules/googlemaps",
    "async": "modules/async",
    "webfont": "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont"
  },
});

require(['polyfills', 'jquery', 'webfont'], function(pol, $){
  require(['components'], function(pol, com){
    require(['utils', 'application'], function(util, app){
      app.init();
    });
  });
});
