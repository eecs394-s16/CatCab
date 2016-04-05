var users = new Firebase('https://catcab.firebaseio.com/users');
var locationDic = {};

// Get all of the users and add them to the location dictionary if they're not already matched
users.orderByChild('timeStamp').endAt(Date.now()).on("child_added", function(ref, prev) {
  var user = ref.val();
  console.log(user);
  if (user.matchId === "" || user.matchId === "no one") {
    locationDic[user.terminal] = ref;   
  }
});

// Watch for new users and match if necessary
users.orderByChild('timeStamp').startAt(Date.now()).on('child_added', function(ref) {
  var user = ref.val();
  console.log("New user!", user);
  var match = locationDic[user.terminal];
  if (match) {
      delete locationDic[user.terminal];
      users.child(ref.key()).update({matchId: match.key()});
      users.child(match.key()).update({matchId: ref.key()});
      console.log("Matched!");
  } else {
      locationDic[user.terminal] = ref;
      console.log("No match, yet");
  }
});

users.orderByChild('timeStamp').startAt(Date.now()).on('child_removed', function(ref) {
  var user = ref.val();
  console.log("User removed...", user);
  delete locationDic[user.terminal];
});