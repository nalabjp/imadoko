exports.i = function(msg) {
  console.info(new Date().toString() + ' [INFO]: ' + msg);
};

exports.d = function(obj, enable) {
  if (enable) {
    console.log(new Date().toString() + ' [DEBUG]: start >>>>>');
    console.dir(obj);
    console.log('<<<<< end');
  }
};

exports.e = function(msg) {
  console.error(new Date().toString() + ' [ERROR]: ' + msg);
};
