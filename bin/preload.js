#! /usr/bin/env node

'use strict';

var preload = require('../lib/preload');

function arg(alias, describe) {
	return {
		alias: alias,
		describe: describe
	};
}

function barg(alias, describe, def) {
	return {
		alias: alias,
		describe: describe,
		boolean: true,
		"default": def
	};
}

var args = require('yargs').options({
	r: arg('resources', 'path to the component or lib'),
	d: arg('dest', 'destimation folder, before lib path'),
	m: barg('minify', 'minify the js', false),
	v: barg('verbose', 'verbose logging', false),
	c: arg('components', 'components glob'),
	l: arg('libraries', 'libraries glob')
})
.example('$0 -r app -d preload/ -c "**" -v')
.help('h')
.alias('m', 'compress')
.demand(['r','d'])
.check(function(args) {
	if (!args.c || args.l) {
		throw new Error('Please provide "components" and/or "libraries" argument');
	}
	return true;
})
.argv;

args.compress = args.minify;
preload(args);
