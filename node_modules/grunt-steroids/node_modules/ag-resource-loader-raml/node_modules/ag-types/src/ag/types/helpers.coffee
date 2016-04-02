
module.exports =
  # (name) -> (value) -> {name: value}
  objectWithProperty: (name) -> (value) ->
    object = {}
    object[name] = value
    object
