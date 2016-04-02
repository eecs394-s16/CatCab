zipObject = require 'lodash-node/modern/arrays/zipObject'
mapValues = require 'lodash-node/modern/objects/mapValues'
pairs = require 'lodash-node/modern/objects/pairs'
{Success, Failure} = require 'data.validation'

assert = require '../assert'
check = require '../check'
primitive = require './primitives'

# List [String, Validation] -> Validation Object
objectSequence = (nameValidationPairs) ->
  failures = []
  result = for [name, validation] in nameValidationPairs
    validation.fold(
      (failure) ->
        failures = failures.concat failure
        [name, null]
      (success) -> [name, success]
    )

  if failures.length > 0
    Failure failures
  else
    Success zipObject result

module.exports = objects =
  Property: (name, type = primitive.Any) ->
    assert.isFunction type
    (object) ->
      (if object?[name]?
        type object[name]
      else
        type null
      ).leftMap (errors) ->
        result = {}
        result[name] = errors
        result

  Object: (memberTypes) ->
    propertyNamesToTypes = mapValues memberTypes, (type, name) ->
      assert.isFunction type
      objects.Property(name, type)

    (object) ->
      objectSequence (
        pairs mapValues propertyNamesToTypes, (propertyType) ->
          propertyType(object)
      )

  Map: (type) ->
    assert.isFunction type
    (input) ->
      if not check.isObject input
        Failure ["Input was of type #{check.typeAsString input} instead of object"]
      else
        objectSequence (
          pairs mapValues input, (throwawayValue, propertyName) ->
            objects.Property(propertyName, type)(input)
        )