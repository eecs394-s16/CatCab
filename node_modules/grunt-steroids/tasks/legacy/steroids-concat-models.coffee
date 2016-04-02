
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask "steroids-concat-models", "Concatenate all JS files in dist/model/ into dist/models/models.js", ->

    grunt.extendConfig
      concat:
        models:
          src: 'dist/models/*.js'
          dest: 'dist/models/models.js'

    grunt.task.run "concat:models"