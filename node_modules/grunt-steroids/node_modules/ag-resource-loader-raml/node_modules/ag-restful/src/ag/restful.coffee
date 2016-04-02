_ = {
  mapValues: require 'lodash-node/modern/objects/mapValues'
  partialRight: require 'lodash-node/modern/functions/partialRight'
  merge: require 'lodash-node/modern/objects/merge'
  defaults: require 'lodash-node/modern/objects/defaults'
}

assert = require 'assert-plus'
Promise = require 'bluebird'
types = require 'ag-types'
{Failure} = require 'data.validation'

ajax = require './restful/ajax'

# Validation a -> Promise a
validationToPromise = (validation) ->
  validation.fold(
    (errors) -> Promise.reject new Error JSON.stringify(errors)
    (value) -> Promise.resolve value
  )

# (a -> Validation b) -> (a -> Promise b)
validatorToPromised = (validator) ->
  (args...) ->
    validationToPromise validator(args...)

deepDefaults = _.partialRight _.merge, _.defaults

validatorToResponseValidator = (validator) ->
  if typeof validator is 'function'
    types.OneOf [
      types.Property 'body', validator
      types.Property 'text', validator
    ]
  else
    types.OneOf (
      for responseCode, responseBodyValidator of validator
        # NOTE: This checks for the contents but not response code
        # TODO: Check for response status
        validatorToResponseValidator responseBodyValidator
    )
# Validator data | Map responseCode (Validator data) -> Validator response
responseValidator = (responseDataValidator) ->
  do (validateResponse = validatorToResponseValidator responseDataValidator) ->
    (response) ->
      if response.error
        Failure [response.error]
      else
        validateResponse response

urlify = (input) ->
  return '' unless input?

  switch (Object::toString.call input)
    when '[object Object]' then _.mapValues input, urlify
    when '[object Array]' then (urlify item for item in input)
    else encodeURIComponent input

rest =
  # path: (args...) -> url
  # receive: (response) -> Validation data
  # options: {}
  getter: ({path, receive, options}) ->
    assert.func path, 'path'
    assert.func receive, 'receive'
    assert.optionalObject options, 'options'

    (args...) ->
      # Use the last argument as query params if it's an object
      # Use the rest to create a url
      [head..., tail] = args
      [urlArgs, query] = if typeof tail is 'object'
          [head, tail]
        else
          [args, {}]

      url = path (urlify urlArgs)...

      ajax
        .request('get', url, _.defaults({query}, options || {}))
        .then(validatorToPromised receive)

  # path: (data) -> url
  # send: (data) -> Validation data
  # receive: (response) -> Validation response
  # options: {}
  poster: ({path, send, receive, options}) ->
    assert.func path, 'path'
    assert.func send, 'send'
    assert.func receive, 'receive'
    assert.optionalObject options, 'options'

    doPostRequest = (data) ->
      url = path (urlify data)
      ajax.request('post', url, _.defaults({data}, options || {}))

    (data) ->
      validationToPromise(send data)
        .then(doPostRequest)
        .then(validatorToPromised receive)

  # path: (args...) -> url
  # options: {}
  deleter: ({path, options}) -> (args...) ->
    url = path (urlify args)...
    ajax
      .del(url, options || {})

  # path: (args..., data) -> url
  # send: (data) -> Validation data
  # receive: (response) -> Validation data
  # options: {}
  putter: ({path, send, receive, options}) ->
    assert.func path, 'path'
    assert.func send, 'send'
    assert.func receive, 'receive'
    assert.optionalObject options, 'options'

    doPutRequest = (args) ->
      url = path (urlify args)...
      (data) ->
        ajax.request('put', url, _.defaults({data}, options || {}))

    (args..., data) ->
      validationToPromise(send data)
        .then(doPutRequest(args))
        .then(validatorToPromised receive)

  # receive: (response) -> Validation data
  uploader: ({receive}) ->
    assert.func receive, 'receive'

    (url, file, options = {}) ->
      ajax.request(
        'put',
        url,
        _.defaults({
            type: 'application/octet-stream'
            data: switch true
              when Buffer.isBuffer file then file.toString()
              else file
          },
          options || {}
        )
      )
      .then(validatorToPromised receive)

restMethodBuilder = (options) ->
  withDefaultOptions = (resourceBuilder) -> (resourceDescription) ->
    resourceBuilder deepDefaults resourceDescription, { options }

  get: withDefaultOptions rest.getter
  post: withDefaultOptions rest.poster
  delete: withDefaultOptions rest.deleter
  put: withDefaultOptions rest.putter
  # NOTE: No default options applied
  upload: rest.uploader

  response: responseValidator
  request: (projection) -> (data) ->
    # Double-underscored properties are sikrits and not data
    # Stash sikrits away
    sikrits = {}
    for key, value of data when 0 is key.indexOf '__'
      sikrits[key] = value
      delete data[key]

    projection(data).map (requestBody) ->
      # Merge sikrits back in to the request body root
      _.merge {}, requestBody, sikrits

module.exports = restful = (options, apiDescriptor) ->
  apiDescriptor restMethodBuilder options
