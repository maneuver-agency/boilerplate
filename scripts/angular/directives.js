angular.module('mnvr.directives', [])

.directive('myDirective', function() {
  return {
    link: function(scope, element, attrs) {
      var $el = jQuery(element);
    }
  };
});
