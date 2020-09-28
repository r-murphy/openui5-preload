/*!
* This logger api is a sub-set of grunt's @ http://gruntjs.com/api/grunt.log
* with the methods used by preload.js.
* So the grunt logger can passed in and used instead.
*/
const { bold, cyan, green } = require('chalk')

class Logger {
  constructor(enabled) {
    this.setEnabled(enabled)
  }

  setEnabled(enabled) {
    this.enabled = !!enabled
    return this
  }

  write(msg) {
    this.enabled && process.stdout.write(msg)
    return this
  }

  writeln(...args) {
    this.log(...args)
    return this
  }

  subhead(msg) {
    this.log(bold(msg))
    return this
  }

  writeflags(obj, prefix) {
    this.log(prefix, cyan(JSON.stringify(obj)))
    return this
  }

  ok(msg) {
    this.log(green(msg || 'OK'))
    return this
  }

  log(...args) {
    this.enabled && console.log.apply(this, args)
  }
}

module.exports = {
  verbose: new Logger(false),
  log: new Logger(true)
}
