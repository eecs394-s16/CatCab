
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-extend-config"
  grunt.loadNpmTasks "grunt-contrib-copy"

  grunt.extendConfig {
    copy:
      native:
        expand: true
        cwd: "app/common/native-styles/"
        src: "*.css"
        dest: "dist/native-styles"
        ext: ".css"
  }

  grunt.registerTask "steroids-module-copy-default-native-styles", "Copy native CSS styles from app/* to dist/", ->
    grunt.task.run "copy:native"
