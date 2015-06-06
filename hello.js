
// Initialize app as a function handler used for http server
var express = require('express');
var app = express();
var http = require('http').Server(app);

// For saving emails to file
fs = require('fs');

// Initialize socket with http node server 
var io = require('socket.io')(http);

app.use(express.static(__dirname));

// '/' is router handler, gets called when get to home page 
app.get('/', function (request, response) {
	response.sendFile(__dirname + '/hello.html');
});

// Listen for connection events 
io.on('connection', function (socket) {
	console.log('a user connected');

	// Listen for incoming email
	socket.on('email', function (email) {
    	console.log('email: ' + email);

      fs.appendFile('emails.txt',  email+'\n', function (err) {
        if (err) throw err;
        console.log('email saved!');
      });
    	
      // Send received signal
    	io.send('received', 'received');

  	});

});

// Listen to port 3000 
http.listen(3000, function (){ 
  console.log('listening on *:3000');
});