(function(){
    var YUD = YAHOO.util.Dom,
        YUE = YAHOO.util.Event;

    var dArticle = YUD.get('content')||YUD.get('my-main')||YUD.get('join-description')||YUD.get('event-list'),
		dCheckbox = '<input class="set-antiphishing" type="checkbox" id="set-antiphishing">',
		bCfg = document.getElementsByName('check_url')[0]||null;

    var phishingCheck = function (url, target){
        /**
         *  check url if it's in whitelist 
         */
		var reg = /(?=\.yahoo\.com\/|\.yahoo\.com\.tw\/|\.wretch\.cc\/|\/\/wretch\.cc\/)/ig;
		try{
			if(!reg.test(url)){
				requestUrlDB(url, target);
			}else{
				if(target==='_blank'){
					window.open(url);
				}else{
					location.href = url;
				}
			}
		}catch(e){}
    };
	var panelHandler = function(o){
		switch(o.category){
			case 'white':
				goHandler();
			break;
			case 'none':
				if(bCfg.value==='off'){
					goHandler();		
				}else{
					panel.setBody('<div class="antiphishing-wrapper notice"><p class="antiphishing-warning">' + o.message +
									'</p>' + '<span class="antiphishing-note">' + 
									 o.note + '</span>' +
									'<p class="antiphishing-warning">'+ dCheckbox + 
									'<label for="set-antiphishing">' + o.reminder + '</label><span id="save-msg"></span></p></div>');
					panel.cfg.queueProperty('buttons', [
						{text: o.confirm, handler: goHandler, isDefault:true},
						{text: o.cancel, handler: stayHandler}
					]);
					panel.render(document.body);
					panel.show();
				}
			break;
			case 'grey':
			case 'black':
				panel.setBody('<div class="antiphishing-wrapper"><p class="antiphishing-warning">' + o.message + '</p>' +
					'<span class="antiphishing-note"><a href="http://tw.info.yahoo.com/seal/index.html" target="_blank">' + o.note + 
					'</a></span></div>');
				panel.cfg.queueProperty('buttons', [
					{text: o.cancel, handler: stayHandler, isDefault:true},
					{text: o.next, handler: stopHandler}
				]);
				panel.o = o;
				panel.render(document.body);
				panel.show();
			break;
		}
	};
    var requestUrlDB = function(url ,target){
    /**
     *  make a request by ajax, then handle returned data
     */
		var sUrl = '/ajax/common/ajax_check_url.php?url='+encodeURI(url);
		panel.target = target;
		panel.url = url;
		var callback = {
			cache:false,
			success:function(o){
				var oResult = YAHOO.lang.JSON.parse(o.responseText);
				panelHandler(oResult);
			},
			faliure:function(o){
			}
		};
		var transaction = YAHOO.util.Connect.asyncRequest('GET', sUrl, callback, null);
    };
	var setCfg = function(checked){
		var set = 'on',
			sUrl = '/ajax/common/ajax_set_url_cookie.php';
		var callback = {
			cache:false,
			success:function(o){
				var oResult = YAHOO.lang.JSON.parse(o.responseText);
				YUD.get('save-msg').innerHTML = oResult.message;
				bCfg.value = set;
			},
			faliure:function(o){
			}
		};
		if(checked){
			set = 'off';
		}
		var transaction = YAHOO.util.Connect.asyncRequest('GET', sUrl + '?status=' + set, callback, null);
	};
	var goHandler = function(){
		if(panel.target==='_blank'){
			window.open(panel.url);
		}else{
			location.href = panel.url;
		}
		try{
			panel.hide();
		}catch(e){}
	};
	var stayHandler = function(){
		panel.hide();
	};
	var stopHandler = function(){
		panel.setBody('<div class="antiphishing-wrapper"><p class="antiphishing-warning">' + this.o.message_again + '</p>' +
			'<span class="antiphishing-note">' + this.o.note_again + '</span></div>');
		panel.cfg.queueProperty('buttons', [
			{text: this.o.cancel, handler: stayHandler, isDefault:true},
			{text: this.o.next, handler: goHandler}
		]);
		panel.render(document.body);	
		panel.show();
	};
    var init = function(){
        YUE.on(dArticle, 'click', function(e){
            var eT = YUE.getTarget(e);
			var urlReg = /^http\:\/\/|https\:\/\//;
			var dParent = YUD.getAncestorByTagName(eT, 'a');
			if(dParent){
				eT = dParent;
			}
			if(eT.tagName.toLowerCase() === 'a'&&eT.getAttribute('onclick')===null){
                try{
					if(urlReg.test(eT.getAttribute('href'))&&!YUD.hasClass(eT.parentNode, 'shortcut')){
						YUE.stopEvent(e);
						phishingCheck(eT.getAttribute('href', 1), eT.getAttribute('target'));
					}
                }catch(e){
				
				}
            }
        });
        YUE.on('panel', 'click', function(e){
            var eT = YUE.getTarget(e);
			if(YUD.hasClass(eT, 'set-antiphishing')){
				setCfg(eT.checked);
			}
		});
    };
    /**
     * appendChild and generate simpleDialog  
     */
	var panel = new YAHOO.widget.SimpleDialog('panel', { 
		width: '390px', 
		fixedcenter: true,
		modal: true,
		visible: false,
		draggable: false
	});
	if(dArticle){
		init();
	}
})();
