
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-compile-coffee", "Compile CoffeeScript files from app/ and www/ to dist/", ->

    grunt.extendConfig
      coffee:
        compile_app:
          expand: true
          cwd: "app/"
          src: ["**/*.coffee"]
          dest: "dist/"
          ext: ".js"
        compile_www:
          expand: true
          cwd: "www/"
          src: ["**/*.coffee"]
          dest: "dist/"
          ext: ".js"

    grunt.task.run "coffee:compile_app"
    grunt.task.run "coffee:compile_www"
