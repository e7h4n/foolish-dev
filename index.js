#!/usr/bin/env node
'use strict';

var gulp = require('gulp');
var order = require('gulp-order');
var through2 = require('through2');
var fs = require('fs');

gulp.task('build', function () {
    var files = [];
    return gulp.src([
        '**/*.js',
        '!node_modules/**/*.*',
        '!**/gulpfile.js',
        '!dist/**/*.*',
    ], {
        read: false
    }).pipe(order([
        'main.js',
        '!run.js'
    ])).pipe(through2.obj(function (obj, enc, cb) {
        files.push(obj.relative);
        cb();
    }, function (done) {
        var fileJson = JSON.stringify(files);

        var fileContent = `
        (function () {
            var files = ${fileJson};
            var currentScript = document.currentScript;
            var path = currentScript.getAttribute('src');
            path = path.substr(0, path.lastIndexOf('/') + 1);

            files.forEach(function (file) {
                document.write('<script src="' + path + '../' + file + '"></script>');
            });
        }());
        `

        fs.writeFile('dist/app.dev.js', fileContent, done);
    }));
});

gulp.start('build');
