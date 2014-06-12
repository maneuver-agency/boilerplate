## Instructions

1. Mke sure node, npm, composer and bower are installed on your system.
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
3. If gulp is not yet installed run 'sudo npm install -g gulp'
4. Kickstart the automation tool with the command:
    ```
    gulp
    ```
5. Happy coding!


## Folder Structure

/assets
Images, fonts and other assets.

/bower_components
All bower components. Automatically created by bower when running 'bower install'.

/dist
Contains all files needed to be delivered to the browser. Automatically created by gulp.

/node_modules
All node mobules. Automatically created by npm when running 'npm install'.

/scripts
Uncompressed javascript files. Gulp will create an uglified version into the /dist folder. (see gulpfile.js)

/styles
LESS files. Gulp will process these into compressed CSS files into the /dist folder. (see gulpfile.js)

/templates
Contains all content pages as html files.

/vendor
Containes composer packages.
