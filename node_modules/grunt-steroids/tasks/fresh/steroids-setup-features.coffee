features = require '../../lib/features'

module.exports = (grunt) ->

  grunt.loadNpmTasks "grunt-extend-config"

  grunt.registerTask 'steroids-setup-features', ->
    grunt.task.run [
      'steroids-setup-features-splashscreen-autohide' if features.project.forceDisableSplashScreenAutohide
    ]

  # KLUDGE: toggling AutoHideSplashScreen is disabled in supersonic until native gets a smarter autohide
  grunt.extendConfig {
    'steroids-setup-features-splashscreen-autohide':
      dist:
        src: 'dist/**/*.html'
  }
  grunt.registerMultiTask 'steroids-setup-features-splashscreen-autohide', ->
    count = 0
    @files.forEach (pair) ->
      pair.src.forEach (src) ->
        grunt.file.copy src, src,
          process: (contents) ->
            contents.replace /<head>/g, """
              <head>
                <script>
                window.addEventListener('WebComponentsReady', function() {
                  supersonic.app.splashscreen.hide();
                });
                </script>
            """
        count++
    grunt.log.ok "Processed #{count} files"
