# NOTE:
# This is a legacy task. It's not in the legacy bundle because steroids
# projects used to be created with two root tasks, steroids-make and
# steroids-compile-sass.

module.exports = (grunt)->

  grunt.loadNpmTasks 'grunt-contrib-sass'
  grunt.loadNpmTasks 'grunt-extend-config'

  grunt.registerTask 'steroids-compile-sass', "Compile SASS files if they exist", ->

    grunt.extendConfig
      sass:
        dist:
          files: [
            # .scss and .sass files
            {
              expand: true
              cwd: 'app/'
              src: ['**/!(_*|*.android).scss', '**/!(_*|*.android).sass']
              dest: 'dist/'
              ext: '.css'
            }
            {
              expand: true
              cwd: 'www/'
              src: ['**/!(_*|*.android).scss', '**/!(_*|*.android).sass', '!components/**']
              dest: 'dist/'
              ext: '.css'
            }

            # .android.scss and .android.sass files
            {
              expand: true
              cwd: 'app/'
              src: ['**/*.android.scss', '**/*.android.sass']
              dest: 'dist/'
              ext: '.android.css'
            }
            {
              expand: true
              cwd: 'www/'
              src: ['**/*.android.scss', '**/*.android.sass', '!components/**']
              dest: 'dist/'
              ext: '.android.css'
            }
          ]

    sassFiles = grunt.file.expand(["www/**/*.scss", "www/**/*.sass", "app/**/*.scss", "app/**/*.sass", "!www/components/**"])

    if sassFiles.length > 0
      grunt.log.writeln("SASS files found, attempting to compile them to dist/...")
      grunt.task.run("sass:dist")

    else
      grunt.log.writeln("No .scss or .sass files found in app/ or www/, skipping.")
