exports.i = function(msg) {
  console.info(new Date().toISOString() + ' [INFO]: ' + msg);
};

exports.d = function(obj, enable) {
  if (enable) {
    console.log(new Date().toISOString() + ' [DEBUG]: start >>>>>');
    console.dir(obj);
    console.log('<<<<< end');
  }
};

exports.e = function(msg) {
  console.error(new Date().toISOString() + ' [ERROR]: ' + msg);
};
