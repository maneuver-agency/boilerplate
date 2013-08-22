(function(){

  var folder = '/'; //'/sites/all/themes/front/';

  Modernizr.load([
    {
      load: [
        folder + 'dist/polyfills.js',
        folder + 'dist/components.js'
      ]
    },
    {
      // angular
      test: jQuery('html').hasClass('load-angular'),
      yep: [
        folder + 'dist/app.js'
      ],
      complete: function() {
        if (typeof angular !== 'undefined') {
          angular.bootstrap(document, ['genApp']);
        }
      }
    },
    {
      load: [
        folder + 'dist/utils.js',
        folder + 'dist/application.js'
      ],
      complete: function() {
        App.init();
      }
    }
  ]);

})();
