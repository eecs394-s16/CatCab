module.exports = (grunt) ->
  grunt.registerTask "steroids-make", "Compile a legacy Steroids app/ to dist/", ->
    grunt.loadTasks("#{__dirname}/legacy")
    grunt.task.run [
      "steroids-check-project"
      "steroids-clean-dist"
      "steroids-copy-js-from-app"
      "steroids-copy-www"
      "steroids-compile-coffee"
      "steroids-concat-models"
      "steroids-compile-views"
      "steroids-configure"
    ]
