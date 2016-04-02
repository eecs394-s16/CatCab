
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-extend-config"
  grunt.loadNpmTasks "grunt-contrib-sass"

  grunt.extendConfig {
    sass:
      "native-app":
        expand: true
        cwd: 'app/common/native-styles/'
        src: '**/*.{scss, sass}'
        dest: 'dist/native-styles/'
        ext: '.css'
      "native-www":
        expand: true
        cwd: 'www/native-styles/'
        src: '**/*.{scss, sass}'
        dest: 'dist/native-styles/'
        ext: '.css'
  }

  grunt.registerTask "steroids-module-compile-default-native-styles", "Compile native SASS/SCSS styles from app/* to dist/", ->
    sassFiles = grunt.file.expand(['{app, www}/**/native-styles/**/*.{scss, sass}'])

    if sassFiles.length > 0
      console.log "Native SASS/SCSS files found, compiling..."
      grunt.task.run "sass:native-app"
      grunt.task.run "sass:native-www"
    else
      console.log "No native SASS/SCSS files found."
