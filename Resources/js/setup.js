$(document).ready(function() {
	/*
	 * WINDOW HIDE
	 */
	$("#windowMinimize").click(function(){
		event.preventDefault();
		// From http://developer.appcelerator.com/question/131596/minimize-unminimize-under-windows-7
		// One user found if we follow this magical sequence (max-unmax-min), the
		// window will be responsive after restore. Confirmed on my Win 7
		Ti.UI.getMainWindow().maximize();
		Ti.UI.getMainWindow().unmaximize();
		Ti.UI.getMainWindow().minimize();
	});

	$(".maximize").click(function() {
		event.preventDefault();
		if (!Ti.UI.getMainWindow().isMaximized()){
			Ti.UI.getMainWindow().maximize();
		} else {
			Ti.UI.getMainWindow().unmaximize();
		}
	});

	/*
	 * WINDOW CLOSE
	 */
	$("#windowClose").click(function(){
		event.preventDefault();
		Ti.UI.getMainWindow().close();
		//system.window.target.hide();
		Ti.App.exit();
	});

	/*
	 * WINDOW "Title Bar"
	 */
	$("#windowTitleBar").mousedown(function(event){
		event.preventDefault();
		if (!Ti.UI.getMainWindow().isMaximized()){
			var diffX = event.pageX;
			var diffY = event.pageY;

			$(document).mousemove(function(event){
				event.preventDefault();
				if (event.screenY - diffY < screen.height-100)
					Ti.UI.getMainWindow().moveTo(event.screenX - diffX, event.screenY - diffY);
			});
		}
	});

	$(document).mouseup(function(event){
		event.preventDefault();
		$(document).unbind('mousemove');
	});

	$("#windowTitleBar").dblclick(function(event){
		event.preventDefault();
		if (!Ti.UI.getMainWindow().isMaximized())
			Ti.UI.getMainWindow().maximize();
		else
			Ti.UI.getMainWindow().unmaximize();
	});
});