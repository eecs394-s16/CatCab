
module.exports = (grunt)->

  grunt.loadTasks("#{__dirname}/scripts")

  grunt.extendConfig
    clean:
      tmp: ["dist/tmp"]

  grunt.registerTask "steroids-module-compile-scripts", "Compile CoffeeScript from app/*.coffee to dist/tmp/*.js", ->
    grunt.task.run "steroids-module-compile-coffeescript"
    grunt.task.run "steroids-module-copy-javascript"
    grunt.task.run "steroids-module-concat-javascript"
    grunt.task.run "clean:tmp"
