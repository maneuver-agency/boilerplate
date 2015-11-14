require.config({
  paths: {
    "googlemaps": "modules/googlemaps",
    "async": "modules/async",
  },
});

require(['polyfills', 'jquery'], function(pol, $){
  require(['components'], function(pol, com){
    require(['utils', 'application'], function(util, app){
      // angular.bootstrap(document, ['instorecomm']);
      app.init();
    });
  });
});
