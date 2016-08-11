var $ = require('jquery');

module.exports = LoadMore;

function LoadMore() {

  /**
   * Choose between 'manual' or 'auto'.
   **/
  this.mode = 'auto';

  this.storageKey = 'load-more';

  this.loading = false;
  this.events = [];

  this.$loader = $();
  this.$button = $();
  this.$container = $();

  this.settings = {
    hideButton: false,
    posttype: 'post',
    setHistory: true
  };
}

LoadMore.prototype = {
  constructor: LoadMore,

  setup: function(options){
    if (options.mode) {
      this.mode = options.mode;
    }
    if (options.loader) {
      this.$loader = $(options.loader);
    }
    if (options.button) {
      this.$button = $(options.button);
    }
    if (options.container) {
      this.$container = $(options.container);
    }

    delete options.mode;
    delete options.loader;
    delete options.button;
    delete options.container;

    $.extend(this.settings, options);

    // Make the storage key unique to this instance.
    // This is important when there are multiple instances on 1 page.
    this.storageKey += window.location.pathname + this.settings.posttype;

    this.$loader.hide();

    switch (this.mode) {
      case 'manual':
        this.setupManual();
        break;
      case 'auto':
        this.setupInfinite();
        break;
    }

    // If the user has already loaded in more items.
    // Make sure we load them in again on a new pageload.
    if (this.getCurrentPage() > 1) {
      this.fetch(true);
    }
  },

  setupManual: function() {
    var self = this;

    this.$button.toggle(this.hasItemsLeft());

    this.$button.on('click', function(){
      if (self.loading === false) {
        self.fetch();
      }
    });
  },

  setupInfinite: function() {
    var self = this;

    this.$button.hide();

    $(window).on('scroll', function(){
      if (self.loading === false && window.scrollY + window.innerHeight >= $(document).height() - 50) {
        self.fetch();
      }
    });
  },

  getCurrentPage: function() {
    if (this.settings.setHistory && window.location.pathname) {
      var regex = new RegExp('/page/([^&]*)');
      var matches = window.location.pathname.match(regex);
      if (matches) {
        return parseInt(matches[1], 10);
      }
    } else {
      var page = this.getStorage('page');
      if (page) return page;
    }
    return 1;
  },

  setPage: function(page) {
    if (this.settings.setHistory && 'history' in window) {
      var title = document.title;
      var regex = new RegExp('Page ([^&]*)');
      if (title.search(regex) != -1) {
        title = title.replace(regex, 'Page ' + page);
      } else {
        title = title + ' - Page ' + page;
      }
      window.history.pushState({}, title, 'page/'+page);

      // Browsers still ignore the title parameter in pushState.
      document.title = title;
    } else {
      this.setStorage('page', page);
    }
  },

  setStorage: function(key, value) {
    if ('localStorage' in window) {
      window.localStorage.setItem(this.storageKey + '[' + key + ']', value);
    }
  },

  getStorage: function(key) {
    if ('localStorage' in window) {
      return window.localStorage.getItem(this.storageKey + '[' + key + ']');
    }
  },

  hasItemsLeft: function() {
    var page = this.getCurrentPage();
    return mnvr_loadmore.count[this.settings.posttype]
      && mnvr_loadmore.posts_per_page * page < mnvr_loadmore.count[this.settings.posttype].publish;
  },

  fetch: function(init){
    var self = this;

    if (!init && !this.hasItemsLeft()){
      // There are no more posts to load. Abandon ship!
      return;
    }

    var page = this.getCurrentPage();
    if (!init) page++;

    var data = {
      nonce: mnvr_loadmore.nonce,
      action: 'mnvr_ajax_load_more',
      page: page
    };

    if (init) {
      data.posts_per_page = page * mnvr_loadmore.posts_per_page;
    }

    self.loading = true;
    self.$button.prop('disabled', true).toggle(!self.settings.hideButton && self.mode == 'manual');
    self.$loader.show();

    $.post(mnvr_loadmore.url, data, function(res){
      self.onUpdate(res.data, page);

    }).fail(function(){
      console.error('load more ajax call failed');

    }).always(function(){
      self.loading = false;
      self.$loader.hide();
      self.$button.prop('disabled', false).toggle(self.mode == 'manual' && self.hasItemsLeft());
    });
  },

  onUpdate: function(data, page) {
    this.$container.append(data);

    this.trigger('update', data);
    this.setPage(page);

  },

  trigger: function(eventname, args) {
    if (typeof this.events[eventname] == 'function') {
      this.events[eventname].call(this, args);
    }
  },

  on: function(eventname, callback) {
    this.events[eventname] = callback;
  }

};
