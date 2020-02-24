#!/usr/bin/env node

const meow = require('meow');
const trajectory = require('../src/trajectory');

const cli = meow(
  `
  Provide data from stdin and use with --decode (default), --encode. Optionally provide precision.

  Usage
    $ cat file.json | trajectory > file.geojson
  Options
    --decode -d return an array of (lat, lon, unix time in seconds) tuples
    --encode -e return a string-encoded trajectory
    --precision, -p set a precision.
`,
  {
    flags: {
      decode: {
        type: 'boolean',
        alias: 'd'
      },
      encode: {
        type: 'boolean',
        alias: 'e'
      },
      precision: {
        type: 'string',
        alias: 'p'
      }
    }
  }
);

const {
  precision,
  decode,
  encode,
} = cli.flags;

let p;

if (precision) {
  p = parseInt(precision, 10);
}

let rawInput = '';
process.stdin.on('readable', function() {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    rawInput += chunk;
  }
});

process.stdin.on('end', function() {
  const converted = convert(rawInput);
  if (!converted) {
    exit();
  }
  process.stdout.write(`${JSON.stringify(converted)}\n`);
});

function convert(rawString) {
  if (encode) {
    return trajectory.encode(JSON.parse(rawString), p);
  }

  return trajectory.decode(rawString, p);
}

function exit() {
  process.stdout.write(cli.showHelp());
  process.exit();
}
