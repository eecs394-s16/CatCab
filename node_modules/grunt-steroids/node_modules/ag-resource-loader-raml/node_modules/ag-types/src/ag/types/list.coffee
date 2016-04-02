{Success, Failure} = require 'data.validation'

assert = require '../assert'
check = require '../check'
{objectWithProperty} = require './helpers'

# List Validation -> Validation List
listSequence = (list) ->
  failures = []
  result = for validation, index in list
    validation.fold(
      (failure) ->
        failures = failures.concat objectWithProperty(index)(failure)
        null
      (success) -> success
    )
  if failures.length > 0
    Failure failures
  else
    Success result

module.exports = List = (type) ->
  assert.isFunction type
  (input) ->
    if not check.isArray input
      Failure ["Input was of type #{check.typeAsString input} instead of array"]
    else
      listSequence (type(value) for value in input)