if( typeof pushCollect == 'undefined') 
pushCollect = {
  setForm: function(formId){    
   var oForm;  
   if(typeof formId == 'string'){  
    // Determine if the argument is a form id or a form name.  
    // Note form name usage is deprecated, but supported  
    // here for backward compatibility.  
    oForm = (document.getElementById(formId) || document.forms[formId]);  
   }  
   else if(typeof formId == 'object'){  
    // Treat argument as an HTML form object.  
    oForm = formId;  
   }  
   else{  
    return;  
   }  
   var hasSubmit = false;  
   var sFormData = '';  
   for (var i=0; i<oForm.elements.length; i++){  
    oElement = oForm.elements[i];  
    oDisabled = oElement.disabled;  
    oName = oElement.name;  
    oValue = oElement.value;  
    
    // Do not submit fields that are disabled or  
    // do not have a name attribute value.  
    if(!oDisabled && oName)  
    {  
     switch(oElement.type)  
     {  
      case 'select-one':  
      case 'select-multiple':  
       for(var j=0; j<oElement.options.length; j++){  
        if(oElement.options[j].selected){  
         if(window.ActiveXObject){  
          sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].attributes['value'].specified?oElement.options[j].value:oElement.options[j].text) + '&';  
         }  
         else{  
          sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oElement.options[j].hasAttribute('value')?oElement.options[j].value:oElement.options[j].text) + '&';  
         }  
        }  
       }  
       break;  
      case 'radio':  
      case 'checkbox':  
       if(oElement.checked){  
        sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';  
       }  
       break;  
      case 'file':  
       // stub case as XMLHttpRequest will only send the file path as a string.  
      case undefined:  
       // stub case for fieldset element which returns undefined.  
      case 'reset':  
       // stub case for input type reset button.  
      case 'button':  
       // stub case for input type button elements.  
       break;  
      case 'submit':  
       if(hasSubmit === false){  
        if(this._hasSubmitListener && this._submitElementValue){  
         sFormData += this._submitElementValue + '&';  
        }  
        else{  
         sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';  
        }  
    
        hasSubmit = true;  
       }  
       break;  
      default:  
       sFormData += encodeURIComponent(oName) + '=' + encodeURIComponent(oValue) + '&';  
     }  
    }  
   }  
     
   sFormData = sFormData.substr(0, sFormData.length - 1);  
   return sFormData;  
  },

  formatRecommend : function(cnt){
    if(cnt>=2000)
      return 'purple';
    if(cnt>=1000)
      return 'yellow';
    if(cnt>=500)
      return 'green';
    if(cnt>=150)
      return 'blue';
    if(cnt>=50)
      return 'red';
    return '#000';
  },

  pushCallback: function(oData){
    
    if(oData.addr){
      alert(oData.mesg);
      document.location.href = (oData.addr);
    }
    else if(oData.status){
      var cnt = $('recommendcount');
      cnt.innerHTML = oData.mesg;
      cnt.style.color = pushCollect.formatRecommend(oData.mesg);
      alert('推薦成功！');
    }
    else{
      alert(oData.mesg);
    }
  },
  
  collectCallback: function(oData){
    // must sign in
    if(oData.addr){
      alert(oData.mesg);
      document.location.href = (oData.addr);
    }
    else if(oData.status){
        var xy = YUD.getRegion('push');
        document.body.appendChild($('collection_comments'));
        YUD.setXY('collection_comments', [xy.left, xy.bottom]);
        $('collection_comments').style.visibility = 'visible';
    }
    else{
      alert(oData.mesg);
    }
  },

  collectCallbackAlert: function(oData){
    $('showCollector').innerHTML = '收藏(' + oData.count + ')';
    alert(oData.mesg);
  }
}

