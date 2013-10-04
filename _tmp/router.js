(function router(){
  var hash = window.location.hash.substr(1),
      template = hash.length ? hash : 'front';

  // load contents from template file
  $('#page-content').load('templates/' + template + '.html', function(e){
    $(this).trigger('templateloaded');
  });
  window.scrollTo(0,0);

  // set active trail on navigation
  $('.nav a').removeClass('active-trail').filter('[href="/'+ hash +'"]').addClass('active-trail');

  // set current router as class to body
  $('body').removeClass().addClass(template == 'front' ? 'front' : 'page-' + template);

  // expose the current router to check upon in other scripts
  window.currentRoute = template;

  // do it again when hash changes
  $(window).on('hashchange', router);
})();
