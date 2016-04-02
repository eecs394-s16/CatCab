module.exports =
  typeAsString: (input) -> Object::toString.call(input).match(/\[object ([^\]]+)\]/)[1].toLowerCase()
  isArray: (input) -> (Object::toString.call input) is '[object Array]'
  isObject: (input) -> (Object::toString.call input) is '[object Object]'
