
# openui5-preload

A node module and cli utility to create OpenUI5 Component-preload.js and library-preload.json files. 

This is a fork of the preload task from [grunt-openui5](https://github.com/sap/grunt-openui5/) with the grunt dependency removed. It behaves the same aside from some logging differences, and has very similar options.

The goal of this project is to be the core implementation usuable by vanilla node, a grunt plugin wrapper or a gulp plugin, similar to uglify-js and its corresponding gulp & grunt plugins.

*CLI in progress.*

## Install
    
From NPM for programmatic use:

    npm install openui5-preload --save

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
Type: `string` or `array` or `object`

Resources/files that should be used as source for preload files.

Type     | Result                             | Example
-------- | ---------------------------------- | -------
*String* | See `cwd`.                         | `'src'`
*Array*  | Array of `string` and/or `object`. | `[ 'src', { cwd: 'webapp', prefix: 'my/app' } ]`
*Object* | See `cwd`, `prefix` and `src`      | `{ cwd: 'webapp', prefix: 'my/app', src: '**' }`

##### cwd
Type: `string`

Base/root directory for finding resources.

##### prefix
Type: `string`  
Default: ` `

Directory namespace prefix that should be prepended to all found paths. This is useful if the source folder structure is not the same as the module namespace.

Example:  
`{ cwd: 'webapp', prefix: 'my/app' }`  
`webapp/foo.js` will be treated as `my/app/foo.js` instead of `foo.js`.

##### src
Type: `string` or `array` of `string`  
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

#### dest
Type: `string`  
Default value: `.`

Path to the dest folder in which the preload files should be created.

#### compress
Type: `boolean`  
Default value: `true`

Optional parameter to set compression/minification of the files.
- Javascript is minified using [UglifyJS2](https://github.com/mishoo/UglifyJS2) and copyright comments are preserved (comments matching regular expression `/copyright|\(c\)|released under|license|\u00a9/i` )
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

##### `string` / `array` of `string`

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
Type: `string` / `array` of `string`  
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

## License

[Apache License 2.0](http: //www.apache.org/licenses/LICENSE-2.0) © 2015 [Ryan Murphy]