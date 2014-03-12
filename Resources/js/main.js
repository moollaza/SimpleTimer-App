$(document).ready(function() {
	
	var $timer  = $('#timer'),
	$inputs = $timer.find('input'),
	// $dial = $("#progress_dial");
	
	// $dial.knob({ 
	// 	'readOnly': true,
	// 	'step' : 1,
	// 	// 'font' : 'monospace'
	// 	'displayInput' : false
	// });

	// var
	timer = {
		// days  : function () { return parseFloat( $inputs[0].value ) },
		hours : function () { return parseFloat( $inputs[0].value ) },
		mins  : function () { return parseFloat( $inputs[1].value ) },
		secs  : function () { return parseFloat( $inputs[2].value ) }
		// msecs : function () { return parseFloat( $inputs[4].val() ) }
	};
	
	var	START = 0,
	END = 0,
	LENGTH = 0,
	TS = null,
	TIMEOUT = null,
	UNITS = countdown.HOURS|countdown.MINUTES|countdown.SECONDS;

	$inputs.on("keydown change",function(event) {
		
		// Only allow digits in input boxes
		$(event.target).val( this.value.replace(/\D+/g, '') );

		var charCode = event.which || event.keyCode;

		// Start counting!
		if (charCode == 13 || !(charCode < 48 || charCode > 57)) {

			if (charCode == 13) {
				$inputs.blur();
			}

			START = new Date();
			END = new Date();
			
			// Tally timer durations
			END.setSeconds(END.getSeconds() + timer.secs());
			END.setMinutes(END.getMinutes() + timer.mins());
			END.setHours(END.getHours() + timer.hours());
			// END.setDate(END.getDate() + timer.days());
			
			LENGTH = END - START;
			
			// Create countdown obj
			window.clearInterval(TS);
			window.clearInterval(TIMEOUT);
			TS = countdown(
				function (ts) {

					// Don't allow counting up
					// when no time given
					if (!(END > START)) { return false };
					
					// Update input values
					// ignore focused inputs
					$inputs.not(':focus').each(function() {
						$(this).val(ts[this.id]);
					});

					// debug output
					// $timer.find('#timespan')
					// 	.show()
					// 	.text(JSON.stringify(ts, null, '  '));

					// Timer finished
					if (ts.value < 0) {
						// $dial.val(0).trigger('change');
						window.clearInterval(TS);
						window.clearInterval(TIMEOUT);
						return;
					}
				},
				END,
				UNITS
			);

			// Update progress dial
			TIMEOUT = setInterval(updateUI, 1);
		}
		
	}).focus(function() {
		$(this).select();
	});

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

	var canvas = document.getElementById('progress'),
		context = canvas.getContext('2d'),
		X = canvas.width / 2,
		Y = canvas.height / 2,
		RADIUS = 100,
		CIRC = Math.PI * 2,
		QUART = Math.PI / 2;

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
