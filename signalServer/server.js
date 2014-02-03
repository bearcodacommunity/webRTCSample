
//Activate socket server
io = require('socket.io').listen(8080);

//client list
var clients = {};

io.sockets.on( 'connection', function( socket ) {
	//Save User
	clients[socket.id] = {
		id:socket.id,
		ip: socket.manager.handshaken[socket.id].address.address,
		socket:socket	
	}
	
	//Add dispatchEvent to listeners
	socket.on( "dispatchEvent", function(data) {
		
		for( var i in clients ) {
			if( socket.id != i ) {
				clients[i].socket.emit( "onEvent", data );
			}
		}
	});
	
	socket.on( 'disconnect', function() {
		clients[socket.id] = undefined;
		delete clients[socket.id];
	});
});

