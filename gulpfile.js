var gulp        = require('gulp');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// Js-concat-uglify
gulp.task('js', function() {
    gulp.src(['src/*.js'])
        .pipe(concat('laseo.js'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream:true}));
});

// Static server
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

// Reload all browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Task for `gulp` command
gulp.task('default',['browser-sync'], function() {
    gulp.watch('src/*.js',['js']);
    gulp.watch("*.html", ['bs-reload']);
});