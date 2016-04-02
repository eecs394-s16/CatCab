superagent = require 'superagent'
Promise = require 'bluebird'
_ = {
  merge: require 'lodash-node/modern/objects/merge'
}

# requestBuilder -> Promise res
requestBuilderToResponsePromise = (requestBuilder) ->
  new Promise (resolve, reject) ->
    requestBuilder.end (err, res) ->
      if err
        reject err
      else
        resolve res

responsetoResponseBody = (response) ->
  if response.error
    throw new Error response.status
  else if response.body
    response.body
  else if response.text
    response.text
  else
    throw new Error "Empty response"

request = (method, path, options = {}) ->
  requestBuilderToResponsePromise do ->
    if !superagent[method]?
      throw new Error "No such request builder method: #{method}"

    requestBuilder = superagent[method](
      if options.baseUrl?
        [options.baseUrl, path].join ''
      else
        path
    )

    if options.headers
      for header, value of options.headers || {}
        requestBuilder.set header, value

    if options.query
      requestBuilder.query options.query

    if options.type?
      requestBuilder.type options.type

    if options.accept?
      requestBuilder.accept options.accept

    # Accept multipart data for file uploads
    if options.parts?
      for part in options.parts
        partBuilder = requestBuilder.part()
        for header, value of part.headers || {}
          partBuilder.set header, value
        if part.data?
          partBuilder.write part.data
    else if options.data?
      requestBuilder.send options.data

    # If buffer() is defined on requestBuilder, we can explicitly request buffering
    if options.buffer && requestBuilder.buffer?
      requestBuilder.buffer()

    requestBuilder

requestWithDefaults = ()-> (method, path, options = {}) ->
  @config ||= {}
  mergedOptions = _.merge(options, @config)

  request(method, path, mergedOptions)

requestDataByMethod = (method) -> (path, options = {}) ->
  @config ||= {}
  mergedOptions = _.merge(options, @config)

  request(method, path, mergedOptions)
    .then(responsetoResponseBody)

module.exports = ajax =
  setDefaults: (config)->
    @config = config
  request: requestWithDefaults()
  get: requestDataByMethod 'get'
  post: requestDataByMethod 'post'
  del: requestDataByMethod 'del'
  put: requestDataByMethod 'put'
