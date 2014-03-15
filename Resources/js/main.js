$(document).ready(function() {
	'use strict';
	
	// jQuery objGITs
	var $timer  = $('#timer'),
		$inputs = $timer.find('input'),
		hoursInput = function () { return parseFloat( $inputs[0].value ); },
		minsInput  = function () { return parseFloat( $inputs[1].value ); },
		secsInput  = function () { return parseFloat( $inputs[2].value ); },
		$start = $("#start"),
		$reset = $("#reset");
	
	// Constants
	var	START = null,
		END = null,
		LENGTH = 0,
		TS = null,
		TIMEOUT = null,
		SELECTED = null,
		STOPPPED = 1,
		UNITS = countdown.HOURS|countdown.MINUTES|countdown.SECONDS; // For countdown.js

	// CANVAS 
	var canvas = document.getElementById('progress'),
		context = canvas.getContext('2d'),
		X = canvas.width / 2,
		Y = canvas.height / 2,
		RADIUS = 100,
		CIRC = Math.PI * 2,
		QUART = Math.PI / 2;

	// Reset page on refresh
	resetUI();

	// 
	// HANDLERS
	// 

	$inputs.keyup(function(event) {
		
		// Only allow digits in input boxes
		var value = parseFloat( this.value.replace(/\D+/g, '') );

		// No negative values
		if (value < 0 || isNaN(value) ) {
			value = 0;
		}

		// Set changed value
		$(event.target).val( value );

		// enable Start button when timer
		// has positive value
		$start.addClass('disabled');
		$inputs.each(function(index, el) {
			if (el.value > 0) {
				$start.removeClass('disabled');
			}
		});
		
		// Un-focus inputs when "Enter" pressed
		// restart timer with new values
		if (event.key === "Enter") {
			console.log("PRESSED ENTER");
			$inputs.blur();
			STOPPPED = 0;
			console.log("START!");

			// create new timer
			setUI();
		}

	}).keydown(function(event) {

		var value = parseFloat( this.value.replace(/\D+/g, '') ),
			charCode = event.which || event.keyCode;
		
		// up arrow pressed
		if (charCode === 38) {
			value+= 1;

		// down arrow pressed
		} else if (charCode === 40) {
			value-= 1;
		}

		// No negative values
		if (value < 0 || isNaN(value) ) {
			value = 0;
		}

		// Set changed value
		$(event.target).val( value );

	}).click(function() {
		console.log("CLICK!");
		// ignore if already selected,
		// to allow cursor placement
		if (SELECTED === this) { return false; }
		SELECTED = this;
		this.select();

	}).change(function(event) {

		console.log("Inputs changed!");

		// create new timer
		setUI();
	});


	// Create countdown and animate
	// progress circle
	$start.click(function(event) {
		
		var continue_timer = false;

		$inputs.each(function(index, el) {
			if (el.value > 0) {
				continue_timer = true;
			}
		});

		STOPPPED = !STOPPPED;
		// create new timer
		setUI(continue_timer);
	});


	$reset.click(function(event) {
		resetUI();
	});

	//
	// HELPERS
	//
	
	function setUI (continue_timer) {

		console.log("setUI()");
		console.log("STOPPPED: ", STOPPPED);

		if (STOPPPED) { 
			clearTimers();
			$start.text('Start').removeClass('btn-danger').addClass('btn-success');
			return false;
		} 
		
		$start.text('Stop').removeClass('btn-success').addClass('btn-danger');
		
		if (!continue_timer) {
			clearTimers();
			START = new Date();
		}

		END = new Date();

		// Add up timer durations
		END.setSeconds( END.getSeconds() + secsInput() );
		END.setMinutes( END.getMinutes() + minsInput() );
		END.setHours( END.getHours() + hoursInput() );

		LENGTH = END - START;

		// Prevent counting up if "Enter"
		// pressed before time is entered
		if (LENGTH <= 0) { 
			resetUI();
			return false;
		} else {
			$start.removeClass('disabled');
			$reset.removeClass('disabled');
		}

		// Create new countdown
		TS = countdown(
			function (ts) {

				// Update input values for non-focused inputs
				$inputs.not(':focus').each(function() {
					$(this).val(ts[this.id]);
				});

				// Timer finished
				if (ts.value <= 0) {
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
	}

	// Calculate percent completion
	// and draw to canvas accordingly
	function updateUI() {
		var percent = ($.now() - START) / LENGTH;
		console.log("PERCENT IS: %s%", Math.round(percent));
		animate(percent);
	}

	// Reset all UI elements
	// and clear timers
	function resetUI() {
	
		// Set inputs to 0
		$inputs.val(0);
		
		// Clear Canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		// Reset Start button
		$start.text('Start').removeClass('btn-danger').addClass('btn-success disabled');

		clearTimers();
		
		// reset state
		START = null;
		END = null;
		STOPPPED = 1;
		
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