// phones: one section per page, swipe sideways like turning a page
(function(){
  if(!window.matchMedia('(max-width:700px)').matches) return;
  var f=document.querySelector('.flow'); if(!f) return;
  var kids=[].slice.call(f.children), end=kids.length;
  for(var i=0;i<kids.length;i++){ if(kids[i].matches('.heartnote,.readnote')){ end=i; while(end>0&&kids[end-1].tagName=='STYLE') end--; break; } }
  var items=kids.slice(0,end),pages=[];
  function isFloat(k){if(!k)return false;var cs=getComputedStyle(k);return k.matches('.doodle,.mnote,figure,.polaroid,.sketch,img')||cs.float!='none'}
  function len(k){if(k.tagName=='STYLE'||k.tagName=='SCRIPT')return 0;var n=(k.textContent||'').replace(/\s+/g,' ').length;if(k.matches('figure,.polaroid,img,video')||k.querySelector('img,video'))n+=350;return n}
  var secs=items.filter(function(k){return k.matches('h2.sec')}).length,groups=[],g=[];
  if(secs>=2){var hasH=false;items.forEach(function(k){if(k.matches('h2.sec')&&hasH){groups.push(g);g=[];hasH=false}if(k.matches('h2.sec'))hasH=true;g.push(k)});groups.push(g)}
  else{var T=850,c=0;items.forEach(function(k,i){var prev=items[i-1];
      var head=k.matches('h2,h3');var ok=g.length&&!isFloat(prev)&&!(prev&&prev.matches('h2,h3'))&&(k.matches('p,h2,h3,blockquote,figure,.doodle,.mnote,.polaroid,div:not(.clear)'));
      if(ok&&(c>=T||(head&&c>=T*.45))){groups.push(g);g=[];c=0}
      g.push(k);c+=len(k)});
    groups.push(g);
    var tot=function(a){return a.reduce(function(s,k){return s+len(k)},0)};
    if(groups.length>1&&tot(groups[groups.length-1])<520){var l=groups.pop();groups[groups.length-1]=groups[groups.length-1].concat(l)}}
  if(groups.length<2) return;
  groups.forEach(function(a){var d=document.createElement('div');d.className='pg';a.forEach(function(k){d.appendChild(k)});pages.push(d)});
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
