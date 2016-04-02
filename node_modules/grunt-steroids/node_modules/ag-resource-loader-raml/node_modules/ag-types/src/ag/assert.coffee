check = require './check'

module.exports =
  isFunction: (input) ->
    unless typeof input is 'function'
      throw new TypeError "Type constructor argument was of type '#{check.typeAsString input}', function expected"
