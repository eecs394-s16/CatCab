
COMPOSER_MODULE_INSTALLATION_DIRNAME = 'composer_modules'
COMPOSER_MODULE_DIST_DIRNAME = 'modules'

module.exports = (grunt) ->

  fs = require 'fs'

  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-copy-module-dependencies", "Copy Composer modules from composer_modules/ to dist/", ->

    moduleDir = pickModuleDependencyDirectory()

    if !moduleDir?
      grunt.log.debug "No module dependencies found"

    else
      grunt.extendConfig
        copy:
          'composer-modules':
            expand: true
            cwd: moduleDir
            src: '**/*'
            dest: "dist/#{COMPOSER_MODULE_DIST_DIRNAME}/"

      grunt.task.run "copy:composer-modules"

  pickModuleDependencyDirectory = ->
    steroidsAppModuleDir = "./#{COMPOSER_MODULE_INSTALLATION_DIRNAME}"
    developmentHarnessModuleDir = "../#{COMPOSER_MODULE_INSTALLATION_DIRNAME}"
    if fs.existsSync developmentHarnessModuleDir
      developmentHarnessModuleDir
    else if fs.existsSync steroidsAppModuleDir
      steroidsAppModuleDir
    else
      null
