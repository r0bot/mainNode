var admin = require("firebase-admin");

var serviceAccount = require("./serviceKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://push-notifications-e01a7.firebaseio.com"
});

const SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline
const port = new SerialPort('COM3', { 
	autoOpen: false,
	baudRate: 19200,
}, (err)=>{
  if (err) {
    return console.log('Error: ', err.message);
  }

});
port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
 
  console.log('Port is open.');
});
 
// The open event is always emitted
port.on('open', function() {
  console.log('Open event emitted.');
});

let lastWarningTime = 0;
const warningTimeout = 1000 * 60 * 30;
let lastJsondData = {};
//Pipe the port to the parser
const parser = port.pipe(new Readline());
// Read when parser has data. Default delimeter is /n
parser.on('data', function (data) {
	let jsonData;
	const timeSinceLastWarning = Date.now() - lastWarningTime;
	console.log('Time since last warning: ', timeSinceLastWarning);
	try{
		jsonData = JSON.parse(data);
		console.log('Data: ', data);
	}catch(e){
		console.log('Error parsing json data from main node.');
		return;
	}
	lastJsondData = jsonData;
	if((jsonData.t > 25 || jsonData.t < 21) && (timeSinceLastWarning > warningTimeout)){
		console.log('High temp detected.');
		lastWarningTime = Date.now();
		const payload = {
		  notification: {
			title: "Hight temperature",
			body: `Temp is: ${jsonData.t}`
		  }
		};

		// Set the message as high priority and have it expire after 24 hours.
		var options = {
		  priority: "high",
		  timeToLive: 60 * 60 * 24
		};

		// Send a message to devices subscribed to the provided topic.
		//admin.messaging().sendToTopic('news', payload)
		//  .then(function(response) {
			// See the MessagingTopicResponse reference documentation for the
			// contents of response.
		//	console.log("Successfully sent message:", response);
			
		//  })
		//  .catch(function(error) {
		//	  resetAlarm = true;
		//	console.log("Error sending message:", error);
		//  });
	} else {
		resetAlarm = true;
	}
  
});

const express = require('express')
const app = express()

app.get('/', (req, res) => res.send(lastJsondData))

app.listen(3000, () => console.log('Example app listening on port 3000!'))