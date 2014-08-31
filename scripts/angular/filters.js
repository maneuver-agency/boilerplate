angular.module('mnvr.filters', [])

.filter('myFilter', function () {
    return function (input, selection) {
      var result = [];
      angular.forEach(input, function(product){
        var yes = false;

        if (yes) result.push(product);
      });
      return result;
    };
});
