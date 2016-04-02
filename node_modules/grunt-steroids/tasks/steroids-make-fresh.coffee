module.exports = (grunt) ->
  grunt.registerTask "steroids-make-fresh", "Create the dist/ folder that is copied to the device.", ->
    grunt.loadTasks("#{__dirname}/fresh")
    grunt.task.run [
      "steroids-check-project"
      "steroids-clean-dist"
      "steroids-copy-www"
      "steroids-compile-coffee"
      "steroids-copy-components"
      "steroids-configure"
      "steroids-compile-modules"
      "steroids-compile-sass"
      "steroids-copy-css"
      "steroids-setup-cloud-resources"
      "steroids-setup-features"
    ]