YUE.onDOMReady( function(){

  // 推推
  YUE.on('pushbtn', 'click', function(){
    YUG.script('/blog/ajax_check_recommend.php?owner='+ownerid+'&aid='+aid+'&func=recommend&callback=pushCollect.pushCallback'+ajax_crumb+'&ts='+new Date().valueOf());
  });

  // 收藏第一步, 確認是否已經收藏, 未收藏則出現form
  YUE.on('collectbtn', 'click', function(){
    YUG.script('/blog/ajax_check_recommend.php?owner='+ownerid+'&aid='+aid+'&func=collect&callback=pushCollect.collectCallback'+ajax_crumb+'&ts='+new Date().valueOf());
  
  });

  // 收藏第二步
  YUE.on('word_form_pop', 'submit', function(e){
    YUG.script('/blog/do_collect.php?' + pushCollect.setForm(this) + '&callback=pushCollect.collectCallbackAlert&ts=' + new Date().valueOf());
    YUE.stopEvent(e);
  })

  // 誰來收藏
  YUE.on('showCollector', 'click', function(){
    YUG.script(ajax_server_name + '/blog/collector.php?owner='+ownerid+'&aid='+aid+'&func=collect&callback=collectorPicker.showPage&p=1');
  })
  var cnt = $('recommendcount');
  cnt.style.color = pushCollect.formatRecommend(cnt.innerHTML);
})

if( typeof collectorPicker == 'undefined') 
collectorPicker = {
  config : {
    perpage: 10,
    lang_empty: '尚無收藏'
  },
  
  genbd: function(oUser, total){
    var innerhtml = '';
    if(oUser===null) innerhtml = this.config.lang_empty;
    for(var i in oUser){
      if(typeof oUser[i] == 'object')
      innerhtml += 
         ['<div class="friend-picker-cell">', '<p>', '<label>', '<span>', '</span>', '<img src="', oUser[i].cover ,'">' ,'</label>', '<span>', oUser[i].userid, '</span>', '</p>', '</div>'].join(' ');

    }
    document.getElementById('friend-picker-bd').innerHTML = innerhtml;
  },

  genPagination: function(total, cIndex){
    var innerhtml = '';

    // no need for "...", just display all paginations
    if(total/this.config.perpage<=12){
      for(var i=0; i<Math.ceil(total/this.config.perpage); i++){
        if(cIndex==i+1) innerhtml += '<a class="on">' + (i+1) + '</a>';
        else innerhtml += '<a>'+(i+1)+ '</a>';
      }
    }
    // total=500, 10 perpage, 50 pages, cIndex=1
    // '1' 2 3 4 5 6 7 8 9 10 ... 49 50
    // total=500, 10 perpage, 50 pages, cIndex=7
    // 1 2 3 4 5 6 '7' 8 9 10 ... 49 50
    else if(cIndex<=7){
      for(var i=0; i<Math.max(cIndex+3, 10); i++){
        if(cIndex==i+1) innerhtml += '<a class="on">'+(i+1)+'</a>';
        else innerhtml += '<a>' + (i+1) + '</a>';
      }
      innerhtml += '<a class="more">...</a>';
      innerhtml += '<a>' + Math.ceil(total/this.config.perpage-1)+ '</a>';
      innerhtml += '<a>' + Math.ceil(total/this.config.perpage) + '</a>';
    }
    // total=500, 10 perpage, 50 pages, cIndex=45 
    // 1 2 ... 43 44 '45' 46 47 48 49 50
    // total=500, 10 perpage, 50 pages, cIndex=50
    // 1 2 ... 43 44 45 46 47 48 49 '50'
    else if(cIndex>=total/this.config.perpage-5){
      innerhtml += '<a>1</a>'; 
      innerhtml += '<a>2</a>'; 
      innerhtml += '<a class="more">...</a>';
      
      for(var i=Math.min(cIndex-3, Math.ceil(total/this.config.perpage)-8); i<total/this.config.perpage; i++){
        if(i+1==cIndex) innerhtml += '<a class="on">' + (i+1) + '</a>';
        else innerhtml += '<a>' + (i+1) + '</a>';
      }
    }
    // total=500, 10 perpage, 50 pages, cIndex=8
    // 1 2 ... 6 7 8 9 10 ... 49 50
    // total=500, 10 perpage, 50 pages, cIndex=44
    // 1 2 ... 42 43 44 45 46 ... 49 50
    else{
      innerhtml += '<a>1</a>'; 
      innerhtml += '<a>2</a>'; 
      innerhtml += '<a class="more">...</a>';
      for(var i=cIndex-3; i<cIndex+2; i++){
        if(cIndex==i+1) innerhtml += '<a class="on">' + (i+1) + '</a>';
        else innerhtml += '<a>' +(i+1)+ '</a>';
      }
      innerhtml += '<a class="more">...</a>';
      innerhtml += '<a>' + Math.ceil(total/this.config.perpage-1)+ '</a>';
      innerhtml += '<a>' + Math.ceil(total/this.config.perpage) + '</a>';
    }

    //innerhtml += '</p>';
    document.getElementById('friend-picker-pagination').innerHTML = innerhtml;
    
  },

  showPage: function(oUser, total, cIndex){
    this.genbd(oUser, total);
    var region = YUD.getRegion('showCollector');

    if(total >= this.config.perpage) this.genPagination(total, cIndex);
    document.body.appendChild($('friend-picker'));
    YUD.setXY('friend-picker', [region['left'], region['bottom']]);
    document.getElementById('loading').style.display = 'none';
    document.getElementById('friend-picker').style.visibility = 'visible';

    var cells = document.getElementById('friend-picker-bd').getElementsByTagName('div');
    for(var i=0; i<cells.length; i++){
      cells[i].onclick = function(){
        //document.getElementById('friend-picker').style.visibility = 'hidden';
        var id = YAHOO.lang.trim(this.getElementsByTagName('span')[1].innerHTML);
        window.open('/blog/' + id +'&collection_order=cate');
      }

      if(document.attachEvent){
        cells[i].attachEvent('onmouseenter', function(){ YUD.addClass(window.event.srcElement, 'on')});
        cells[i].attachEvent('onmouseleave', function(){ YUD.removeClass(window.event.srcElement, 'on')});
      }
    }
  }
};

