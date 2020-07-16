var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var cv = require('opencv');
var axios = require('axios');

http.listen(3002, function() {
  console.log('Server is running on port 3002');
});

app.get('/stream', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(http);


io.sockets.on('connection',function(socket){
    socket.emit('frame', { buffer:""});

  socket.on('req', function() {
    //camera.read(function(err, im) {
      //if (err) throw err;
            axios({
              method: 'get',
              url: 'http://localhost:4002/NCTUstream',
            }).then(function(response,err){
              //console.log('axios res');
              //console.log(response.data);
              socket.emit('frame', { buffer:response.data});
            }).catch(function (error) {
              //if (error) throw error;
              socket.emit('frame', { buffer:""});
            });
    //});

  });
  socket.on('disconnect', function(socket) {

  });
});

