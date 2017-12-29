// GULP
var gulp = require('gulp');
var gulpIgore = require('gulp-ignore');
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
    MYDOC + 'Google ドライブ/doc/**/txt/**/*[0-9].txt'
];
let TargetTexts_Sync = TXTS;

//COMP
gulp.task('default', ['test']);

//WATCH
gulp.task('watch', function() {
    gulpwatch(TXTS, function(event){
        TargetTexts_Sync = event.path;
        runSequence('backup', 'test');

        let strm = gulp.src(TargetTexts_Sync)
            .pipe(gulpIgore.exclude(function(file){
                var contents = String(file.contents);
                return ! contents.match(/(REL:|ＲＥＬ：)/g);
            }));
        
        strm = doTest(strm, '.textlintrc_dist');
        strm = doDist(strm);
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
    return doTest(
        gulp.src(TargetTexts_Sync)
    );
});

gulp.task('test_dist', ['test'], function(){
    return doTest(
        gulp.src(TargetTexts_Sync),
        '.textlintrc_dist'
    );
});

gulp.task('dist', ['test_dist'], function(){
    return doDist(
        gulp.src(TargetTexts_Sync)
    );
});

//////////////////////////////
//DO TASK
//////////////////////////////
function doTest(strm, conf){
    let setting;
    if(conf){
        setting = {
            "configFile": conf
        };
    }
    return strm
        .pipe(plumber({
            errorHandler: function(err) {
                this.emit('end');
            }
        }))
        .pipe(textlint(setting));
}

function doDist(strm){
    // del old


    return strm
        .pipe(textminify())
        .pipe(gulp.dest('./dist'))
        .pipe(exec('node node_modules//textlint//bin//textlint.js -c .textlintrc_format --fix "<%= file.path %>"'));    
}
