
var io = require("socket.io").listen(/*ADD PORT HERE*/);

io.sockets.on('connection', function (socket) {
	io.sockets.emit("news", {hello: "world", id: Math.round(Math.random() * 10000000)});
	
	socket.on('message', function (data) {
		io.sockets.emit("response", {message: data.message, name: data.name, id: data.id});
	});
	
	socket.on('typing', function (data) {
		io.sockets.emit("typingPerson", {person: data.person, toggle: data.toggle, id: data.id});
	});
});