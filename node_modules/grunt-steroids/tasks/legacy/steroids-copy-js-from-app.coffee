
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-copy-js-from-app", "Copy JavaScript files from app/ to dist/", ->

    grunt.extendConfig
      copy:
        js_from_app:
          expand: true
          cwd: "app/"
          src: ["**/*.js"]
          dest: "dist/"

    grunt.task.run "copy:js_from_app"