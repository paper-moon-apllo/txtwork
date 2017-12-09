var through = require('through2');
var PLUGIN_NAME = 'console_out';

module.exports = function(str) {
  /**
   * @this {Transform}
   */
  var transform = function(file, encoding, callback) {
    // 文字出力
    console.log(new Date().toTimeString() + ":" + str);

    // 処理の完了を通知
    return callback(null, file);
  };

  return through.obj(transform);
};
