{Success, Failure} = require 'data.validation'

# Try to execute function against input value
# - lift output to Success
# - lift any Error to Failure
# Rationale as types.Try: "If it fails to run, it probably wasn't well typed"
module.exports = Try = (f) -> (v) ->
  try
    Success f(v)
  catch e
    Failure [ e.message || e.toString() ]