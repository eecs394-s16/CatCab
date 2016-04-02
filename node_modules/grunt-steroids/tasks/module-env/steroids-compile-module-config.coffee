fs = require "fs"

module.exports = (grunt) ->
  grunt.registerTask "steroids-compile-module-config", ->
    grunt.task.run [
      'steroids-compile-env-js'
      'steroids-compile-appgyver-js'
    ]

  grunt.registerTask 'steroids-compile-env-js', ->
    context = pickConfigContext()
    envConfigFilename = "#{context.configDir}/env.json"

    if !(fs.existsSync envConfigFilename)
      if context.isModule
        throw new Error "Please run `cd .. && steroids module init` to create #{envConfigFilename}"
      else
        return

    compileConfiguration(
      envConfigFilename
      "#{__dirname}/templates/env.js"
      "dist/env.js"
    )

  grunt.registerTask 'steroids-compile-appgyver-js', ->
    context = pickConfigContext()
    appgyverAppConfigFilename = "#{context.configDir}/appgyver.json"

    unless fs.existsSync appgyverAppConfigFilename
      if context.isModule
        throw new Error "Please run `cd .. && steroids module refresh` to create #{appgyverAppConfigFilename}"
      else
        return

    compileConfiguration(
      appgyverAppConfigFilename
      "#{__dirname}/templates/appgyver.js"
      "dist/appgyver.js"
    )

  pickConfigContext = ->
    if fs.existsSync "../config"
      { configDir: "../config", isModule: true }
    else if fs.existsSync "./config"
      { configDir: "./config", isModule: false }
    else
      throw new Error "Must be ran in a Steroids application or a Steroids Enterprise Module"

  compileConfiguration = (configPath, templatePath, distPath) ->
    config = grunt.file.readJSON configPath
    compiledConfig = grunt.util._.template(grunt.file.read templatePath) {
      config: config
    }
    grunt.file.write distPath, compiledConfig
    grunt.log.ok "Wrote #{distPath}"
