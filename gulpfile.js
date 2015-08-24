var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

gulp.task('default', function() {
  // place code for your default task here
});
gulp.task('compress', function() {
  return gulp.src('app/main/*.js')
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-css', function() {
  return gulp.src('app/res/css/*.css')
    .pipe(rename('app.min.css'))
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-html', function() {
  var opts = {
    conditionals: true,
    spare:true
  };

  return gulp.src('app/index.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist/'));
});

gulp.task('sass', function () {
  gulp.src('app/compass/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass:watch', function () {
  gulp.watch('app/compass/sass/*.scss', ['sass']);
});

gulp.task('default', ['minify-css', 'compress', 'minify-html']);
