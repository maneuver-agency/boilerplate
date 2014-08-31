## Instructions

1. Make sure node, npm, composer and bower are installed on your system.
2. Run the following commands:
    ```
    npm install
    ```
    ```
    composer install
    ```
    ```
    bower install
    ```
3. If gulp is not yet installed globally run 'sudo npm install -g gulp'.
4. Kickstart the project with the command:
    ```
    gulp
    ```
5. Watch regular updated files with: (styles, scripts and images)
    ```
    gulp watch
    ```
    Or use browser-sync with:
    ```
    gulp bs-watch
    ```
6. When adding bower components, add them in the gulfile.js to the components or modules task and then run:
    ```
    gulp components modules
    ```
7. Change some variables in config.php if needed.
8. Happy coding!


## Styles

  * bootstrap.less
    Imports bootstrap files. Excluding the ones we don't need.
  * fonts.less
    All fonts related styles.
  * main.less
    Main stylesheet.
  * mixins.less
    Handy mixins and classes.
  * vars.less
    All used variables.

## Scripts

  * application.js
    All application logic. Main file to put your scripts.
  * main.js
    Used by require.js to load everything else.
  * polyfills.js
    What's in a name?
  * utils.js
    Some handy dandy stuff. Set and forget.


## Folder Structure

/assets
Images, fonts and other assets.

/bower_components
All bower components. Automatically created by bower when running 'bower install'.

/cache
Used by Twig if configured.

/dist
Contains all files needed to be delivered to the browser. Automatically created by gulp.

/node_modules
All node mobules. Automatically created by npm when running 'npm install'.

/scripts
Uncompressed javascript files. Gulp will create an uglified version into the /dist folder. (see gulpfile.js)

/styles
LESS files. Gulp will process these into compressed CSS files into the /dist folder. (see gulpfile.js)

/templates
Contains all content pages as html (twig) files.

/vendor
Containes composer packages. Automatically created when running 'composer install'.
