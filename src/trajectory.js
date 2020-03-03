"use strict";

/**
 * Based off of [the offical Google document](https://developers.google.com/maps/documentation/utilities/polylinealgorithm)
 *
 * Some parts from [this implementation](http://facstaff.unca.edu/mcmcclur/GoogleMaps/EncodePolyline/PolylineEncoder.js)
 * by [Mark McClure](http://facstaff.unca.edu/mcmcclur/)
 *
 * @module trajectory
 */

var JSBI = require("jsbi/dist/jsbi-cjs.js");

var trajectory = {};

var BIG_0 = JSBI.BigInt(0);
var BIG_1 = JSBI.BigInt(1);
var BIG_5 = JSBI.BigInt(5);
var BIG_0x20 = JSBI.BigInt(0x20);
var BIG_0x1f = JSBI.BigInt(0x1f);
var BIG_63 = JSBI.BigInt(63);

var _py2_round = function(value) {
  // Google's polyline encoding algorithm uses the same rounding strategy as Python 2, which is different from JS for negative values
  return Math.floor(Math.abs(value) + 0.5) * (value >= 0 ? 1 : -1);
};

function encode(current, previous, factor) {
  current = _py2_round(current * factor);
  previous = _py2_round(previous * factor);
  var coordinate = JSBI.BigInt(current - previous);
  coordinate = JSBI.leftShift(coordinate, BIG_1);
  if (current - previous < 0) {
    coordinate = JSBI.bitwiseNot(coordinate);
  }
  var output = "";
  while (JSBI.greaterThanOrEqual(coordinate, BIG_0x20)) {
    output += String.fromCharCode(
      JSBI.toNumber(
        JSBI.add(
          JSBI.bitwiseOr(BIG_0x20, JSBI.bitwiseAnd(coordinate, BIG_0x1f)),
          BIG_63
        )
      )
    );
    coordinate = JSBI.signedRightShift(coordinate, BIG_5);
  }
  output += String.fromCharCode(JSBI.toNumber(JSBI.add(coordinate, BIG_63)));
  return output;
}

var _trans = function(str, index) {
  var shift = 0,
    result = BIG_0,
    byte = null;

  do {
    byte = str.charCodeAt(index++) - 63;
    result = JSBI.bitwiseOr(
      result,
      JSBI.leftShift(
        JSBI.bitwiseAnd(JSBI.BigInt(byte), BIG_0x1f),
        JSBI.BigInt(shift)
      )
    );
    shift += 5;
  } while (byte >= 0x20);

  return {
    trans: JSBI.toNumber(
      JSBI.toNumber(JSBI.bitwiseAnd(result, BIG_1))
        ? JSBI.bitwiseNot(JSBI.signedRightShift(result, BIG_1))
        : JSBI.signedRightShift(result, BIG_1)
    ),
    index: index
  };
};

/**
 * Decodes to a [latitude, longitude] coordinates array.
 *
 * This is adapted from the implementation in Project-OSRM.
 *
 * @param {String} str
 * @param {Number} precision
 * @returns {Array}
 *
 * @see https://github.com/Project-OSRM/osrm-frontend/blob/master/WebContent/routing/OSRM.RoutingGeometry.js
 */
trajectory.decode = function(str, precision) {
  var index = 0,
    lat = 0,
    lng = 0,
    time = 0,
    traj = [],
    _tr = {},
    factor = Math.pow(10, Number.isInteger(precision) ? precision : 5);

  // Trajectory has variable length when encoded, so just keep
  // track of whether we've hit the end of the string. In each
  // loop iteration, a single location in time is decoded.
  while (index < str.length) {
    _tr = _trans(str, index);
    lat += _tr.trans;
    index = _tr.index;

    _tr = _trans(str, index);
    lng += _tr.trans;
    index = _tr.index;

    _tr = _trans(str, index);
    time += _tr.trans;
    index = _tr.index;

    traj.push([lat / factor, lng / factor, time / factor]);
  }

  return traj;
};

/**
 * Encodes the given [latitude, longitude, unix time in seconds] traj array.
 *
 * @param {Array.<Array.<Number>>} traj
 * @param {Number} precision
 * @returns {String}
 */
trajectory.encode = function(traj, precision) {
  if (!traj.length) {
    return "";
  }

  var factor = Math.pow(10, Number.isInteger(precision) ? precision : 5),
    output =
      encode(traj[0][0], 0, factor) +
      encode(traj[0][1], 0, factor) +
      encode(traj[0][2], 0, factor);

  for (var i = 1; i < traj.length; i++) {
    var a = traj[i],
      b = traj[i - 1];
    output += encode(a[0], b[0], factor);
    output += encode(a[1], b[1], factor);
    output += encode(a[2], b[2], factor);
  }

  return output;
};

if (typeof module === "object" && module.exports) {
  module.exports = trajectory;
}
