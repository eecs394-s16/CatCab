assert = require '../assert'
{Success} = require 'data.validation'

module.exports = (type) ->
  assert.isFunction type
  (input) ->
    if input?
      type(input)
    else
      Success null