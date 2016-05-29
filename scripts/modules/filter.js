
module.exports = Filter;

var events = [];

function Filter(isotope, allowed_per_group) {
  this.isotope = isotope;
  this.allowed_per_group = allowed_per_group || false; // false = unlimited
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

    this.isotope.arrange({ filter: main_selector});
    trigger(this, 'update');
  },

  update: function(key, group) {
    var i;

    group = group || 'main';

    // Make sure the group is present in our list.
    if (!(group in this.keys)) {
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
      if (this.allowed_per_group && this.keys[group].length > this.allowed_per_group) {
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