// click on closebtn
YUE.on('friend-picker-closebtn', 'click', function(){
    $('friend-picker').style.visibility = 'hidden';
})


// click on the pagination
YUE.on('friend-picker-pagination', 'click', function(e){
  var target = YUE.getTarget(e);

  if( (target.parentNode) && 
    (target.parentNode.id) && 
    (target.parentNode.id=='friend-picker-pagination')){
      document.getElementById('loading').style.display = 'block';
      YUG.script(ajax_server_name + '/blog/collector.php?p='+target.innerHTML+'&owner='+ownerid+'&aid='+aid+'&func=collect&callback=collectorPicker.showPage');
  }

})

var withinElement = function(event, elem) {  
  var parent = YUE.getTarget(event);

  while ( parent && parent != elem ) 
    try { parent = parent.parentNode; } 
    catch(error) { parent = elem; }  
  return parent == elem;  
};  

YUE.on(document.body, 'click', function(e){
  if(!withinElement(e, $('friend-picker'))){
    $('friend-picker').style.visibility = 'hidden';
  }
  if(!withinElement(e, $('collection_comments'))){
    if( YUE.getTarget(e).parentNode.className != 'recommend_collect')
      $('collection_comments').style.visibility = 'hidden';
  }
})
     
function fixImgWidth()
{
  var YUD = YAHOO.util.Dom,
      YUE = YAHOO.util.Event;
  var innertexts = YUD.getElementsByClassName('innertext');
  var content = YUD.get('content');
  var rgn = YUD.getRegion(content);
  var maxWidth = rgn.right - rgn.left
  var paddingLeft = YUD.getStyle(innertexts[0], 'padding-left');
  if( paddingLeft=='auto' ) paddingLeft = 0;
  var paddingRight = YUD.getStyle(innertexts[0], 'padding-right');
  if( paddingRight=='auto' ) paddingRight = 0;

  var offsetPadding = parseInt( paddingLeft, 10 ) + parseInt( paddingRight, 10 ); 

  YUD.batch(innertexts, function(el){
      var imgs = el.getElementsByTagName('img');
      var marginLeft = YUD.getStyle(imgs[0], 'margin-left');
      var fix = function (img) {
        if ( img.width > maxWidth ){
            YUD.setStyle(img, 'maxWidth', maxWidth - offset+'px' );
            YUD.setStyle(img, 'width', maxWidth - offset+'px' );
        }
      };
      if( marginLeft=='auto' ) marginLeft = 0;

      var marginRight = YUD.getStyle(imgs[0], 'margin-right');
      if( marginRight=='auto' ) marginRight = 0;

      var offsetMargin = parseInt( marginLeft, 10 ) + parseInt( marginRight, 10 );
      if ( imgs.length > 0) {
        var offset = offsetPadding + offsetMargin;
        YUD.batch(imgs, function(img){
            if (img.width) {
                fix(img);
            } else {
                var fetch = new Image;
                fetch.src = img.src;
                fetch.onload = function() {
                    fix(img);
                };
            }
       });
    }
  });

}
YUE.onContentReady('bigcontainer', fixImgWidth);

