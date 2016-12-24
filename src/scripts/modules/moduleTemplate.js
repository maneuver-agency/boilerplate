const $ = require('jquery')

module.export = module

function Module () {
  this.variable = ''
}

Module.prototype = {
  constructor: Module,

  method: function () {
    let $t = $()
  }
}
