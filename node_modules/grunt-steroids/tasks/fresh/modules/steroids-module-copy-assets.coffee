
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-extend-config"

  grunt.extendConfig {
    "steroids-module-copy-assets":
      app:
        expand: true
        cwd: 'app'
        src: '*/assets/**/*'
        dest: 'dist/'
        filter: 'isFile'
  }

  grunt.registerMultiTask "steroids-module-copy-assets", "Copy static assets from app/*/assets/ to dist/", ->
    @files.forEach (file) ->
      # Remove the moduleName/assets part of the path and copy the file
      flatpath = file.dest.replace /dist\/[^\/]*\/assets/, 'dist/'
      grunt.file.copy file.src, flatpath
