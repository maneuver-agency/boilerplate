
module.exports = Filter;

var events = [];

function Filter(isotope, grouping) {
  this.isotope = isotope;
  this.grouping = grouping || false;
  this.keys = getStore();

  this.doFiltering();
}

function getStore(){
  var s = window.sessionStorage.getItem('projectFilter');
  if (s) {
    return JSON.parse(s);
  }
  return [];
}

function setStore(data) {
  window.sessionStorage.setItem('projectFilter', JSON.stringify(data));
}

Filter.prototype = {
  constructor: Filter,

  doFiltering: function(group){
    var string;

    // Check if we have any keys.
    // this.keys can be an Array or an Object,
    // that's why we use the Object prototype to check its length.
    if (Object.keys(this.keys).length) {
      if (this.grouping) {
        string = '';
        for (var prop in this.keys) {
          if (this.keys.hasOwnProperty(prop)) {
            string += '.' + this.keys[prop].join('.');
          }
        }
      } else {
        string = '.' + this.keys.join('.');
      }
    } else {
      string = '*';
    }
    this.isotope.arrange({ filter: string});
    trigger(this, 'update');
  },

  update: function(key, group){
    var i,
        string,
        group = group || false,
        groupedKeys,
        allowed_per_group = 1;

    if (key == '*') {
      this.keys = [];
    } else {
      groupedKeys = this.keys;
      if (this.grouping && group) {
        // Organize keys into groups.

        if (this.keys.length !== undefined && this.keys.length === 0) {
          // Make it an object in order to be able to use it as
          // an associative array.
          this.keys = {};
        }
        // Check of current group is already present.
        if (!this.keys.hasOwnProperty(group)) {
          this.keys[group] = [];
        }
        groupedKeys = this.keys[group];
      }
      i = groupedKeys.indexOf(key);
      if (i >= 0) {
        // Key exists, remove it.
        groupedKeys.splice(i, 1);
      } else if (key) {
        // Key does not exist, add it.
        groupedKeys.push(key);
      }
    }

    if (this.grouping && group) {
      if (groupedKeys.length) {
        while (groupedKeys.length > allowed_per_group) {
          // Remove keys at the beginning until allowed length.
          groupedKeys.shift();
        }
        // Add it back to the list of other groups.
        this.keys[group] = groupedKeys;
      } else {
        delete this.keys[group];
      }
    } else {
      this.keys = groupedKeys;
    }

    this.doFiltering();
    setStore(this.keys);
  },

  on: function(eventname, callback) {
    events[eventname] = callback;

    if (eventname == 'update') {
      // Redo filtering so the new update event is fired immediatly.
      this.doFiltering();
    }
  }
}

function trigger(object, eventname) {
  if (typeof events[eventname] == 'function') {
    events[eventname].call(object, object.keys);
  }
}
