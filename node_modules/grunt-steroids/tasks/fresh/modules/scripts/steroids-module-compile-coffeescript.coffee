
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-extend-config"
  grunt.loadNpmTasks "grunt-contrib-coffee"

  grunt.extendConfig {
    coffee:
      modules:
        expand: true
        cwd: 'app/'
        src: '**/*.coffee'
        dest: 'dist/tmp/'
        ext: '.js'
  }

  grunt.registerTask "steroids-module-compile-coffeescript", "Compile CoffeeScript from app/*.coffee to dist/tmp/*.js", ->
    grunt.task.run "coffee:modules"
