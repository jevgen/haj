'use strict';var gulp = require('gulp'),    child = require('child_process'),    gulpUtil = require('gulp-util'),    sass = require('gulp-sass'),    autoprefixer = require("gulp-autoprefixer"),    cssnano = require('gulp-cssnano'),    concat = require('gulp-concat'),    uglify = require('gulp-uglify');function jekyllLogger(buffer) {    buffer.toString()        .split(/\n/)        .forEach((message) => gulpUtil.log('Jekyll: ' + message));}function onError(err) {    console.log(err);    this.emit('end');}/* Development */gulp.task('scss', function () {    return gulp.src('_sass/app.scss')        .pipe(sass())        .on('error', onError)        .pipe(gulp.dest('assets'))});gulp.task('jekyll-serve', function () {    gulp.watch("_sass/**/*.scss", ["scss"]);    var jekyllServe = child.spawn('jekyll', ['serve', '--watch', '--drafts']);    jekyllServe.stdout.on('data', jekyllLogger);    jekyllServe.stderr.on('data', jekyllLogger);});gulp.task("watch", function () {    gulp.watch("_sass/**/*.scss", ["scss"]);});/* Build tasks */// Script pathsvar jsFiles = [        'assets/js/jquery.js',        'assets/js/tether.js',        'assets/js/bootstrap.js',        'assets/js/anime.js',        'assets/js/app.js',        'assets/js/salvattore.js'    ],    jsDest = 'assets/js';gulp.task('js-prod', function () {    return gulp.src(jsFiles)        .pipe(concat('bundle.js'))        .pipe(uglify())        .pipe(gulp.dest(jsDest));});gulp.task('scss-prod', function () {    return gulp.src('_sass/app.scss')        .pipe(sass())        .on('error', onError)        .pipe(autoprefixer({            browsers: ['last 2 versions', 'ie >= 8']        }))        .pipe(cssnano())        .pipe(gulp.dest('assets'))});gulp.task('jekyll-clean', function () {    var jekyllBuild = child.spawn('jekyll', ['clean']);    jekyllBuild.stdout.on('data', jekyllLogger);    jekyllBuild.stderr.on('data', jekyllLogger);});gulp.task('jekyll-build', ['js-prod', 'scss-prod', 'jekyll-clean'], function () {    var jekyllBuild = child.spawn('jekyll', ['build']);    jekyllBuild.stdout.on('data', jekyllLogger);    jekyllBuild.stderr.on('data', jekyllLogger);});