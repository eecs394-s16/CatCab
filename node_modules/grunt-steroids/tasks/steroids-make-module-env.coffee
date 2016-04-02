module.exports = (grunt) ->
  grunt.registerTask "steroids-make-module-env", "Compile module environment dist/", ->
    grunt.loadTasks("#{__dirname}/module-env")
    grunt.task.run [
      "steroids-compile-module-config"
      "steroids-copy-module-dependencies"
    ]
