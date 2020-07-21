var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var axios = require('axios');

http.listen(3002, function() {
  console.log('Server is running on port 3002');
});

app.get('/stream', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var io = require('socket.io').listen(http);
var resdata='';

io.sockets.on('connection',function(socket){

  socket.on('path', function(pathdata) {
    var serverurl=pathdata.hosturl;
    //console.log(pathdata.cameraurl);
    //console.log(serverurl);
    axios({
      method: 'get',
      url: serverurl,
    }).then(function(response,err){
      socket.emit('frame', { buffer:response.data});
    }).catch(function (error) {
      socket.emit('frame', { buffer:""});
    });
  });

  socket.on('disconnect', function(socket) {
  });

});
