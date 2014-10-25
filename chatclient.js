
	
var socket;
var typing = false;
var UNIQUE_ID;

document.observe("dom:loaded", function() { 
	socket = io.connect("http://*IP_ADDRESS*:*PORT*");
		socket.on('news', function(data) {
		if (!UNIQUE_ID) {
			console.log(data.hello);
			UNIQUE_ID = data.id;
			$('namesetter').value = data.id;
		} else {
			Sound.play("notification.wav");
		}
	});
  
	socket.on('response', function(messageRes) {
		var newMessage = document.createElement('p'),
			nameSpan = document.createElement('span'),
			messageSpan = document.createElement('span'),
			name = messageRes.name + ': ';
			
		nameSpan.innerHTML = name;
		nameSpan.className = 'name';
		messageSpan.innerHTML = messageRes.message;
		newMessage.appendChild(nameSpan);
		newMessage.appendChild(messageSpan);
		$('output').appendChild(newMessage);
		$('messenger').scrollTop = 1000;
		if(messageRes.id != UNIQUE_ID) {
			Sound.play("snap.mp3");
		}
	});
  
	socket.on('typingPerson', function(data) {
		if (data.id != UNIQUE_ID) {
			if (data.toggle == true) {
				$('typing').className = "";
				$('typingperson').innerHTML = data.person;
			} else if (data.toggle == false) {
				$('typing').className = "hide";
			}
		}
	});
  
	document.observe('keydown', (function(event) {
		if(event.keyCode == 13 && $('input').value != ''){
			socket.emit('message', {message: $('input').value, name: $('namesetter').value, id: UNIQUE_ID});
			$('input').value = '';
			$('input').focus();
		} else if (event.keyCode == 13) {
			$('input').focus();
		} else if (document.activeElement == $('input')) {
			socket.emit('typing', {person: $('namesetter').value, toggle: true, id: UNIQUE_ID});
			setTimeout(function() {
				socket.emit('typing', {person: $('namesetter').value, toggle: false, id: UNIQUE_ID});
			}, 1000);
		}
	}));
  
	var colors = $$('#setcolor .color');
	for(var i = 0; i < colors.length; i++) {
		colors[i].style.backgroundColor = colors[i].id;
		colors[i].observe('click', (function(event) {
			var color = event.target.id;
			document.querySelectorAll('.chosen')[0].className = 'color';
			event.target.className = 'color chosen';
			$('messenger').style.backgroundColor = color;
			$('title').style.color = color;
			$('input').style.color = color;
		}));
	}
});
        