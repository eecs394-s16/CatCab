assert = require '../assert'
primitive = require './primitives'
{objectWithProperty} = require './helpers'

module.exports =
  Property: (name, type = primitive.Any) ->
    assert.isFunction type
    (value) ->
      type(value).map(objectWithProperty name)
