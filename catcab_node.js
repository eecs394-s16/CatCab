var MAX_TIME_DIFF = 30 * 60 * 1000;
var sendEnabled = 1;
var Firebase = require("firebase");
var client = require('./login').login_twilio();
var twilio_number = require('./login').get_twilio_phone(); 
console.log("Hi, starting node.js");

console.log("phone to send from is "+twilio_number);
console.log("Send Enabled is "+sendEnabled);

var users = new Firebase('https://catcab.firebaseio.com/users');
// TODO: generate these dictionaries dynamically
// var locations = new Firebase('https://catcab.firebaseio.com/locations');
var instantMatchLocations = {"MDW": {"ORD": null, "NU": null}, "ORD": {"MDW": null, "NU": null}, "NU": {"MDW": null, "ORD": null}};
var scheduledMatchLocations = {"MDW": {"ORD": [], "NU": []}, "ORD": {"MDW": [], "NU": []}, "NU": {"MDW": [], "ORD": []}};
var requestsByTime = [];

// Watch for changes to users
users.orderByChild('timeStamp').endAt(Date.now()).on("child_added", oldUserHandler);
users.orderByChild('timeStamp').startAt(Date.now()).on("child_added", newUserHandler);
users.on("child_changed", newChangeHandler);

// Processes new users who sign up
function newUserHandler(data) {
        var user = data.val();
	console.log("Sending new user message to phone "+user.phone); 
	var myUser = new Firebase('https://catcab.firebaseio.com/users/'+user.phone); 
	if (user.sent_welcome == 0){
		myUser.update({ sent_welcome: 1});
		name = user.firstName;
		sendMessage(user.phone,name,"",0);
		//data.update({ sent_welcome : 1});
		console.log("Sent!");
	}

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
        if (match.type === "now") {
          var myMatch = instantMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)];
          if (myMatch) {
            if (myMatch.userId != data.key()) {
              // Found a match!
              // TODO: Send user an sms for match 
              setInstantMatch(match, null);
              updateMatch(data.key(), matchId, myMatch);
              updateMatch(myMatch.userId, myMatch.matchId, {userId: data.key(), matchId: matchId});
            }
          } else {
            // No match, add ourselves to dictionary
            setInstantMatch(match, data.key(), matchId);
          }
        } else if (match.type === "later") {
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
            // TODO: Scheduled match (send sms)
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
          if (match.type === "now") {
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
          // TODO: Send sms for match cancelled
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

function nameToLoc(name) {
  if (name.indexOf("Northwestern") !== -1 || name === "Downtown Evanston") {
    return "NU";
  } else if (name.indexOf("ORD") !== -1) {
    return "ORD";
  } else if (name.indexOf("Midway") !== -1) {
    return "MDW";
  }
}

// Update a match in Firebase
function updateMatch(userId, matchId, matchInfo) {
  // TODO: This function changes the match for each user
  // if matchInfo= "", they got cancelled
  // if matchInfo not empty, they got a match. send sms with match information 
  if (matchInfo===""){
	//cancel request
    sendMessage(userId,"","",2);
  }
  else
  {
    var matchNumber = matchInfo.userId;
    console.log("Match number is :"+matchNumber);
    //debugger;
    //childRef.once("value", function(snapshot) {
//	var matchData = snapshot.val();
//	matchNumber = matchData.userId;
  //  });
    var matchRef = users.child(matchNumber);
    matchRef.once("value", function(snapshot) {
	var matchData = snapshot.val();
	console.log('Name of the match is :'+matchData.firstName+" "+matchData.lastName);
	var name = matchData.firstName;
    	console.log("name of the match is: "+name);
    	sendMessage(userId,"",name,1);
   });
  
  }
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
  if (match.type === "now") {
    setInstantMatch(match, userId, matchId);
  } else if (match.type === "later") {
    var arr = scheduledMatchLocations[nameToLoc(match.origin)][nameToLoc(match.destination)];
    var myTime = new Date(match.time);

    arr.splice(timeInsertPoint(arr, myTime), 0, {time: myTime, userId: userId, matchId: matchId});
  }
}



var sendMessage = function(toNumber,fromName,matchName,type){

  if (sendEnabled === 0) { return; }  
  // TODO: Try to pull the name (js api)
  console.log("Sending Message!");
  if (type===0) // welcome 
  {
    //Send an SMS text message
    client.sendMessage({

        to:'+1'+toNumber, // Any number Twilio can deliver to
        from: twilio_number, // A number you bought from Twilio and can use for outbound communication
        body: 'Hi there '+fromName+', welcome to CatCab' // body of the SMS message

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.to);
	    console.log(responseData.body); // outputs "word to your mother."

        }
    });
    return;
  };

  if (type === 1) // new match 
  {
    //Send an SMS text message
    client.sendMessage({

        to:'+1'+toNumber, // Any number Twilio can deliver to
        from: twilio_number, // A number you bought from Twilio and can use for outbound communication
        body: 'From Catcab: You got matched with '+matchName+'! '+String.fromCodePoint(0x1F695)+'   Load CatCab to see your match' // body of the SMS message

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
	    console.log(responseData.to);
            console.log(responseData.body); // outputs "word to your mother."

        }
    });
    return;
  };

  if (type === 2) // cancel match
  {
      client.sendMessage({

        to:'+1'+toNumber, // Any number Twilio can deliver to
        from: twilio_number, // A number you bought from Twilio and can use for outbound communication
        body: 'From Catcab: Bad news, your match had to cancel!'+String.fromCodePoint(0x1F622)+'  No worries, we still have you waiting for a ride and will let you know as soon as you get a match.' // body of the SMS message

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.to);
	    console.log(responseData.body); // outputs "word to your mother."

        }
    });
    return;

  };

    

}
