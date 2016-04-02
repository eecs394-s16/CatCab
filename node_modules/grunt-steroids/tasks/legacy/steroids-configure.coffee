
SteroidsConfigure = require '../../lib/SteroidsConfigure'

module.exports = (grunt)->

  grunt.registerTask "steroids-configure", "Read XML configuration files from www/ and output a JSON to dist/", ->
    configXmlPath = "www/config.xml"
    distConfigJsonPath = "dist/config.json"

    if not grunt.file.isFile configXmlPath
      grunt.log.writeln "No file found at #{configXmlPath}, skipping."
      return

    done = @async()

    configXml = grunt.file.read configXmlPath
    SteroidsConfigure.fromXml configXml, (err, json) ->
      throw new Error err if err?
      grunt.file.write distConfigJsonPath, json
      grunt.log.writeln "Parsed #{configXmlPath} and wrote corresponding data to #{distConfigJsonPath}."
      
      done()
