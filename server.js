/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(){

  console.log('User connected');

});
server.listen(3000);
