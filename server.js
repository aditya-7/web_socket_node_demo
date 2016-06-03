var fs = require('fs');
var server = require('http').createServer(reqHandler);
var io = require('socket.io').listen(server);
var deviceArray = [];

function reqHandler(req,res){
  if(req.method == 'GET'){
		var fs = require('fs');
		fs.readFile(process.cwd() + '/index.html', function(err, data){
			if(err){
				res.writeHead(500);
				res.end('Error loading index.html');
				return;
			}
			res.writeHead(200,{'Content-Type':'text/html'});
			res.end(data);
		});
	}
};

io.sockets.on('connection', function(socket){
	//console.log('New websocket client connected!',socket);
  console.log('New websocket client connected!');

  socket.on('SET_DEVICE_ID',function(deviceId){
    deviceArray.push({
      deviceId : deviceId,
      status : true
    });
    console.log("deviceArray updated",deviceArray);
  });

  setInterval(function(){
    for(var i=0;i<deviceArray.length;i++){
      if(deviceArray[i].status===false){
        console.log(deviceArray[i].deviceId + ' HAS GONE OFFLINE');
      }else{
        deviceArray[i].status = false;
      }
    }
  },15000);

  socket.on('PING', function(data){
    for(var i=0;i<deviceArray.length;i++){
      if(deviceArray[i].deviceId===data){
        console.log("Device PING : ",data);
        deviceArray[i].status = true;
        break;
      }
    }
  });

  socket.on('DEVICE_STATUS', function(deviceId,status){
    for(var i=0;i<deviceArray.length;i++){
      if(deviceArray[i].deviceId===deviceId){
        deviceArray[i].status = status;
        break;
      }
    }
  });

  socket.on('disconnect', function(){
    console.log('DEVICE GOT DISCONNECTED*****');
  });
});

server.listen(3000);
console.log("server listening at port 3000");
