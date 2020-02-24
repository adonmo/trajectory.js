'use strict';

var test = require('tap').test,
    trajectory = require('../');

test('trajectory', function(t) {
    var example = [[38.5, -120.2, 1582482601], [40.7, -120.95, 1582482611], [43.252, -126.453, 1582482627]],
        example_zero = [[39, -120, 1582482601], [41, -121, 1582482611], [43, -126, 1582482627]],
        // encoded value will enclude slashes -> tests escaping
        example_slashes = [[35.6, -82.55, 1582482601], [35.59, -82.55, 1582482602], [35.6, -82.55, 1582482603]],
        example_rounding = [[0, 0.000006, 1582482601], [0, 0.000002, 1582482602]],
        example_rounding_negative = [[36.05322, -112.084004, 1582482601], [36.053573, -112.083914, 1582482602], [36.053845, -112.083965, 1582482603]];

    t.test('#decode()', function(t) {
        t.test('decodes an empty Array', function(t) {
            t.deepEqual(trajectory.decode(''), []);
            t.end();
        });

        t.test('decodes a String into an Array of (lat/lon/unix time in seconds) tuples', function(t) {
            var output = trajectory.decode('_p~iF~ps|U_ynpijgz~G_ulLnnqC_c`|@_mqNvxq`@__t`B')
            t.deepEqual(output, example);
            t.equal(output.length, example.length);
            t.end();
        });

        t.test('decodes with a custom precision', function(t) {
            t.deepEqual(trajectory.decode('_izlhA~rlgdF_c}mhpro}xA_{geC~ywl@_gjaR_kwzCn`{nI__qo]', 6), example);
            t.end();
        });

        t.test('decodes with precision 0', function(t) {
            t.deepEqual(trajectory.decode('mAnFqiaji}AC@SCH_@', 0), example_zero);
            t.end();
        });

        t.end();
    });

    t.test('#identity', function(t) {
        t.test('feed encode into decode and check if the result is the same as the input', function(t) {
            for (let precision = 4; precision < 9; precision++) {
                t.deepEqual(trajectory.decode(trajectory.encode(example_slashes, precision), precision), example_slashes);
            }
            t.end();
        });

        t.test('feed decode into encode and check if the result is the same as the input', function(t) {
            t.equal(trajectory.encode(trajectory.decode('_chxEn`zvN\\\\]]')), '_chxEn`zvN\\\\]]');
            t.end();
        });

        t.end();
    });

    t.test('#encode()', function(t) {
        t.test('encodes an empty Array', function(t) {
            t.equal(trajectory.encode([]), '');
            t.end();
        });

        t.test('encodes an Array of (lat/lon/unix time in seconds) tuples into a String', function(t) {
            t.equal(trajectory.encode(example), '_p~iF~ps|U_ynpijgz~G_ulLnnqC_c`|@_mqNvxq`@__t`B');
            t.end();
        });

        t.test('encodes with proper rounding', function(t) {
            t.equal(trajectory.encode(example_rounding), '?A_ynpijgz~G?@_ibE');
            t.end();
        });

        t.test('encodes with proper negative rounding', function(t) {
            t.equal(trajectory.encode(example_rounding_negative), 'ss`{E~kbkT_ynpijgz~GeAQ_ibEw@J_ibE');
            t.end();
        });

        t.test('encodes with a custom precision', function(t) {
            t.equal(trajectory.encode(example, 6), '_izlhA~rlgdF_c}mhpro}xA_{geC~ywl@_gjaR_kwzCn`{nI__qo]');
            t.end();
        });

        t.test('encodes with precision 0', function(t) {
            t.equal(trajectory.encode(example, 0), 'mAnFqiaji}AC@SCH_@');
            t.end();
        });

        t.test('encodes negative values correctly', function(t) {
            t.ok(trajectory.decode(trajectory.encode([[-107.3741825, 0, 1582482600]], 7), 7)[0][0] < 0);
            t.end();
        });

        t.end();
    });

    t.end();
});
