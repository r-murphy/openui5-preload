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

/* eslint-env mocha */

const fse = require('fs-extra')
const path = require('path')
const fileContentAssert = require('./asserts/fileContentAssert')
const preload = require('..')

const outputDir = path.join(__dirname, 'preload', 'output')
fse.emptyDirSync(outputDir)

const types = [
  {
    name: 'Component',
    key: 'components',
    fixture: 'app',
    prefix: 'my/app',
    suffix: 'js'
  },
  {
    name: 'library',
    key: 'libraries',
    fixture: 'library',
    prefix: 'my/ui/lib',
    suffix: 'json',
    compatVersion: 'json'
  }
]

const scenarios = [
  {
    name: 'default_options'
  },
  {
    name: 'no_compress',
    no_compress: true
  },
  {
    name: 'resource_prefix',
    prefix: true
  },
  {
    name: 'compat_1.40',
    compatVersion: '1.40',
    suffix: 'js' // override types.suffix
  },
  {
    name: 'compat_1.71',
    compatVersion: '1.71',
    suffix: 'js' // override types.suffix
  }
]

describe('openui5_preload', () => {
  for (const type of types) {
    describe(type.name, () => {
      for (const scenario of scenarios) {
        it(scenario.name, async() => {
          await runIt(type, scenario)
          await assertIt(type, scenario)
        })
      }
    })
  }
})

async function runIt(type, scenario) {
  const options = {
    dest: path.join(outputDir, `${type.name.toLowerCase()}_${scenario.name}`)
  }
  const src = path.join('test/preload/fixtures', type.fixture)
  if (scenario.prefix) {
    options[type.key] = type.prefix
    options.resources = [{
      cwd: path.join(src, type.prefix),
      prefix: type.prefix
    }]
  } else {
    options[type.key] = '**'
    options.resources = src // array or string accepted
  }
  if (scenario.no_compress) {
    options.compress = false
  }
  if (scenario.compatVersion) {
    options.compatVersion = scenario.compatVersion
  }
  await preload(options)
}

async function assertIt(type, scenario) {
  const preloadPath = getPreloadFilePath(type, scenario)
  await fileContentAssert.equal({
    sActualFileSource: path.join(outputDir, preloadPath),
    sExpectedFileSource: path.join('test/preload/expected', preloadPath),
    sMessage: 'preload should be correctly created.'
  })
}

function getPreloadFilePath(type, scenario) {
  // i.e. component_default_options/my/app/Component-preload.js
  return path.join(...[
    `${type.name.toLowerCase()}_${scenario.name}`,
    ...(scenario.prefix ? [] : [type.prefix]), // If prefix was passed to preload(), it won't be in the output path
    `${type.name}-preload.${scenario.suffix || type.suffix}`
  ])
}
