
module.exports = (grunt) ->
  grunt.loadTasks("#{__dirname}/../check")
  
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-check-project", "Is this a valid Steroids project?", ->
    grunt.extendConfig
      "steroids-check-project-xml":
        www:
          expand: true
          src: "www/*.xml"

      "steroids-check-project-bower-dependencies":
        bowerfile: './bower.json'
        directory: 'www/components'

    grunt.task.run "steroids-check-project-bower-dependencies"
    grunt.task.run "steroids-check-project-xml"