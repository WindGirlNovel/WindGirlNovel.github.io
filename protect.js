/* © Wind Girl Novel: copy protection */
(function(){
  function editable(t){return t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]');}
  ['copy','cut','contextmenu','dragstart','selectstart'].forEach(function(ev){
    document.addEventListener(ev,function(e){if(!editable(e.target)){e.preventDefault();}},{capture:true});
  });
  function vids(){document.querySelectorAll('video').forEach(function(v){
    v.setAttribute('controlsList','nodownload noplaybackrate noremoteplayback');
    v.setAttribute('disablePictureInPicture','');v.disablePictureInPicture=true;
    v.setAttribute('draggable','false');});
    document.querySelectorAll('img').forEach(function(i){i.setAttribute('draggable','false');});}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',vids);}else{vids();}
})();
