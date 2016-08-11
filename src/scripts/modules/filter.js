
module.exports = Filter;

var events = [];

function Filter(isotope, options) {
  this.isotope = isotope;
  this.options = $.extend({
    allowed_per_group: false,     // make groups of filtering.
    exclusive: true,              // only allow 1 active filter.
    active_class: 'active',       // used as class for active filter item.
  }, options);
  this.keys = getStore();

  this.doFiltering();
}

function getStore(){
  var s = window.sessionStorage.getItem('projectFilter');
  if (s) {
    return JSON.parse(s);
  }
  return {};
}

function setStore(data) {
  window.sessionStorage.setItem('projectFilter', JSON.stringify(data));
}

Filter.prototype = {
  constructor: Filter,

  doFiltering: function() {
    var combinations,
        combi_selectors = [],
        main_selector = '';

    // Create all combinations.
    combinations = this.cartesian(Object.values(this.keys));
    for (var i in combinations) {
      combi_selectors.push('.' + combinations[i].join('.'));
    }
    main_selector = combi_selectors.join(',');

    if ('arrange' in this.isotope && typeof this.isotope.arrange == 'function') {
      this.isotope.arrange({ filter: main_selector});
    } else {
      if (main_selector) {
        $(this.isotope).hide().filter(main_selector).show();
      } else {
        $(this.isotope).show();
      }
    }
    trigger(this, 'update');
  },

  update: function(key, group) {
    var i;

    group = group || 'main';

    // Make sure the group is present in our list.
    // If this is an exclusive filtering; discard all present filters.
    if (!(group in this.keys) || this.options.exclusive) {
      this.keys[group] = [];
    }

    if (key == '*') {
      // Reset the group.
      delete this.keys[group];
    } else {
      // Check if key is present within our group.
      i = this.keys[group].indexOf(key);
      if (i == -1) {
        // No? Add it.
        this.keys[group].push(key);
      } else {
        // Yes? Remove it.
        this.keys[group].splice(i, 1);
      }
      // If we exceed the maximum length, remove the first in the list.
      if (this.options.allowed_per_group && this.keys[group].length > this.options.allowed_per_group) {
        this.keys[group].shift();
      }

      if (this.keys[group].length === 0) {
        delete this.keys[group];
      }
    }

    // console.table(this.keys);

    this.doFiltering();
    setStore(this.keys);
  },

  setNav: function($nav) {
    var self = this;

    $nav.on('click', function(){
      var group = $(this).data('filter-group');
      self.update($(this).data('filter'), group);
    });

    self.on('update', function(keys){
      $nav.removeClass(self.options.active_class);

      if (Object.values(keys).length === 0) {
        $nav.filter('[data-filter="*"]').addClass(self.options.active_class);
      } else {
        for (var group in keys) {
          for (var i in keys[group]) {
            var key = keys[group][i];
            $nav.filter('[data-filter="'+ key +'"]').addClass(self.options.active_class);
          }
        }
      }
    });
  },

  reset: function(group) {
    this.update('*', group);
  },

  on: function(eventname, callback) {
    events[eventname] = callback;

    if (eventname == 'update') {
      // Redo filtering so the new update event is fired immediatly.
      this.doFiltering();
    }
  },

  // http://stackoverflow.com/questions/15298912/javascript-generating-combinations-from-n-arrays-with-m-elements?answertab=active#tab-top
  cartesian: function(arg) {
    var r = [], max = arg.length-1;
    function helper(arr, i) {
      for (var j=0, l=arg[i].length; j<l; j++) {
        var a = arr.slice(0); // clone arr
        a.push(arg[i][j]);
        if (i==max)
          r.push(a);
        else
          helper(a, i+1);
      }
    }
    if (arg.length) {
      helper([], 0);
    }
    return r;
  }
}

function trigger(object, eventname) {
  if (typeof events[eventname] == 'function') {
    events[eventname].call(object, object.keys);
  }
}
