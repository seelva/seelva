var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var globbing = require('gulp-css-globbing');
var autoprefixer = require('gulp-autoprefixer');
var cssImageDimensions = require('gulp-css-image-dimensions');
var greplace = require('gulp-replace');

var env = 'framework-dev'; // 'dev' | 'framework-dev'

var finalBaseDir;

switch(env) {
  case 'dev':
    finalBaseDir = './';
    break;
  case 'framework-dev':
    finalBaseDir = ['./', '../sample'];
    break;
}

gulp.task('server-start', ['sass'], function(){
  browserSync.init({
    server: {
        baseDir: finalBaseDir
    }
  });

  gulp.watch(['sass/**.scss', 'sass/**/**.scss'], ['sass']);
  gulp.watch('**.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
    gulp.src(['sass/default/**.scss'])
      .pipe(plumber({
        errorHandler: function (error) {
          console.log(error.message);
          this.emit('end');
      }}))
      .pipe(globbing({
        extensions: ['.scss']
      }))
      .pipe(greplace(/^\s*(@import\s+)?url\((["'][^"'\)]+['"])(?:\))?(;)?\s*$/gm, '$1$2$3'))
      .pipe(sass({
        includePaths: [ './scss' ],
        errLogToConsole: true,
        outputStyle: 'compact'
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions', 'ie >= 6', 'chrome >= 4', 'ff >= 3'],
        cascade: false
      }))
      .pipe(cssImageDimensions('../../images'))
      .pipe(gulp.dest('./css'))
      .pipe(browserSync.stream());
});

gulp.task('default', ['server-start']);
