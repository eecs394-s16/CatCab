//require the Twilio module and create a REST client

var Firebase = require("firebase");
var client = require('twilio')('ACCOUNT_ID', 'ACCOUNT_TOKEN');
var twilio_number = '+18472326683';

var myFirebaseRef = new Firebase("https://catcab.firebaseio.com/users");

myFirebaseRef.on('child_added', function(childSnapshot)
    {

        var obj = childSnapshot.val();
        console.log("New Value:");
        console.log(obj.firstName);
        console.log(obj.phone);

        if (obj.sent_welcome == 0){
            if (obj.phone.match(/\d/g).length===10){
                console.log("Valid number, sending welcome text message");
                sendWelcomeMessage(obj.phone, obj.firstName);
            }
            else{
                console.log("Number not valid");
            }
        }
        myFirebaseRef.child(obj.phone).update(
            { sent_welcome: 1 }
        );

    });



var sendWelcomeMessage = function(toNumber,name){


    //Send an SMS text message
    client.sendMessage({

        to:'+1'+toNumber, // Any number Twilio can deliver to
        from: twilio_number, // A number you bought from Twilio and can use for outbound communication
        body: 'Hi there '+name+', welcome to CatCab' // body of the SMS message

    }, function(err, responseData) { //this function is executed when a response is received from Twilio

        if (!err) { // "err" is an error received during the request, if any

            // "responseData" is a JavaScript object containing data received from Twilio.
            // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
            // http://www.twilio.com/docs/api/rest/sending-sms#example-1

            console.log(responseData.from); // outputs "+14506667788"
            console.log(responseData.body); // outputs "word to your mother."

        }
    });

}

~                                                                                                                            
~           