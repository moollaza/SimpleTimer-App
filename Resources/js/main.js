$(document).ready(function() {
	
	var $timer  = $('#timer'),
		$inputs = $timer.find('input'),
		$dial = $("#progress_dial");
	
	$dial.knob({ 
		'readOnly': true,
		'step' : 0.01,
		// 'font' : 'monospace'
		'displayInput' : false
	});

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
		TS = null,
		UNITS = countdown.HOURS|countdown.MINUTES|countdown.SECONDS|countdown.MILLISECONDS,
		TIMEOUT;

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
			
			// Create countdown obj
			window.clearInterval(TS);
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

					// Update progress dial
					var percent = ($.now() - START) / (END - START) * 100;
					percent = Math.round(percent*100)/100;
					console.log(percent);
					$dial.val(percent).trigger('change');

					// Timer finished
					if (ts.value < 0) {
						$dial.val(0).trigger('change');
						window.clearInterval(TS);
						return;
					}
				},
				END,
				UNITS
			);
		}
	}).focus(function() {
		$(this).select();
	});
});
