var express = require('express');
var MyWallet = require('blockchain.info/MyWallet');

var code = process.argv[2]; // If someone gets this code, pass it as a parameter 
var options = { apiCode: code, apiHost: 'http://localhost:3000' };

var app = express();

app.get('/', function(request, response) {
    response.sendFile('index.html', {root: __dirname});
});

app.get('/wallet', function(request, response) {
	var identifier = request.query.identifier_input;
	var password = request.query.password_input;
	console.log(identifier, password);
	var wallet = new MyWallet(identifier, password, options);
	var balance = null;
	wallet.getBalance(function(err, bal) {
		if (!err) {
			balance = bal;
			response.send('<h2>Balance: ' + balance + '</h2>');
		} else {
			console.log('Error');
			response.send('<h2>Something went wrong; see console.</h2>');
		}
	})
});

app.listen(3000);