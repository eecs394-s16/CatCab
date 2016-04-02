path = require "path"

module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-extend-config'

  grunt.registerTask 'steroids-copy-css', "Copy CSS files from app/", ->

    grunt.extendConfig
      copy:
        css:
          files: [
            {
              expand: true
              cwd: 'app/'
              src: ['**/*.css', '!**/native-styles/**']
              dest: 'dist/app/'
            }
            {
              expand: true
              cwd: 'www/'
              src: ['**/*.css', '!**/native-styles/**']
              dest: 'dist/'
            }
          ]

    grunt.task.run "copy:css"
