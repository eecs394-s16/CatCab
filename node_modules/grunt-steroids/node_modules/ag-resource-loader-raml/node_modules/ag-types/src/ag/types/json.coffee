mapValues = require 'lodash-node/modern/objects/mapValues'
contains = require 'lodash-node/modern/collections/contains'

primitive = require './primitives'
objects = require './objects'
List = require './list'
Optional = require './optional'

# (object) -> Validator
typeFromJsonSchema = (schema) ->
  switch schema?.type
    when "string" then primitive.String
    when "number" then primitive.Number
    when "boolean" then primitive.Boolean
    when "object" then objectTypeFromPropertySchema (schema.properties || null), (schema.required || [])
    when "array" then arrayTypeFromItemSchema schema.items || {}
    else primitive.Any

arrayTypeFromItemSchema = (itemSchema) ->
  List (typeFromJsonSchema itemSchema)

objectTypeFromPropertySchema = (propertiesToSchemas, requiredProperties) ->
  if !propertiesToSchemas?
    objects.Map primitive.Any
  else
    objects.Object (mapValues propertiesToSchemas, (propertySchema, propertyName) ->
      propertyType = typeFromJsonSchema propertySchema
      if propertySchema?.required or (contains requiredProperties, propertyName)
        propertyType
      else
        Optional propertyType
    )

module.exports =
  fromJsonSchema: typeFromJsonSchema