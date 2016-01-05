'use strict';
/**
This logger api is a sub-set of grunt's @ http://gruntjs.com/api/grunt.log
*/
var chalk = require('chalk');

function Logger(enabled) {
	this.setEnabled(enabled);
}

Logger.prototype.setEnabled = function (enabled) {
	this.enabled = enabled;
	return this;
};

Logger.prototype.write = function (msg) {
	process.stdout.write(msg);
	return this;
};

Logger.prototype.writeln = function () {
	console.log.apply(console, arguments);
	return this;
};

Logger.prototype.subhead = function (msg) {
	console.log(chalk.bold(msg));
	return this;
};

Logger.prototype.writeflags = function (obj, prefix) {
	console.log(prefix, chalk.cyan(JSON.stringify(obj)));
	return this;
};

Logger.prototype.ok = function (msg) {
	console.log(chalk.green(msg || "OK"));
	return this;
};

module.exports = {
	verbose: new Logger(false),
	log: new Logger(true)
};
