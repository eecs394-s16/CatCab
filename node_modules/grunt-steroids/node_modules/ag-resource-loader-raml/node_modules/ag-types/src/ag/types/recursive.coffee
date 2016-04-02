assert = require '../assert'

module.exports = (typeProvider) ->
  type = null
  (input) ->
    if !type?
      type = typeProvider()
      assert.isFunction type
    type input
