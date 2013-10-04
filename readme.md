=============
INSTRUCTIONS:
=============

1. make sure node and npm are installed on your system (http://nodejs.org/)
2. if grunt is not yet installed run 'sudo npm install -g grunt-cli' (http://gruntjs.com/getting-started)
3. if bower is not yet installed run 'sudo npm install -g bower' (http://bower.io/)
4. cd into project folder
5. run 'npm install'
6. run 'bower install'
7. fire up a local dev server via node or apache (http://simbco.github.io/httpster/)
8. good to go!


=================
FOLDER STRUCTURE:
=================

/_tmp
Contains all temporary files like images normally provided by CMS software and the router.js file that takes care of the navigation of the site.
This folder can be ignored when implementing a CMS.

/assets
Images, fonts and other assets.

/components
All bower components. Automatically created by bower when running 'bower install'.

/dist
Contains all files needed to be delivered to the browser. Automatically created by grunt.

/node_modules
All node mobules. Automatically created by npm when running 'npm install'.

/scripts
Uncompressed javascript files. Grunt will create an uglified version into the /dist folder. (see Gruntfile.js)

/styles
LESS files. Grunt will process these into compressed CSS files into the /dist folder. (see Gruntfiles.js)

/templates
Contains all content pages as html files. Can be ignored when implementing a CMS.
