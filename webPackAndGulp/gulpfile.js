const webpack = require('webpack'),
    clean = require("gulp-clean"),
    gulp = require('gulp'),
    Q = require('q'),
    runSequence = require('run-sequence'),
    path = require("path");

var build = "./wwwroot",
    buildPath = "./wwwroot/resources/",
    webpackConfig = require("./webpack.config"),
    copyList = require("./copyFileList.json");

gulp.task("clean", function () {
    return gulp.src(build).pipe(clean());
});

gulp.task("copy", function () {
    copyList.forEach(function (value, index, array) {
        console.info(path.resolve(value.srcPath, '**'));
        console.info(value.destPath);
        var basePath = "";
        if (value.copyBaseFolder) {
            basePath = value.srcPath.substr(0, value.srcPath.lastIndexOf('/'));
        } else {
            basePath = value.srcPath;
        }
        gulp.src([path.resolve(value.srcPath, '**')], { base: basePath })
            .pipe(gulp.dest(value.destPath));
    });
});

gulp.task('buildUI', function () {
    let deferred = Q.defer();
    webpack(webpackConfig, function (err, stats) {
        if (err) {
            throw (err);
        }
        stats.hasErrors() && console.info(stats.toString({
            chunks: true,
            colors: true
        }));
        deferred.resolve();
    });
    return deferred.promise;
});

gulp.task('build', function () {
    let deferred = Q.defer();
    runSequence('clean',
        'buildUI',
        'copy',
        function () {
            deferred.resolve();
        });
    return deferred.promise;
});