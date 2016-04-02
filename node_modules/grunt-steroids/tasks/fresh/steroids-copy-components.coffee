
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-copy-components", "Copy bower components from bower_components/ to dist/", ->

    grunt.extendConfig
      copy:
        components:
          expand: true
          cwd: 'bower_components'
          src: '**/*'
          dest: 'dist/components/'

    grunt.task.run "copy:components"