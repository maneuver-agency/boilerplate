const settings = require('./app.config.js')

const gulp = require('gulp')
const gutil = require('gulp-util')
const rsync = require('gulp-rsync')
const argv = require('minimist')(process.argv)

/**********/
/* DEPLOY */
/**********/
gulp.task('deploy', function () {
  let rsyncPaths = [settings.outputDir + '/**/*']
  let rsyncConf = {
    relative: true,
    clean: true,
    recursive: true,
    compress: true,
    silent: true,
    exclude: ['**/*.map']
  }

  if (!argv.production && !argv.staging) {
    throwError('deploy', gutil.colors.red('Missing or invalid target. Use --production or --staging.'))
  }

  let target = argv.production ? 'production' : argv.staging ? 'staging' : ''
  target = settings.connection[target]

  rsyncConf.hostname = target.host
  rsyncConf.username = target.username
  rsyncConf.destination = target.path

  return gulp.src(rsyncPaths)
    .pipe(rsync(rsyncConf))
})

function throwError (taskName, msg) {
  throw new gutil.PluginError({
    plugin: taskName,
    message: msg
  })
}