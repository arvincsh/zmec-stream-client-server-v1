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
var c2i='';
var camera= new cv.VideoCapture('rtsp://admin:admin@140.113.179.14:8088/channel1');
cam2img();

io.sockets.on('connection',function(socket){
    socket.emit('frame', { buffer:""});

  socket.on('req', function() {
    //camera.read(function(err, im) {
      //if (err) throw err;
            axios({
              method: 'get',
              url: 'http://localhost:4002/',
              data:{imarray:c2i.toArray()},
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
function cam2img() {
  camera.read(function(err, im) {
    if (err) throw err;
        c2i=im;
        cam2img();
  });

}
