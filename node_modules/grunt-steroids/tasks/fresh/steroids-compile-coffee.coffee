# For SPA
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-compile-coffee", "Compile CoffeeScript files from  www/ to dist/ (for SPA)", ->

    grunt.extendConfig
      coffee:
        compile_www:
          expand: true
          cwd: "www/"
          src: ["**/*.coffee"]
          dest: "dist/"
          ext: ".js"

    grunt.task.run "coffee:compile_www"
