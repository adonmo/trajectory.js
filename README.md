[![Test Status](https://github.com/adonmo/trajectory.js/workflows/Tests/badge.svg)](https://github.com/adonmo/pytrajectory/actions) [![MIT License](https://img.shields.io/github/license/adonmo/trajectory.js.svg)](https://github.com/adonmo/trajectory.js/blob/master/LICENSE)

# trajectory.js

A simple [google-esque polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm) inspired
implementation in Javascript, extended to trajectory data structure (an additional time dimension added to the GPS coordinates). Compatible with nodejs (`npm install trajectory.js` and the browser (copy `src/trajectory.js`)).

Encodes/decodes into [lat, lng, unix time in seconds] tuples.

This library is heavily based on https://github.com/mapbox/polyline (In fact it is built on top of fork of it)

## Installation

    npm install trajectory.js

## Example

```js
var trajectory = require('trajectory.js');

// returns an array of (lat, lon, unix time in seconds) tuples
trajectory.decode('_p~iF~ps|U_ynpijgz~G_ulLnnqC_c`|@_mqNvxq`@__t`B');

// returns an array of (lat, lon, unix time in seconds) tuples from trajectory6 by passing a precision parameter
trajectory.decode('_izlhA~rlgdF_c}mhpro}xA_{geC~ywl@_gjaR_kwzCn`{nI__qo]', 6);

// returns a string-encoded trajectory
trajectory.encode([[38.5, -120.2, 1582482601], [40.7, -120.95, 1582482611], [43.252, -126.453, 1582482627]]);

```

## API Documentation

### trajectory.decode(string[, precision])

Takes a string representation of 1+ coordinate pairs
and returns an array of (lat, lon, unix time in seconds) arrays. If not specified,
precision defaults to 5.

### trajectory.encode(array[, precision])

Takes an array of (lat, lon, unix time in seconds) arrays and returns an encoded
string. If not specified, precision defaults to 5.

## Command line

Install globally or run `./node_modules/.bin/trajectory`.

Send input via stdin and use `--decode`, `--encode` flags. If omitted will default to `--decode`.

Example :

```sh
$ echo '_p~iF~ps|U_ynpijgz~G_ulLnnqC_c`|@_mqNvxq`@__t`B' | ./bin/trajectory.bin.js

$ echo '[[38.5,-120.2,1582482601],[40.7,-120.95,1582482611],[43.252,-126.453,1582482627]]' | ./bin/trajectory.bin.js --encode
```

## Contributing

Issues and pull requests are welcome.

* For proposing new features/improvements or reporting bugs, [create an issue](https://github.com/adonmo/trajectory.js/issues/new/choose).
* Check [open issues](https://github.com/adonmo/trajectory.js/issues) for viewing existing ideas, verify if it is already proposed/being worked upon.
* When implementing new features make sure to add relavant tests and documentation before sending pull requests.
