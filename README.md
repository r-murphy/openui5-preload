# ui5-preload

A node module and cli utility to create OpenUI5 Component-preload.js and library-preload.json files.

This is a fork of the [openui5-preload](https://github.com/r-murphy/openui5-preload), that also is a fork of the preload task from [grunt-openui5](https://github.com/sap/grunt-openui5/) with the grunt dependency removed. It behaves the same aside from some default logging differences, and has very similar options.
This package can build Component-preload.js with new compatVersion, including sap.ui.define mode.
Used in vscode extension [ui5-tools](https://github.com/CarlosOrozco88/ui5-tools).

The goal of this project is to be the core implementation usuable by vanilla node, a grunt plugin wrapper or a gulp plugin, similar to uglify-js and its corresponding gulp & grunt plugins.

*Andvanced CLI in progress (can be used now with the `-x <config_file>` option)*

## Install

From NPM for programmatic use:

    npm install ui5-preload --save-dev

OR

	yarn add ui5-preload --dev

## Usage

```javascript
var preload = require("openui5_preload");
//OR ES2015
import preload from "openui5_preload";

preload({
  resources: ['.'],
  dest: '.',
  compress: true,
  verbose: false,
  components: ['**'],
  libraries: ['**']
});
```

### Options

#### resources
Type: `String` or `Object` or `Array<String|Object>`

Resources/files that should be used as source for preload files.

Type     | Result                   | Example
-------- | ------------------------ | -------
*String* | See `Resource.cwd`.      | `'src'`
*Object* | See `Resource.*`          | `{ cwd: 'webapp', prefix: 'my/app', src: '**' }`
*Array*  | Array of `String|Object` | `[ 'src', { cwd: 'webapp', prefix: 'my/app' } ]`

##### Resource.cwd

Type: `String`

Base/root directory for finding resources.

##### Resource.prefix

Type: `String`  

Default: ` `

Directory namespace prefix that should be prepended to all found paths. This is useful if the source folder structure is not the same as the module namespace.

Example:  
`{ cwd: 'webapp', prefix: 'my/app' }`  
`webapp/foo.js` will be treated as `my/app/foo.js` instead of `foo.js`.

##### Resource.src

Type: `String` or `Array<String>`

Default:
```
[
  '**/*.js',
  '**/*.fragment.html',
  '**/*.fragment.json',
  '**/*.fragment.xml',
  '**/*.view.html',
  '**/*.view.json',
  '**/*.view.xml',
  '**/*.properties'
]
```

Glob pattern(s) for finding relevant resources inside `cwd`. If set, the default patterns will be replaced.

##### compatVersion

Type: `string`  
Default: `json`

Sets the UI5 version used for compatibility mode in the format `<major>.<minor>`, or keywords `json` or `edge`.

NOTE: Unlike SAP's grunt-openui5 (https://github.com/SAP/grunt-openui5), the default behaviour is the legacy json mode, not the edge js mode.

Example:  
When building for UI5 target version 1.38.x, use `compatVersion: '1.38'`.

#### dest

Type: `String`

Default value: `.`

Path to the dest folder in which the preload files should be created.



#### compress
Type: `boolean`  
Default value: `true`

Optional parameter to set compression/minification of the files.
- JavaScript is minified using [terser](https://github.com/terser/terser) and copyright comments are preserved (comments matching regular expression `/copyright|\(c\)|released under|license|\u00a9/i` )
- XML is minified using [pretty-data](https://github.com/vkiryukhin/pretty-data)
- JSON is parsed for correctness and to remove extra whitespace

#### verbose
Type: `boolean`  
Default value: `false`

Optional parameter to have more detailed logging.

#### components

##### `boolean`

Enable auto detection of Components. A preload file will be created for each `Component.js` file.

```js
components: true
```

##### `String` / `array` of `String`

Namespace path(s) to Component(s).

```js
components: 'my/app',
components: [ 'my/app', 'my/component']
```

##### `object`

Map with namespace path to Component as key and object as value.

```js
components: {
  'my/app': {
    src: [
      'my/app/**',
      'my/app/!ignore.js'
    ]
  }
}
```

##### src
Type: `String` / `array` of `String`  
Default: component namespace path + `/**` (e.g. `my/app/**`)

Glob pattern(s) for files that should be included into the preload.  
Patterns are based on all available resources (see [resources](#resources)).

### libraries

See [components](#components). Auto mode is looking for `library.js` files.

### Usage Examples

#### Component

Creates `dist/Component-preload.js`.

```js
preload({
  resources: {
    cwd: 'webapp',
    prefix: 'my/app'
  },
  dest: 'dist'
  components: 'my/app'
});
```

#### Library

Creates `dist/my/ui/lib/library-preload.json`.

```js
preload({
  resources: 'src',
  dest: 'dist'
  libraries: 'my/ui/lib'
});
```
