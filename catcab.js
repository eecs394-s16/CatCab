var MAX_TIME_DIFF = 30 * 60 * 1000;

var users = new Firebase('https://catcab.firebaseio.com/users');
// TODO: generate these dictionaries dynamically
// var locations = new Firebase('https://catcab.firebaseio.com/locations');
var instantMatchLocations = {"MDW": {"ORD": null, "NU": null}, "ORD": {"MDW": null, "NU": null}, "NU": {"MDW": null, "ORD": null}};
var scheduledMatchLocations = {"MDW": {"ORD": [], "NU": []}, "ORD": {"MDW": [], "NU": []}, "NU": {"MDW": [], "ORD": []}};
var requestsByTime = [];

function nameToLoc(name) {
  if (name.indexOf("Northwestern") !== -1) {
    return "NU";
  } else if (name.indexOf("ORD") !== -1) {
    return "ORD";
  } else if (name.indexOf("Midway") !== -1) {
    return "MDW";
  }
}

// Update a match in Firebase
function updateMatch(userId, matchId, matchInfo) {
  users.child(userId + "/matches/" + matchId).update({myMatch: matchInfo, status: matchInfo === "" ? "waiting" : "matched"});
}

// Find the index for a newTime in an array
function timeInsertPoint(arr, newTime) {
  var i = 0, len = arr.length;

  while (i < len && arr[i].time < newTime) { i++; }

  return i;
}

function setInstantMatch(match, userId, matchId) {
  if (userId) {
    instantMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)] = {userId: userId, matchId: matchId};
  } else {
    instantMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)] = null;
  }
}

// Add a match to the local dictionary
function addMatch(match, userId, matchId) {
  if (match.type === "instant") {
    setInstantMatch(match, userId, matchId);
  } else if (match.type === "scheduled") {
    var arr = scheduledMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)];
    var myTime = new Date(match.time);

    arr.splice(timeInsertPoint(arr, myTime), 0, {time: myTime, userId: userId, matchId: matchId});
  }
}

// Processes new users who sign up
function newUserHandler(data) {
  var user = data.val();
  // TODO: send user a text
}

// Processes any old users already in the DB when the script is run
function oldUserHandler(data) {
  var user = data.val();
  
  for (var matchId in user.matches) {
    var match = user.matches[matchId];

    if (match.status === "waiting") {
      addMatch(match, data.key(), matchId);
    }
  }
}

function newChangeHandler(data) {
  var user = data.val();
  
  for (var matchId in user.matches) {
    var match = user.matches[matchId];

    switch (match.status) {
      case "waiting":
        if (match.type === "instant") {
          var myMatch = instantMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)];
          if (myMatch) {
            if (myMatch.userId != data.key()) {
              // Found a match!
              setInstantMatch(match, null);
              updateMatch(data.key(), matchId, myMatch);
              updateMatch(myMatch.userId, myMatch.matchId, {userId: data.key(), matchId: matchId});
            }
          } else {
            // No match, add ourselves to dictionary
            setInstantMatch(match, data.key(), matchId);
          }
        } else if (match.type === "scheduled") {
          var arr = scheduledMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)];
          var myTime = new Date(match.time);
          var len = arr.length;

          if (len === 0) {
            // If there's no one waiting at all :(
            arr.push({time: myTime, userId: data.key(), matchId: matchId});
            continue;
          }

          var i = timeInsertPoint(arr, myTime);

          // If we're already in the array, don't try to add ourselves again
          if (i < len && arr[i].userId === data.key()) {
            continue;
          }

          // TODO: What if I accidentally add myself twice really close?
          var myMatch = null;
          // Look for a match within 30 minutes of our scheduled time
          if (i > 0 && Math.abs(arr[i - 1].time - myTime) <= MAX_TIME_DIFF) {
            myMatch = arr.splice(i - 1, 1)[0];
          } else if (i < len && Math.abs(arr[i].time - myTime) <= MAX_TIME_DIFF) {
            myMatch = arr.splice(i, 1)[0];
          }

          if (myMatch) {
            // Match found!
            updateMatch(data.key(), matchId, myMatch);
            updateMatch(myMatch.userId, myMatch.matchId, {time: match.time, userId: data.key(), matchId: matchId});
          } else {
            // If there's no match for me :(
            arr.splice(i, 0, {time: myTime, userId: data.key(), matchId: matchId}); 
          }
        }
        break;
      case "matched":
        break;
      case "cancelled":
        if (match.myMatch === "") {
          // Cancelled while still waiting, delete myself from dictionaries
          if (match.type === "instant") {
            setInstantMatch(match, null);
          } else {
            var arr = scheduledMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)];
            var i = arr.findIndex(function(elem, index, arr) { return elem.matchId === matchId; });
            if (i !== -1) {
              arr.splice(i, 1);
            }
          }
        } else {
          // Put the other user we cancelled on back into waiting mode
          var myMatch = match.myMatch;
          addMatch(myMatch, myMatch.userId, myMatch.matchId);
          updateMatch(myMatch.userId, myMatch.matchId, "");
        }
      
        // Remove our request from firebase
        users.child(data.key()).child("matches").child(matchId).remove();
        break;
      case "finished":
        break;
    }
  }
}

// 
users.orderByChild('timeStamp').endAt(Date.now()).on("child_added", oldUserHandler);
users.orderByChild('timeStamp').startAt(Date.now()).on("child_added", newUserHandler);
users.on("child_changed", newChangeHandler);