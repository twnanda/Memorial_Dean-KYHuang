/**************************************** 
* 顯示隱藏圖層 style_display 
* 2006/11 by meiji 
* 
* 判別 style.display 的 "table-row" 
* 根據 W3C 標準，display 在 TR 的預設值應該是 table-row 
* 不過IE並不認識 table-row 
* 所以IE要用 block
* 
****************************************/ 
function style_display_on(idx)
{
	document.getElementById(idx).style.display="block"; 
} 

function style_display_off(idx)
{
	document.getElementById(idx).style.display="none"; 
}

function style_display_auto(idx)
{ 
	if (idx_id.style.display=="none")
	{ 
		style_display_on(idx);
	}
	else
	{
		document.getElementById(idx).style.display='none'; 
	} 
} 
//  End -->

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function div_style_display() { //v1.0
  var i,p,v,obj,args=div_style_display.arguments;
  for (i=0; i<(args.length-1); i+=1) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+1];
    if (obj.style) { obj=obj.style; v=(v=='Y')?'block':(v=='N')?'none':(v=='')?'none':v; }
    obj.display=v; }
}