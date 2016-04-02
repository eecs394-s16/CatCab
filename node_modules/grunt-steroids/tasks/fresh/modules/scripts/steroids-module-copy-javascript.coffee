
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-extend-config"
  grunt.loadNpmTasks "grunt-contrib-copy"

  grunt.extendConfig {
    copy:
      modules:
        expand: true
        cwd: 'app/'
        src: '**/*.js'
        dest: 'dist/tmp/'
        ext: '.js'
  }

  grunt.registerTask "steroids-module-copy-javascript", "Copy Javascript from app/*.js to dist/tmp/*.js", ->
    grunt.task.run "copy:modules"
