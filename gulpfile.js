var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var compass = require('gulp-compass');
var replace = require('gulp-replace');
var jade = require('gulp-jade');
var changed = require('gulp-changed');

// 路徑變數
var paths = {
    destDir: 'dist',
    sass: 'src/sass/**/*.sass',
    jade: 'src/**/*.jade',
    html: 'src/**/*.html',
    javascripts: 'src/javascripts/**/*.js',
    destCSS: 'dist/css',
    destJS: 'dist/javascripts'
};

// Error handeler
var onError = function (err) {  
    console.log('//////////////////////////////');
    gutil.log(gutil.colors.yellow(err.message));
    console.log('//////////////////////////////');
    //gutil.beep();
    browserSync.notify(err.message, 5000);
};



gulp.task('compass', function() {
  return gulp.src(paths.sass)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(compass({
      // config_file: './config.rb',
      style: 'compressed',
      css: paths.destCSS,
      sass: 'src/sass',
      require: ['susy'],
      sourcemap: true
    }))
    .pipe(gulp.dest( paths.destCSS))
    .pipe(reload({stream:true}));
});

gulp.task('jade', function() {
  return gulp.src(paths.jade)
    .pipe(plumber({
        errorHandler: onError
      }))
    .pipe(changed(paths.html, {extension: '.html'}))
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.destDir))
});


gulp.task('copy', function(){
    return gulp.src([ 'src/index.html' ], { base: 'src' } )
    .pipe(gulp.dest(paths.destDir));
})

// Get the library code to build directory
gulp.task('get-lib', function() {
  return gulp.src('./src/assets/**', {base: './src'})
    .pipe(gulp.dest('./dist/'));
});

// Watch files
gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade', 'bs-reload']);
  gulp.watch(paths.javascripts, ['bs-reload']);
  gulp.watch(paths.sass, ['compass']);
  gulp.watch('./src/assets/**', ['get-lib']);
});


// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['compile', 'watch'] , function() {
  browserSync({
    server: {
      baseDir: './dist/'
    },
    port: 8888,
    watchOptions: {debounceDelay: 1000}
  })
});

gulp.task('compile', ['get-lib', 'compass', 'jade']);
gulp.task('build', ['compile', 'browser-sync']);
gulp.task('default', ['build']);
