
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-copy-www", "Copy files from www/ to dist/ (except for .scss and .coffee)", ->

    grunt.extendConfig
      copy:
        www:
          expand:true
          cwd: 'www/'
          src: ['**/*.*', '!**/*.coffee', '!**/*.scss']
          dest: 'dist/'

    grunt.task.run "copy:www"