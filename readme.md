## Instructions

1. Make sure node, npm, composer and bower are installed globally on your system.
2. Run the following command:
    ```
    npm start
    ```
3. Make sure gulp is installed globally.
4. Kickstart all automation with the command:
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
7. Happy coding!


## Styles

  * partials/bootstrap.scss
    Imports bootstrap files. Excluding the ones we don't need.
  * partials/layout.scss
    Main page structure. Almost always the same for every project.
  * partials/fonts.scss
    All fonts related styles.
  * partials/utils.scss
    Random utility classes.
  * main.scss
    Main stylesheet.
  * mixins.scss
    Handy mixins.
  * variables.scss
    All used variables. Any new vars? Put them here.

## Scripts

  * application.js
    All application logic. Main file to put your scripts.
  * main.js
    Used by require.js to load everything else.
  * polyfills.js
    What's in a name?
  * utils.js
    Some handy dandy stuff. Set and forget.
  * modules/*
    Seperate scripts to load when required.


## Folder Structure

/assets
Images, fonts and other assets.

/cache
Used by Twig if configured.

/dist
Contains all files needed to be delivered to the browser. Automatically created by gulp.

/scripts
Uncompressed javascript files. Gulp will create an uglified version into the /dist folder. (see gulpfile.js)

/styles
LESS files. Gulp will process these into compressed CSS files into the /dist folder. (see gulpfile.js)

/templates
Contains all content pages as html (twig) files.
