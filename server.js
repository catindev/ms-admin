const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const checkSession = require('./checkSession');

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cookieParser())
app.use(checkSession)


app.get('/', function (request,response) {
  response.sendFile(__dirname + '/login.html');
})

app.get('/accounts', function (request, response) {
  response.sendFile(__dirname + '/accounts.html');
});

app.get('/accounts/:accountID', function (request, response) {
  response.sendFile(__dirname + '/account.html');
});

app.get('/accounts/:accountID/users', function (request, response) {
  response.sendFile(__dirname + '/users.html');
});

app.get('/accounts/:accountID/users/:userID', function (request, response) {
  response.sendFile(__dirname + '/user.html');
});

app.get('/accounts/:accountID/trunks', function (request, response) {
  response.sendFile(__dirname + '/trunks.html');
});

app.get('/accounts/:accountID/params', function(request, response){
  response.sendFile(__dirname + '/customfields.html');
});

app.get('/accounts/:accountID/params/:fieldID', function(request, response){
  response.sendFile(__dirname + '/customfield.html');
});

const listener = app.listen(9999, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
