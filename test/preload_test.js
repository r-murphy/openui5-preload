// Copyright 2015 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

/*eslint-env mocha */
'use strict';

var _ = require('underscore');
var path = require('path');
var rimraf = require('rimraf');
var fileContent = require('./asserts/fileContent');
var preload = require('..');

var TMP = 'tmp/preload';

rimraf.sync(TMP);

var types = {
	Component: {
		key: 'components',
		fixture: 'app',
		prefix: 'my/app',
		suffix: 'js'
	},
	library: {
		key: 'libraries',
		fixture: 'library',
		prefix: 'my/ui/lib',
		suffix: 'json'
	}
}

var scenarios = {
	'default_options': {
	},
	'no_compress': {
		'no_compress': true
	},
	'resource_prefix': {
		prefix: true
	}
};

//type and scenario are objects here
function getPreloadFilePath(type, scenario) {
	//i.e. component_default_options/my/app/Component-preload.js
	var parts = [(type.name.toLowerCase() + '_' + scenario.name)];
	if (!scenario.prefix) {
		//if prefix was passed to preload(), it won't be in the output path
		parts.push(type.prefix);
	}
	parts.push(type.name + '-preload.' + type.suffix);
	return path.join.apply(path, parts);
}

//type and scenario are objects here
function runIt(type, scenario) {
	var options = {};
	var src = path.join('test/preload/fixtures', type.fixture);
	options.dest = path.join(TMP, type.name.toLowerCase() + '_' + scenario.name);
	if (scenario.prefix) {
		options[type.key] = type.prefix;
		options.resources = [{
			cwd: path.join(src, type.prefix),
			prefix: type.prefix
		}];
	} else {
		options[type.key] = '**';
		options.resources = src; //array or string accepted
	}
	if (scenario.no_compress) {
		options.compress = false;
	}
	preload(options);
}

//type and scenario are objects here
function assertIt(type, scenario) {
	var preloadPath = getPreloadFilePath(type, scenario);
	fileContent.equal({
		sActualFileSource: path.join(TMP, preloadPath),
		sExpectedFileSource: path.join('test/preload/expected', preloadPath),
		sMessage: 'preload should be correctly created.'
	});
}

function runAndAssert(type, scenario) {
	it(scenario.name, function() {
		runIt(type, scenario);
		assertIt(type, scenario);
	});
}

function runAndAssertAllForType(type) {
	describe(type.name, function() {
		_.each(scenarios, function(scenarioConfig, scenarioName) {
			scenarioConfig.name = scenarioName;
			runAndAssert(type, scenarioConfig);
		});
	});
}

describe('openui5_preload', function() {
	_.each(types, function(typeConfig, typeName) {
		typeConfig.name = typeName;
		runAndAssertAllForType(typeConfig);
	});
});
