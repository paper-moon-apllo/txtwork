// GULP
var gulp = require('gulp');
var gulpwatch = require('gulp-watch');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var exec = require('gulp-exec');
var runSequence = require('run-sequence');
// GENERAL
var rimraf = require('rimraf');
var argv = require('yargs').argv;
// TEXTLINT
var textlint = require('gulp-textlint');
// MY PLUGIN
var textminify = require('./gulp_plugin/text_minify'); // 先頭に./を記述
var consoleout = require('./gulp_plugin/console_out'); // 先頭に./を記述

// 定義
// ドキュメント配下においてある前提
const MYDOC = __dirname.replace(/\\Documents\\.+/, "/").replace(/\\/g, "/");
const TXTS = [
    MYDOC + 'Google ドライブ/doc/**/txt/**/*.txt'
];
let TargetTexts_Sync = TXTS;

//COMP
gulp.task('default', ['test']);

//WATCH
gulp.task('watch', function() {
    gulpwatch(TXTS, function(event){
        TargetTexts_Sync = event.path;
        runSequence('backup', 'test');
    });
});

//////////////////////////////
//SOLO
//////////////////////////////
gulp.task('clean', function (cb) {
  rimraf('./dist', cb);
});

gulp.task('backup', function(){
    const time_str = new Date().getTime();

    return gulp.src(TargetTexts_Sync)
    .pipe(rename(function(path){
        // バックアップ用ファイル名
        path.extname = '.'+ time_str +'.txt';
    }))
    .pipe(gulp.dest('./dist/bk'))
});

gulp.task('get_param', function(){
    var src = argv.t;
    if (src) {
        TargetTexts_Sync = src;
    }
})

gulp.task('test', ['get_param'], function(){
    return gulp.src(TargetTexts_Sync)
    .pipe(plumber({
        errorHandler: function(err) {
//            console.log(err.messageFormatted);
            this.emit('end');
        }
    }))
    .pipe(textlint())
});

gulp.task('test_dist', ['test'], function(){
    return gulp.src(TargetTexts_Sync)
    .pipe(plumber({
        errorHandler: function(err) {
            this.emit('end');
        }
    }))
    .pipe(textlint({
        "configFile": ".textlintrc_dist"
    }))
});

gulp.task('dist', ['test_dist'], function(){
    return gulp.src(TargetTexts_Sync)
    .pipe(textminify())
    .pipe(gulp.dest('./dist'))
    .pipe(exec('node node_modules//textlint//bin//textlint.js -c .textlintrc_format --fix "<%= file.path %>"'))
});
