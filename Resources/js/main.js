$(document).ready(function() {
	$input = $('input');
	
	$input.each(function(){
		$(this).fitText(1.2,{minFontSize: '50px', maxFontSize: '300px'});
	});

	$input.keyup(function(event) {
		$(event.target).val( this.value.replace(/\D+/g, '') );
	});
});