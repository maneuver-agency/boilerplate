## Instructions

1. Make sure node, yarn and composer are installed globally on your system.

2. Run the following command:
  ```
  npm start
  ```
  Or you can run `composer install` and `npm install` separately.

3. Open gulpfile.js and change the setting variables accordingly.

4. Open package.json and change the 'deploy' or 'stage' scripts with the correct parameters.

5. Kickstart the automation and watch regular updated files (styles, scripts and images):
  ```
  gulp watch
  ```
  Or use browser-sync with (be sure to set 'dev-url'):
  ```
  gulp bs-watch
  ```

6. Deploy to staging server:
  ```
  npm run stage
  ```
  Or to production server:
  ```
  npm run deploy
  ```


## Development

Add new packages:
```
yarn add <package> --dev
```
