$(document).ready(function() {
	
	var $timer  = $('#timer'),
		$inputs = $timer.find('input'),
		hours = $inputs[0].value,
		mins = $inputs[1].value ,
		secs = $inputs[2].value;
	
	// constants
	var	START = 0,
		END = 0,
		LENGTH = 0,
		TS = null,
		TIMEOUT = null,
		UNITS = countdown.HOURS|countdown.MINUTES|countdown.SECONDS; // For countdown.js

	$inputs.on("keydown change",function(event) {
		
		// Only allow digits in input boxes
		$(event.target).val( this.value.replace(/\D+/g, '') );

		var charCode = event.which || event.keyCode;

		// Start counting!
		// Make sure "Enter" key or number key pressed
		if (charCode == 13 || !(charCode < 48 || charCode > 57)) {

			// Un-focus inputs when "Enter" pressed
			if (charCode == 13) {
				$inputs.blur();
			}

			START = new Date();
			END = new Date();
			
			// Add up timer durations
			END.setSeconds(END.getSeconds() + secs);
			END.setMinutes(END.getMinutes() + mins);
			END.setHours(END.getHours() + hours);
			
			LENGTH = END - START;
			
			// Create countdown obj
			window.clearInterval(TS);
			window.clearInterval(TIMEOUT);
			TS = countdown(
				function (ts) {

					// Prevent counting up if "Enter"
					// pressed before time is entered
					if (!(END > START)) { return false };
					
					// Update input values for non-focused inputs
					$inputs.not(':focus').each(function() {
						$(this).val(ts[this.id]);
					});

					// Timer finished
					if (ts.value < 0) {
						window.clearInterval(TS);
						window.clearInterval(TIMEOUT);
						return;
					}
				},
				END,
				UNITS
			);

			// Update progress circle
			TIMEOUT = setInterval(updateUI, 1);
		}

	// Auto select text to overwrite on input		
	}).focus(function() {
		$(this).select();
	});

	// Calculate percent completion
	// and draw to canvas accordingly
	function updateUI() {
		var percent = ($.now() - START) / LENGTH;
		requestAnimFrame(function() {
			animate(percent);
		});
	}

	// requestAnimFrame Shim
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	// CANVAS 
	var canvas = document.getElementById('progress'),
		context = canvas.getContext('2d'),
		X = canvas.width / 2,
		Y = canvas.height / 2,
		RADIUS = 100,
		CIRC = Math.PI * 2,
		QUART = Math.PI / 2;

	// Draw circle to canvas
	function animate(percent) {
		var start = -(QUART),
			end = (CIRC * percent) - QUART;

		context.clearRect(0, 0, canvas.width, canvas.height);

		// outer circle
		context.beginPath();
		context.lineWidth = 2;
		context.strokeStyle = '#777';
		context.arc(X, Y, RADIUS+8, start, CIRC, false);
		context.stroke();
		
		// progress circle
		context.beginPath();
		context.lineWidth = 10;
		context.strokeStyle = '#ad2323';
		context.arc(X, Y, RADIUS, start, end, false);
		context.stroke();
	}
});