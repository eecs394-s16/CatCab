module.exports = (grunt) ->
  ramlLoader = require 'ag-resource-loader-raml'

  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask 'steroids-setup-cloud-resources', ->
    grunt.task.run [
      'steroids-convert-cloud-raml-to-js'
      'steroids-inject-cloud-resources-js'
    ]

  ###
  # 2: rewrite <head> for html files in dist to inject cloud-resources.js
  ###
  grunt.extendConfig {
    'steroids-inject-cloud-resources-js':
      dist:
        src: 'dist/app/**/*.html'
  }
  grunt.registerMultiTask 'steroids-inject-cloud-resources-js', ->
    count = 0
    @files.forEach (pair) ->
      pair.src.forEach (src) ->
        grunt.file.copy src, src,
          process: (contents) ->
            contents.replace /<head>/g, """
              <head>
                <!-- Cloud resource definition file for Supersonic Data -->
                <script src="/cloud-resources.js"></script>
            """
        grunt.log.debug "Injected cloud-resources.js to #{src}"
        count++
    grunt.log.ok "Processed #{count} files"

  ###
  # 1: convert config/cloud-resources.raml to dist/cloud-resources.js
  ###
  grunt.extendConfig {
    'steroids-convert-cloud-raml-to-js':
      options:
        src: 'config/cloud-resources.raml'
        dest: 'dist/cloud-resources.js'
  }
  grunt.registerTask 'steroids-convert-cloud-raml-to-js', ->
    {src, dest} = @options()

    unless grunt.file.isFile src
      grunt.log.ok "Skipping, no cloud raml in place"
      return

    done = @async()
    ramlLoader
      .loadLocalFile(src)
      .toResourceBundle()
      .then(
        (bundle) ->
          bundleString = JSON.stringify bundle, null, 2
          setup = """
            if (window.ag == null) {
              window.ag = {};
            }
          """
          grunt.file.write dest, [
            setup,
            "\n",
            "window.ag.data = ",
            bundleString,
            ";"
          ].join ''
      ).then(
        ->
          grunt.log.ok "Wrote #{dest}"
          done()
        (err) ->
          grunt.log.ok "Failed to convert cloud resource raml to injectable js"
          done err
      )
