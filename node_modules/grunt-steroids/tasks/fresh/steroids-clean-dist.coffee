
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-clean-dist", "Clean dist/", ->

    grunt.extendConfig
      clean:
        # Clean dist/ folder (delete and create again)
        dist:
          ["dist/"]

    grunt.task.run "clean:dist"