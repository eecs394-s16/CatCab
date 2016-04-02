assert = require '../assert'
{Success, Failure} = require 'data.validation'

module.exports =
  OneOf: (types) ->
    for type in types
      assert.isFunction type
    (input) ->
      fail = Failure []
      for type in types
        validation = type(input)
        if validation.isSuccess
          return validation
        else
          fail = fail.ap validation
      fail
