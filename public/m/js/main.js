var canvas = document.getElementById("canv")
var leftBox = document.getElementById("left")
var rightBox = document.getElementById("right")
var selecting = false
var keyListeners = []
var keyState = {};
lastGlobalControls = null
var keyMap = {
	13 : 'enter',
	37 : 'left',
	38 : 'up',
	39 : 'right',
	40 : 'down',
	186 : ';'
};

function init() {
	var buttonEvent = function(e) {
		if (e.keyName == "back") {
			if (confirm('Realy want to exit?')) {
				tizen.application.getCurrentApplication().exit();
			} 
		}
	}

	document.addEventListener('tizenhwkey', buttonEvent);
	
	if (localStorage.soundSettings && localStorage.soundSettings == "off")
		turnOffSound()
	keyListeners = []
	canvas.width = window.innerWidth - 200
	canvas.height = window.innerHeight
	game = new Game(canvas)
	global_controls = new Controls()
	hud = new HUD(game, true)
	game.addObject("hud", hud)
	hud.draw(game.ctx)
}

function startGame() {
	keyListeners = []
	game.play = false
	game = new Game(canvas)
	player = new Player(game, null, null, null, game.speed)
	spawner = new BlockSpawner(game, game.speed)
	hud = new HUD(game)
	power_spawner = new PowerupSpawner(game)
	game.addObject("spawner", spawner)
	game.addObject("player", player)
	game.addObject("power_spawn", power_spawner)
	game.addObject("hud", hud)
	game.update()
}

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame || window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function( /* function */callback, /* DOMElement */element) {
				window.setTimeout(callback, 1000 / 60)
			}

})()
window.onkeydown = function(e) {
	try {
		keyState[String.fromCharCode(e.which)] = e.which;
	} catch (e) {
		console.log('error converting keypress to char code')
	}
}
window.onkeyup = function(e) {
	try {
		delete keyState[String.fromCharCode(e.which)];
	} catch (e) {
		console.log('error deleting keypress to char code')
	}
}


function triggerEvents(e) {
	for (var i = 0; i < keyListeners.length; i++) {
		var k = keyMap[e] || String.fromCharCode(e)
		if (keyListeners[i][0] === k) {
			keyListeners[i][1]();
		}
	}
}

canvas.addEventListener('touchstart', function() {
	if (hud.pre || !game.play)
		triggerEvents(13)
}, false)


leftBox.addEventListener('touchstart', function(e) {
	try {
		keyState[String.fromCharCode(65)] = 65;
	} catch (e) {
		console.log('error converting keypress to char code')
	}
}, false)

leftBox.addEventListener('touchend', function(e) {
	try {
		delete keyState[String.fromCharCode(65)];
	} catch (e) {
		console.log('error deleting keypress to char code')
	}
}, false)

rightBox.addEventListener('touchstart', function(e) {
	try {
		keyState[String.fromCharCode(70)] = 70;
	} catch (e) {
		console.log('error converting keypress to char code')
	}
}, false)

rightBox.addEventListener('touchend', function(e) {
	try {
		delete keyState[String.fromCharCode(70)];
	} catch (e) {
		console.log('error deleting keypress to char code')
	}
}, false)

init();