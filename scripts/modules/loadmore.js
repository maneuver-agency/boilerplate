var $ = require('jquery');

module.exports = {

  /**
   * Choose between 'manual' or 'auto'.
   **/
  mode: 'auto',

  loading: false,
  events: [],

  $loader: $(),
  $button: $(),

  settings: {
    hideButton: false,
    posttype: 'post' // @TODO: make it work with different lists on 1 page?
  },

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

    delete options.mode;
    delete options.loader;
    delete options.button;

    $.extend(this.settings, options);

    this.$loader.hide();

    switch (this.mode) {
      case 'manual':
        this.setupManual();
        break;
      case 'auto':
        this.setupInfinite();
        break;
    }
  },

  setupManual: function() {
    var self = this;

    this.$button.show();

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
    if (window.location.pathname) {
      var regex = new RegExp('/page/([^&]*)');
      var matches = window.location.pathname.match(regex);
      if (matches) {
        return parseInt(matches[1], 10);
      }
    }
    return 1;
  },

  setPage: function(page) {
    if ('history' in window) {
      var title = document.title;
      var regex = new RegExp('Page ([^&]*)');
      if (title.search(regex) != -1) {
        title = title.replace(regex, 'Page ' + page);
      } else {
        title = title + ' - Page ' + page;
      }
      window.history.pushState({}, title, '/page/'+page);

      // Browsers still ignore the title parameter in pushState.
      document.title = title;
    }
  },

  fetch: function(){
    var self = this;

    var page = this.getCurrentPage();

    if (mnvr_loadmore.count[this.settings.posttype]
      && mnvr_loadmore.posts_per_page * page >= mnvr_loadmore.count[this.settings.posttype].publish)
    {
      // There are no more posts to load. Abandon ship!
      return;
    }

    page++;

    var data = {
      nonce: mnvr_loadmore.nonce,
      action: 'mnvr_ajax_load_more',
      page: page
    };

    self.loading = true;
    self.$button.prop('disabled', true).toggle(!self.settings.hideButton && self.mode == 'manual');
    self.$loader.show();

    $.post(mnvr_loadmore.url, data, function(res){
      self.trigger('update', res.data);
      self.setPage(page);

    }).fail(function(){
      console.error('load more ajax call failed');

    }).always(function(){
      self.loading = false;
      self.$loader.hide();
      self.$button.prop('disabled', false).toggle(self.mode == 'manual');

    });
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
