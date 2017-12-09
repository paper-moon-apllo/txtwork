// GULP
var gulp = require('gulp');
var gulpwatch = require('gulp-watch');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var textlint = require('gulp-textlint');
var runSequence = require('run-sequence');
var rimraf = require('rimraf');
// MY PLUGIN
var textminify = require('./gulp_plugin/text_minify'); // 先頭に./を記述
var consoleout = require('./gulp_plugin/console_out'); // 先頭に./を記述

// 定義
// ドキュメント配下においてある前提
const MYDOC = __dirname.replace(/\\Documents\\.+/, "/").replace(/\\/g, "/");
const TXTS = [
    MYDOC + '*/doc/**/txt/**/*.txt'
];
let TargetTexts_Sync = TXTS;

//COMP
gulp.task('default', ['test']);

//WATCH
gulp.task('watch',
function() {
    gulpwatch(TXTS, function(event){
        TargetTexts_Sync = event.path;
        runSequence('dist');
    });
});

//////////////////////////////
//SOLO
//////////////////////////////
gulp.task('clean', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('init', function(){
    if(!TargetTexts_Sync) {
        TargetTexts_Sync= TXTS;
    }
    console.log("Task Start with Dirs:" + TargetTexts_Sync);
});

gulp.task('test', ['init'], function(){
    gulp.src(TargetTexts_Sync)
    .pipe(textlint())
});

gulp.task('backup', ['test'], function(){
    const time_str = new Date().getTime();
    gulp.src(TargetTexts_Sync)
    .pipe(rename({
        // バックアップ用ファイル名
        extname: '.'+ time_str +'.txt'
    }))
    .pipe(gulp.dest('./dist/bk'))
});

gulp.task('dist', ['backup'], function(){
    gulp.src(TargetTexts_Sync)
    .pipe(textminify())
    .pipe(gulp.dest('./dist'));
});

