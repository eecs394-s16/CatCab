{Success, Failure} = require 'data.validation'
check = require '../check'

nativeTypeValidator = (expectedType) -> (input) ->
  actualType = check.typeAsString input
  if expectedType is actualType
    Success input
  else
    Failure ["Input was of type #{actualType} instead of #{expectedType}"]

module.exports = types =
  Any: (input) ->
    if input?
      Success input
    else
      Failure ["Input was undefined"]

  Nothing: (input) ->
    Failure ["Not accepting input"]

  String: nativeTypeValidator 'string'

  Boolean: nativeTypeValidator 'boolean'

  Number: nativeTypeValidator 'number'
