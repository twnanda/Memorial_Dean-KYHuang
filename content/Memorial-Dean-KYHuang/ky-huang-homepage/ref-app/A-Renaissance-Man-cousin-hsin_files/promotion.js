YUI.add('promotion', function (Y) {
    Y.namespace('wretch');
    var W = Y.wretch;
    W.promotion = function () {
        if (Y.UA.ie !== 6 && Y.UA.ie !== 7) {
            return;
        }
        if (document.documentMode) {
            return;
        }
        if (Y.Cookie.get('remind_later')) {
            return;
        }
        var docHeight = document.documentElement.scrollHeight,
            screenHeight = window.screen.height,
            eventScroll,
            img,
            closePage,
            nodeFlash = Y.one('param'),
            isHidden = false;
        if (!browserUpdated) {
            var htmls = Y.Node.create('<div id="bg_pop" style="width:' + window.screen.width + 'px;height:' + (docHeight > screenHeight ? docHeight : screenHeight) + 'px;position:absolute;z-index:9999999;background:#000;opacity:0.5;filter:alpha(opacity=60);top:0;left:0;"><iframe width="100%" height="100%" style="filter: Alpha(opacity=0.5);"  src=""></iframe></div>'),
                browserUpdated = new Y.Overlay({
                    id: 'browser',
                    width: '630px',
                    height: '480px',
                    centered: true,
                    bodyContent: '<div id="promotion">' + '<div class="hd_link">' + '<h1>喔喔~~你的瀏覽器已經過期啦！</h1>' + '<h2>享受最不失真的無名>小站瀏覽經驗，現在就升級瀏覽器！</h2></div>' + '<div class="bd_link"></div>' + '<div class="ft_link">' + '<a class="ie" href="http://tw.promo.campaign.yahoo.net/yahooie9/index.html" target="_blank"><span></span>下載新版Internet Explorer</a>' + '<a class="firefox" href="http://downloads.yahoo.com/tw/firefox/" target="_blank"><span></span>下載新版Firefox</a>' + '<a class="later" href="#"><span></span>下次再說</a></div></div>',
                    visible: false,
                    zIndex: 10000000
                }).render();
            Y.one('body').prepend(Y.one(htmls));
        }
        
        if (Y.UA.ie === 7) {
            browserUpdated.centered = function () {
                var nodeBrowser = Y.one('#browser');
                nodeBrowser.setStyles({'position': 'fixed', 'left': '50%', 'top': '50%'});
                nodeBrowser.get('firstChild').setStyles({'position': 'relative', 'left': '-' + nodeBrowser.get('region').width / 2 + 'px', 'top': '-' + nodeBrowser.get('region').height / 2 + 'px'});
            };
        }
        eventScroll = Y.one('window').on('scroll', function() {
            Y.one('#bg_pop').setStyle('height', document.documentElement.scrollHeight+'px');
        });
        if (nodeFlash && nodeFlash.ancestor()) {
            nodeFlash.ancestor().setStyle('visibility', 'hidden');
            isHidden = true;
        }
        img = new Image();
        closePage = function () {
            browserUpdated.hide();
            Y.one(htmls).setStyle('display', 'none');
            Y.detach(eventScroll);
            if (isHidden && nodeFlash && nodeFlash.ancestor()) {
                nodeFlash.ancestor().setStyle('visibility', 'visible');
            }
        };
        img.src = 'http://www.wretch.cc/ajax/album/ajax_browser_alert.php?' + (new Date()).getTime();
        Y.one('.later').on('click', closePage);
        Y.one('.ie').on('click', closePage);
        Y.one('.firefox').on('click', closePage);
        browserUpdated.show().centered();
    };
}, '0.1.1', {
    requires: ['overlay', 'cookie']
});

YUI().use('promotion', function (Y) {
    Y.namespace('wretch');
    var W = Y.wretch;
    W.promotion();
});
