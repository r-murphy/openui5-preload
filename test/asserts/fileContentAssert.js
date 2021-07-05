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

const assert = require('assert')
const fse = require('fs-extra')

exports.equal = async(oOptions) => {
  const sActualFileContent = (await fse.readFile(oOptions.sActualFileSource, 'utf8'))
    .replace(/\r\n/gm, '\n') // replace \r\n with \n to be consistent everywhere
    .replace(/\\r\\n/gm, '\\n') // replace \\r\\n with \\n to be consistent everywhere
    .replace(/\n$/, '') // remove the last LF;
  const sExpectedFileContent = (await fse.readFile(oOptions.sExpectedFileSource, 'utf8'))
    .replace(/\r\n/gm, '\n') // replace \r\n with \n to be consistent everywhere
    .replace(/\\r\\n/gm, '\\n') // replace \\r\\n with \\n to be consistent everywhere
    .replace(/\n$/, '') // remove the last LF

  assert.strictEqual(sActualFileContent, sExpectedFileContent, oOptions.sMessage)
}
