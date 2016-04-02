fs = require 'fs'
chalk = require 'chalk'
xml2js = require 'xml2js'

module.exports = (grunt) ->

  ensureXmlValidity = (filepath) ->
    data = fs.readFileSync filepath
    parser = new xml2js.Parser()
    parser.parseString data, (err, result) ->
      if err or !result?
        console.log """

          #{chalk.red.bold("#{filepath} is not valid XML")}
          #{chalk.red.bold("==============================")}

          It looks like your #{chalk.bold("#{filepath}")} file is not valid XML. Please ensure its validity.

          If the file is beyond recovery, you can create a new project with

            #{chalk.bold("$ steroids create projectName")}

          and copy the #{chalk.bold("#{filepath}")} over from the new project.

        """
        process.exit(1)

  grunt.registerMultiTask "steroids-check-project-xml", ->
    @files.forEach (file) ->
      ensureXmlValidity file.dest

    console.log "Project has valid XML configuration files... #{chalk.green "OK"}"
