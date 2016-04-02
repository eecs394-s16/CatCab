
module.exports = (grunt)->

  grunt.loadNpmTasks "grunt-extend-config"
  grunt.loadNpmTasks "grunt-contrib-concat"

  grunt.extendConfig {
    "steroids-module-concat-javascript":
      modules:
        expand: true
        cwd: 'dist/tmp'
        src: '*'
        dest: 'dist/app'
  }

  grunt.registerMultiTask "steroids-module-concat-javascript", "Compile JavaScript from app/* to dist/*.js", ->
    modules = {}
    @files.forEach (file) ->
      [path] = file.src
      [ignore..., module] = path.split '/'
      modules["module-#{module}"] =
        src: [
          "#{path}/index.js"
          "#{path}/**/*.js"
        ]
        dest: "#{file.dest}.js"

    grunt.extendConfig { concat: modules }

    for taskName, module of modules
      grunt.task.run "concat:#{taskName}"
