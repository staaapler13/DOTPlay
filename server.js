var express = require('express');
var cfenv = require('cfenv');
var app = express();
app.use(express.static(__dirname + '/public'));
var appEnv = cfenv.getAppEnv();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var confirm = 0;

var rooms = {};

io.on('connection', function(socket){
  console.log('User connected');

  socket.on('createRoom', function () {
    // Generate room ID, then send it
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var accessCode = '';
    // Worst case time complexity: O(∞)
    do {
      for (var i = 0; i < 4; i++) {
        accessCode += letters.charAt(Math.floor(Math.random() * letters.length));
      }
    } while (rooms[accessCode] !== undefined);

    rooms[accessCode] = {
      players: {},
      gameStarted: false,
      artist: undefined,
      word: '',
      index: 1
    };

    socket.emit('roomCreated', accessCode);

    console.log('Created room with ID ' + accessCode);
  });


  socket.on('joinRoom', function (accessCode, name) {
    var room = rooms[accessCode];

    if (room === undefined) {
      console.log('Unknown room code "' + accessCode + '"');
      socket.emit('roomJoined', false, 'Unknown room code "' + accessCode + '"');
      return;
    }

    // Make sure name isn't taken already (Names are used as indices, so duplicates aren't allowed)
    if (room.players[name]) {
      console.log('Username "' + name + '" is already taken in room ' + accessCode);
      socket.emit('roomJoined', false, 'The username "' + name + '" is already taken');
      return;
    }

    // Make sure game hasn't already started
    if (room.gameStarted) {
      socket.emit('roomJoined', false, 'The game has already started.');
      return;
    }

    // Join the room with given access code. emits will send to just this room now
    socket.join(accessCode);

    room.players[name] = {
      name: name,
      score: 0
    };

    socket.name = name;
    socket.accessCode = accessCode;

    console.log('Added player ' + name + ' to room ' + accessCode);

    // Let the player know that the join was successful
    socket.emit('roomJoined', true, 'Success');

    // Inform all other players of the new player list
    io.to(accessCode).emit('updatePlayerList', room.players);
  });

  socket.on('startGame', function () {
    var room = rooms[socket.accessCode];

    if (room === undefined) {
      // Err
      return;
    }

    var numPlayers = Object.keys(room.players).length;
    if (numPlayers < 2){
      io.to(socket.accessCode).emit('playersInsufficient');
      return;
    }

    if (room && !room.gameStarted) {


      var roundTime = 30;

      var assignArtist = function() {
        room.gameStarted = true;
        var numPlayers = Object.keys(room.players).length;

        // Assign an artist by picking a random player
        var names = Object.keys(room.players);


        if(room.index == 1){
          room.index = 0;
        }
        else if(room.index == 0){
          room.index = 1;
        }

        room.artist = room.players[names[room.index]];

        console.log(room.artist.name + ' is now the artist for room ' + socket.accessCode);

        io.to(socket.accessCode).emit('gameStarted', roundTime);

        io.to(socket.accessCode).emit('artistSelected', room.artist.name);


      };
      assignArtist();

      // After 60 seconds, select a new artist
      room.time = roundTime;
      room.interval = setInterval(function() {
        room.time--;
        if (room.time <= 0) {
         console.log('Assigning a new artist');
         assignArtist();
         room.time = roundTime;
        }
        else if (confirm == 1){
          confirm = 0;
          console.log('Assigning a new artist');
          assignArtist();
          room.time = roundTime;
        }
      }, 1000);
    }
  });

  socket.on('click', function(accessCode, linename){
    accessCode = accessCode.toUpperCase();
    io.to(accessCode).emit('clicked', linename);
  });

  socket.on('confirm', function () {
      confirm = 1;
      console.log('comfirm');
  });

  socket.on('add', function () {

      rooms[socket.accessCode].artist.score++;
      io.to(socket.accessCode).emit('updatePlayerList', rooms[socket.accessCode].players);


  });




});

server.listen(appEnv.port,function(){
  console.log("server starting on " + appEnv.url);
});
