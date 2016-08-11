# Changelog

---

## 1.0.4 - ???

**CSS & HTML**
- Improvements to rhythm classes.
- Add .clr-primary and .clr-secondary classes to editor.scss for WP.
- Delete alternate language link tag.
- Add hero component css improvements.
- Remove box-shadow from active buttons.
- Add hero and intro sections.
- Add .center-cols class to center cols of a row horizontally.
- Rename $grid-float-breakpoint to $mobile-switch for clarity.
- Add target blank to site-socials links.

**JS**
- Improve Ninja Form module to not remove field attributes if they exist.
- Improve Load More module to allow multiple instances on 1 page.
- Improve Filter module to work without isotope.
- Improve Gmap module to use a decent class export.
- Add Object.values polyfill.
- Add Gmap lat and lng as data attributes.

**PHP**
- Add try_link twig filter to make links of phone numbers and emailadresses.
- Add link_to_gmaps twig filter.
- Rewrite lipsum filter to not use fsockopen.
- Add menus twig filter to mimic Wordpress menu functionality.

**Other**
- Add error handling to browserify gulp task.
- Add npm build script for production.
- Add npm-debug to gitignore.
- Add wp_title config entry + use that to render the meta title.
- Add 'styles' and 'scripts' blocks to base.twig.
- Bugfix: javascript variable templateDir was an absolute path instead of an URL.
- Delete facebook.jpg in assets folder.
- Add more WP options to config file.

## 1.0.3 - 13/06/2016

**CSS & HTML**
- Add .vgutters class.
- Add .col-xs-spacing class.
- Only apply .flexrow starting from screen-sm.

**Other**
- Complete rewrite of gulpfile.js.

## 1.0.2 - 04/06/2016

**CSS & HTML**
- Add rhythm helper classes.
- Add spacer-xxs and set max-width media queries for all spacers.
- Add new responsive navigation technique with the nav-more functionality.
- Add 'hero' component.
- Add 'profile' component.
- Add 'feature' component.
- Add 'logo-ribbon' component.

**Other**
- Re-organized scss files to a more senseful structure.

## 1.0.1 - 03/06/2016

**Other**
- Add maneuver-deploy-site package and npm scripts.

## 1.0.0 - 29/05/2016

**CSS & HTML**
- New sticky footer using flexbox.
- Remove png fallbacks for svg. It was only just for the likes of IE8.
- Remove font icons and use svg sprites.
- Remove layout.scss and reorganize its contents in other files.
- Add mixin for responsive spacers.
- Add xxs grid classes.
- Introduce navbar-links to get rid of paddings on links.
- Add basic site-header styling.
- Add default mobile nav styling.

**JS**
- Remove static Modernizr file and make use of npm browsernizr.
- Do not rely on Modernizr to check for sticky support. Always use javascript.
- New improved version of modules/filter.js.

**PHP**
- Introduce macros.

**Other**
- Create /src folder for, well, the source files... Duh.
- Add changelog!

---
