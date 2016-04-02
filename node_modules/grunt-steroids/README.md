# grunt-steroids [![NPM version](http://img.shields.io/npm/v/grunt-steroids.svg)](https://www.npmjs.org/package/grunt-steroids) [![Dependency Status](http://img.shields.io/david/AppGyver/grunt-steroids.svg)](https://david-dm.org/AppGyver/grunt-steroids)

> Steroids CLI default Grunt tasks.

## Getting Started
This plugin requires Grunt `0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process and we've published this to the NPM repository, you may install this plugin with this command:

```shell
npm install grunt-steroids --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-steroids');
```

Note that the above line is included in your Steroids project's default `Gruntfile.js` and is required for `$ steroids connect` to work.

## The "steroids-make" task

Builds the `dist/` directory that is then packaged and sent to connected devices by Steroids CLI.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Releasing

1) Update `CHANGELOG.md`
2) Tag next npm version: `npm version <level>`
3) Publish: `npm publish`
