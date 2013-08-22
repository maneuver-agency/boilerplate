angular.module('genetic.directives', [])

.directive('myDirective', function() {
  return {
    link: function(scope, element, attrs) {
      var $el = jQuery(element);
    }
  };
});
