// SETUP WINDOW CONTROL
$(document).ready(function (){

	// WINDOW HIDE
	$(".minimize").click(function (){
		event.preventDefault();
		system.window.target.hide();
	});

	$(".maximize").click(function () {
		event.preventDefault();
		if (!system.window.target.isMaximized()){
			system.window.target.maximize();
		} else {
			system.window.target.unmaximize();
		}
	});

	// WINDOW CLOSE
	$(".close").click(function (){
		event.preventDefault();
		system.window.target.hide();
		Titanium.App.exit();
	});

	// TRAY ICON EVENT
	// WINDOW SHOW
	tray = Titanium.UI.addTray("app://default_app_logo.png", function(evt){
		if(evt.getType() == 'clicked') {
			if (!system.window.target.isVisible()) {
				system.window.target.show();
			}
		}
	});

	// WINDOW DRAG
	$("#window-drag").mousedown( function(event){
		event.preventDefault();
		if (!system.window.target.isMaximized()){
			var diffX = event.pageX;
			var diffY = event.pageY;

			$(document).mousemove(function(event){
				event.preventDefault();
				if (event.screenY - diffY < screen.height-100)
				system.window.target.moveTo(event.screenX - diffX, event.screenY - diffY);
			});
		}
	});

	$("#window-drag").dblclick(function(event){
		event.preventDefault();
		if (!system.window.target.isMaximized())
			system.window.target.maximize();
		else
			system.window.target.unmaximize();
	});


	// WINDOW RESIZE
	$("footer .resize").mousedown(function (event){
		event.preventDefault();
		if ($(this).css('display') == 'block') {
			var xstart = event.clientX;
			var ystart = event.clientY;
			var hstart = system.window.target.getHeight();
			var wstart = system.window.target.getWidth();

			$(document).mousemove(function(event){
				system.window.target.setWidth(wstart + event.clientX - xstart);
				system.window.target.setHeight(hstart + event.clientY - ystart);
			});
		}
	});

	$(document).mouseup(function(event){
		event.preventDefault();
		$(document).unbind('mousemove');
	});

	// WINDOW ON RESIZE
	Titanium.API.addEventListener(Titanium.RESIZED, function(event){
		if (!system.window.target.isMaximized()) {
			$("footer .resize").css('display', 'block');
			$(".maximize").css('background-image', 'url(../img/main-bar-cmd-maximize.png)');
		} else {
			$("footer .resize").css('display', 'none');
			$(".maximize").css('background-image', 'url(../img/main-bar-cmd-restore.png)');
		}
	});
});

// $(document).ready(function () {
// 	/*
// 	 * WINDOW HIDE
// 	 */
// 	$("#windowMinimize").click(function (){
// 		event.preventDefault();
// 		// From http://developer.appcelerator.com/question/131596/minimize-unminimize-under-windows-7
// 		// One user found if we follow this magical sequence (max-unmax-min), the
// 		// window will be responsive after restore. Confirmed on my Win 7
// 		Ti.UI.getMainWindow().maximize();
// 		Ti.UI.getMainWindow().unmaximize();
// 		Ti.UI.getMainWindow().minimize();
// 	});
//
// 	$(".maximize").click(function () {
// 		event.preventDefault();
// 		if (!Ti.UI.getMainWindow().isMaximized()){
// 			Ti.UI.getMainWindow().maximize();
// 		} else {
// 			Ti.UI.getMainWindow().unmaximize();
// 		}
// 	});
//
// 	/*
// 	 * WINDOW CLOSE
// 	 */
// 	$("#windowClose").click(function (){
// 		event.preventDefault();
// 		Ti.UI.getMainWindow().close();
// 		//system.window.target.hide();
// 		Ti.App.exit();
// 	});
//
// 	/*
// 	 * WINDOW "Title Bar"
// 	 */
// 	$("#windowTitleBar").mousedown(function(event){
// 		event.preventDefault();
// 		if (!Ti.UI.getMainWindow().isMaximized()){
// 			var diffX = event.pageX;
// 			var diffY = event.pageY;
//
// 			$(document).mousemove(function(event){
// 				event.preventDefault();
// 				if (event.screenY - diffY < screen.height-100)
// 					Ti.UI.getMainWindow().moveTo(event.screenX - diffX, event.screenY - diffY);
// 			});
// 		}
// 	});
//
// 	$(document).mouseup(function(event){
// 		event.preventDefault();
// 		$(document).unbind('mousemove');
// 	});
//
// 	$("#windowTitleBar").dblclick(function(event){
// 		event.preventDefault();
// 		if (!Ti.UI.getMainWindow().isMaximized())
// 			Ti.UI.getMainWindow().maximize();
// 		else
// 			Ti.UI.getMainWindow().unmaximize();
// 	});
// });
