var flag = "none";
function showhelp() {
  flag = (flag=="none")?"inline":"none";
  for(var i=0; i < document.images.length; i++) {
    var  j = document.images[i].src; n = j.length;
    if(j.substring(n-9,n)=="/help.gif"){
      document.images[i].style.display = flag;
    }
  }
}
function h(u){
  window.open("http://city.udn.com/service/qa/art.jsp?aid="+u,"help","menubar=no,status=no,toolbar=no,scrollbars=yes,resizable=yes,width=500,height=400");
}


