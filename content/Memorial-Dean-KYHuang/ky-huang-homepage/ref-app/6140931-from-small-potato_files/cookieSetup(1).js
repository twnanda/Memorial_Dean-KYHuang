function GetCkValue( name ) {
var dc=document.cookie;
var prefix=name+"=";
var begin=dc.indexOf("; "+prefix);
if(begin==-1) begin=dc.indexOf(prefix);
else begin+=2;
if(begin==-1) return "";
var end=document.cookie.indexOf(";",begin);
if(end==-1) end=dc.length;
return dc.substring(begin+prefix.length,end);
}
function setCookie(name,value,expiresOrNot,path,domain,secure,flag){
var url=document.URL;
var gb=url.indexOf("GB");
if(gb!=-1){          name+="GB";  }
var howLong=new Date();
howLong.setFullYear(howLong.getFullYear()+1);
var curCookie=name+"="+escape(value) +
((expiresOrNot)?";expires="+howLong.toGMTString():"") +
((path)?";path="+path:"") +
((domain)?";domain="+domain:"") +
((secure)?";secure":"");
document.cookie=curCookie;
if(flag!="null")history.go(0);
}

function setUECookie(name,value,expiresOrNot,path,domain,secure,flag){
var url=document.URL;
var gb=url.indexOf("GB");
if(gb!=-1){          name+="GB";  }
var howLong=new Date();
howLong.setFullYear(howLong.getFullYear()+1);
var curCookie=name+"="+value+
((expiresOrNot)?";expires="+howLong.toGMTString():"") +
((path)?";path="+path:"") +
((domain)?";domain="+domain:"") +
((secure)?";secure":"");
document.cookie=curCookie;
if(flag!="null")history.go(0);
}