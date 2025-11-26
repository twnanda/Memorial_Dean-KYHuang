var trackbackList = YUD.get('HiddenTrackback'),
	toggleClass = function (o, name) {
		if(YUD.hasClass(o, name)) {
			YUD.removeClass(o, name);
		} else {
			YUD.addClass(o, name)
		}
	};
YUE.on(YUD.get('trackback-switch'), 'click', function(e){
	var target = e.target || e.srcElement;
	toggleClass(target, 'hide');
	toggleClass(trackbackList, 'hide-list');
})
