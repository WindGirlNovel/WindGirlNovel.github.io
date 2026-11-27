// phones: one section per page, swipe sideways like turning a page
(function(){
  if(!window.matchMedia('(max-width:700px)').matches) return;
  var f=document.querySelector('.flow'); if(!f) return;
  var kids=[].slice.call(f.children), end=kids.length;
  for(var i=0;i<kids.length;i++){ if(kids[i].matches('.heartnote,.readnote')){ end=i; while(end>0&&kids[end-1].tagName=='STYLE') end--; break; } }
  var pages=[],cur=null,hasH=false;
  for(var i=0;i<end;i++){var k=kids[i];
    if(k.matches('h2.sec')&&hasH){cur=null}
    if(!cur){cur=document.createElement('div');cur.className='pg';pages.push(cur);hasH=false}
    if(k.matches('h2.sec'))hasH=true;
    cur.appendChild(k)}
  if(pages.length<2) return;
  var ru=(document.documentElement.lang||'').indexOf('ru')==0;
  var pager=document.createElement('div');pager.className='pager';
  pages.forEach(function(p){pager.appendChild(p)});
  function bar(top){var b=document.createElement('div');b.className='pbar';
    b.innerHTML='<button class="prev">'+(ru?'← назад':'← back')+'</button><span class="num"></span><button class="next">'+(ru?'дальше →':'next →')+'</button>';return b}
  var b1=bar(true),b2=bar(false);
  var anchor=end<kids.length?kids[end]:null;
  f.insertBefore(b1,anchor);f.insertBefore(pager,anchor);f.insertBefore(b2,anchor);
  var bars=[b1,b2],last=-1;
  function idx(){return Math.round(pager.scrollLeft/pager.clientWidth)}
  var rt;function redesk(){clearTimeout(rt);rt=setTimeout(function(){['.season-desk','.season-over'].forEach(function(q){var e=document.querySelector(q);if(e)e.style.height='0px'});window.dispatchEvent(new Event('resize'))},450)}
  var lh=0;function fit(i){var h=pages[i].offsetHeight;pager.style.height=h+'px';if(h!=lh){lh=h;redesk()}}
  function upd(){var i=Math.max(0,Math.min(pages.length-1,idx()));
    bars.forEach(function(b){b.querySelector('.num').textContent=(i+1)+' / '+pages.length;
      b.querySelector('.prev').disabled=i==0;b.querySelector('.next').disabled=i==pages.length-1});
    b1.querySelector('.num').innerHTML=(i+1)+' / '+pages.length;
    fit(i);
    if(last!=-1&&i!=last){var t=b1.getBoundingClientRect().top;if(t<0)window.scrollTo({top:window.scrollY+t-10,behavior:'smooth'})}
    last=i}
  function go(d){var i=Math.max(0,Math.min(pages.length-1,idx()+d));pager.scrollTo({left:i*pager.clientWidth,behavior:'smooth'})}
  bars.forEach(function(b){b.querySelector('.prev').onclick=function(){go(-1)};b.querySelector('.next').onclick=function(){go(1)}});
  var tm;pager.addEventListener('scroll',function(){clearTimeout(tm);tm=setTimeout(upd,90)},{passive:true});
  window.addEventListener('load',function(){fit(Math.max(0,idx()))});
  [].forEach.call(pager.querySelectorAll('img,video'),function(m){m.addEventListener('load',function(){fit(Math.max(0,idx()))});m.addEventListener('loadedmetadata',function(){fit(Math.max(0,idx()))})});
  var lw=window.innerWidth;window.addEventListener('resize',function(){if(window.innerWidth!=lw){lw=window.innerWidth;fit(Math.max(0,idx()))}});
  upd();
})();
