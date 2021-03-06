var sjcl = require('sjcl');
var BigInteger = require('jsbn');

function filterErr(code, done) {
  return function(e) {
    done(e.code !== code ? e : void(0));
  };
};

function throwErr(done) {
  return function(e) {
    if (e) {
      throw e;
    }
    done();
  };
};

function trace(comment, func) {
  return function() {
    console.log('%s: %s', trace, arguments.toString);
    func(arguments);
  };
};

function arraySet(count, value) {
  var a = new Array(count);

  for (var i=0; i<count; i++) {
    a[i] = value;
  }

  return a;
};

function hexToString(h) {
  var a = [];
  var i = 0;

  if (h.length % 2) {
    a.push(String.fromCharCode(parseInt(h.substring(0, 1), 16)));
    i = 1;
  }

  for (; i<h.length; i+=2) {
    a.push(String.fromCharCode(parseInt(h.substring(i, i+2), 16)));
  }

  return a.join('');
};

function stringToHex(s) {
  var result = '';
  for (var i=0; i<s.length; i++) {
    var b = s.charCodeAt(i);
    result += b < 16 ? '0' + b.toString(16) : b.toString(16);
  }
  return result;
};

function stringToArray(s) {
  var a = new Array(s.length);

  for (var i=0; i<a.length; i+=1) {
    a[i] = s.charCodeAt(i);
  }

  return a;
};

function hexToArray(h) {
  return stringToArray(hexToString(h));
};

function chunkString(str, n, leftAlign) {
  var ret = [];
  var i=0, len=str.length;

  if (leftAlign) {
    i = str.length % n;
    if (i) {
      ret.push(str.slice(0, i));
    }
  }

  for(; i<len; i+=n) {
    ret.push(str.slice(i, n + i));
  }

  return ret;
};

function assert(assertion, msg) {
  if (!assertion) {
    throw new Error('Assertion failed' + (msg ? ': ' + msg : '.'));
  }
};

/**
 * Return unique values in array.
 */
function arrayUnique(arr) {
  var u = {}, a = [];

  for (var i=0, l=arr.length; i<l; i++){
    var k = arr[i];
    if (u[k]) {
      continue;
    }
    a.push(k);
    u[k] = true;
  }

  return a;
};

/**
 * Convert a stellar epoch to a JavaScript timestamp.
 *
 * JavaScript timestamps are unix epoch in milliseconds.
 */
function toTimestamp(rpepoch) {
  return (rpepoch + 0x386D4380) * 1000;
};

/**
 * Convert a JavaScript timestamp or Date to a Stellar epoch.
 *
 * JavaScript timestamps are unix epoch in milliseconds.
 */
function fromTimestamp(rpepoch) {
  if (rpepoch instanceof Date) {
    rpepoch = rpepoch.getTime();
  }

  return Math.round(rpepoch / 1000) - 0x386D4380;
};

/**
 *  Exponentially increases the average time between tries.
 *
 * @param {Number} tries The number of times that an action was tried, but failed.
 * @param {Number} [gain] The constant used to linearly transform (multiply to) the time.
 * @param {Number} [offset] The constant used to linearly offset (add to) the time.
 */
function expBackoff(tries, gain, offset) {
  gain = gain || 1;
  offset = offset || 0;

  // http://en.wikipedia.org/wiki/Exponential_backoff
  var t = Math.random() * (Math.pow(2, tries) - 1);

  // https://code.google.com/p/google-http-java-client/wiki/ExponentialBackoff
  return offset + gain * t;
}

exports.time = {
  fromStellar: toTimestamp,
  toStellar: fromTimestamp
};

exports.trace         = trace;
exports.arraySet      = arraySet;
exports.hexToString   = hexToString;
exports.hexToArray    = hexToArray;
exports.stringToArray = stringToArray;
exports.stringToHex   = stringToHex;
exports.chunkString   = chunkString;
exports.assert        = assert;
exports.arrayUnique   = arrayUnique;
exports.toTimestamp   = toTimestamp;
exports.fromTimestamp = fromTimestamp;
exports.expBackoff    = expBackoff;
