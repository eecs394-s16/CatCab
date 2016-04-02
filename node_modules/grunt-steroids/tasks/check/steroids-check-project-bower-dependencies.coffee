fs = require 'fs'
path = require 'path'
chalk = require 'chalk'

module.exports = (grunt) ->
  promptDependency = (dependency, dir) ->
    # Is this really reasonable? Why not offer chance to run bower install instead?
    console.log "#{chalk.bold.red("ERROR")}: bower dependency #{dependency} doesn't exist in #{dir}"
    console.log "       To install dependencies run #{chalk.bold("$ steroids update")}"

  grunt.registerTask "steroids-check-project-bower-dependencies", ->
    options = @options {
      bowerfile: './bower.json'
      directory: 'www/components'
    }

    componentDir = (dependency) ->
      path.join options.directory, dependency

    bowerJson = grunt.file.readJSON options.bowerfile
    for dependency, source of bowerJson.dependencies
      dir = componentDir dependency
      unless fs.existsSync dir
        promptDependency dependency, dir
        process.exit(1)

    console.log "Project has bower dependencies installed... #{chalk.green "OK"}"
