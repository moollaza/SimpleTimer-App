$(document).ready(function() {
	'use strict'
	
	// jQuery objs
	var $timer  = $('#timer'),
		$inputs = $timer.find('input'),
		hoursInput = function () { return parseFloat( $inputs[0].value ) },
		minsInput  = function () { return parseFloat( $inputs[1].value ) },
		secsInput  = function () { return parseFloat( $inputs[2].value ) },
		$start = $("#start"),
		$reset = $("#reset")
	
	// Constants
	var	START = 0,
		END = 0,
		LENGTH = 0,
		TS = null,
		TIMEOUT = null,
		SELECTED = null,
		PAUSED = 1,
		UNITS = countdown.HOURS|countdown.MINUTES|countdown.SECONDS; // For countdown.js

	// CANVAS 
	var canvas = document.getElementById('progress'),
		context = canvas.getContext('2d'),
		X = canvas.width / 2,
		Y = canvas.height / 2,
		RADIUS = 100,
		CIRC = Math.PI * 2,
		QUART = Math.PI / 2;

	// Reset inputs on page refresh
	$inputs.val(0);

	// 
	// HANDLERS
	// 

	$inputs.on("keyup change",function(event) {

		// Only allow digits in input boxes
		$(event.target).val( this.value.replace(/\D+/g, '') );

		var charCode = event.which || event.keyCode;

		// Make sure "Enter" key or number key pressed
		if (charCode == 13 || !(charCode < 48 || charCode > 57)) {

			START = new Date();
			END = new Date();

			// Add up timer durations
			END.setSeconds( END.getSeconds() + secsInput() );
			END.setMinutes( END.getMinutes() + minsInput() );
			END.setHours( END.getHours() + hoursInput() );

			LENGTH = END - START;

			// Prevent counting up if "Enter"
			// pressed before time is entered
			if (LENGTH <= 0) { 
				$start.addClass('disabled');
				return false;
			} else {
				$start.removeClass('disabled');
				$reset.removeClass('disabled');
			}

			// Un-focus inputs when "Enter" pressed
			if (charCode == 13) {
				$inputs.blur();
				$start.click();
			}
		}

	}).click(function() {
		if (SELECTED == this) return false;
		SELECTED = this;
		this.select();
	});


	// Create countdown and animate
	// progress circle
	$start.click(function(event) {
		
		PAUSED = !PAUSED;

		if (PAUSED){
			clearTimers();
			$start.text('Start').toggleClass('btn-success btn-danger');
		} else {
			$start.text('Stop').toggleClass('btn-success btn-danger');
		};


		if (PAUSED) { return false };

		// Create countdown obj
		TS = countdown(
			function (ts) {

				// Update input values for non-focused inputs
				$inputs.not(':focus').each(function() {
					$(this).val(ts[this.id]);
				});

				// Timer finished
				if (ts.value < 0) {
					clearTimers();
					$start.text('Start').removeClass('btn-danger').addClass('btn-success disabled');
					return;
				}
			},
			END,
			UNITS
		);

		// Update progress circle
		TIMEOUT = setInterval(updateUI, 1);
	});

	$reset.click(function(event) {
		clearTimers();
		$inputs.val(0);
		$start.text('Start').removeClass('btn-danger').addClass('btn-success disabled');
		context.clearRect(0, 0, canvas.width, canvas.height);
		PAUSED = 1;
	});

	//
	// HELPERS
	// 

	// requestAnimFrame Shim
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	// Calculate percent completion
	// and draw to canvas accordingly
	function updateUI() {
		var percent = ($.now() - START) / LENGTH;
		requestAnimFrame(function() {
			animate(percent);
		});
	}

	// Clear all interval timers
	function clearTimers(){
		window.clearInterval(TS);
		window.clearInterval(TIMEOUT);
	}

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