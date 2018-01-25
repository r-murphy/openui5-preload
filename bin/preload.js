#! /usr/bin/env node

const preload = require('../lib/preload')
const CSON = require('season')
const fs = require('fs')

const arg = (alias, describe) => ({
  alias,
  describe
})

// barg = boolean arg
const barg = (alias, describe, def) => ({
  alias,
  describe,
  boolean: true,
  default: def
})

let args = require('yargs').options({
  r: arg('resources', 'path to the component or lib'),
  d: arg('dest', 'destination folder, before lib path'),
  m: barg('minify', 'minify the js', false),
  v: barg('verbose', 'verbose logging', false),
  c: arg('components', 'components glob'),
  l: arg('libraries', 'libraries glob'),
  x: arg('config', 'config file'),
  j: barg('js', 'js mode', false)
})
  .example('$0 -r app -d preload/ -c "**" -v')
  .help('h')
  .alias('m', 'compress')
  .argv

if (args.c && fs.existsSync(args.c)) {
  console.log(`Warning: Config file was given as option 'c' but it should be 'x'.`)
  args.config = args.x = args.c
  delete args.c
  delete args.components
}

const originalArgs = args

if (args.config === true) {
  args.config = 'preload.cson'
}
if (args.config) {
  args = CSON.readFileSync(args.config)
}

if (!(args.resources && args.dest)) {
  throw new Error('"resources" and "dest" are required.')
}
if (!(args.components || args.libraries)) {
  throw new Error('Please provide "components" and/or "libraries" argument.')
}

preload({
  ...args,
  compress: args.minify,
  compatVersion: originalArgs.js ? 'edge' : 'json'
})
