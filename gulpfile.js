var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    jshint = require('gulp-jshint');

/*****
 * JSHint task, lints the lib and test *.js files.
 *****/
gulp.task('jshint', function () {
    gulp.src(['./lib/**/*.js', './test/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

/*****
 * Test task, runs mocha against unit test files.
 *****/
gulp.task('test', function (done) {
    gulp.src(['lib/**/*.js', 'index.js'])
        .pipe(istanbul()) // Covering files
        .pipe(istanbul.hookRequire()) // Force `require` to return covered files
        .on('finish', function () {
            gulp.src(['./test/unit/**/*.test.js'])
                .pipe(mocha({
                    ui: 'bdd',
                    reporter: 'landing'
                }))
                .pipe(istanbul.writeReports()) // Creating the reports after tests runned
                .on('end', done);
        });
});

/**
 * Watches source code and runs tests on filechange
 */
gulp.task('watch', ['jshint', 'test'], function() {
    var testPaths = [
        'lib/**/*.js',
        'test/**/*.js'
    ];
    gulp.watch(testPaths, ['jshint', 'test']);
});

/*****
 * Default task, runs jshint and test tasks.
 *****/
gulp.task('default', ['jshint', 'test']);

/*****
 * CI test task, runs jshint and test tasks.
 *****/
gulp.task('testci', ['jshint', 'test']);
