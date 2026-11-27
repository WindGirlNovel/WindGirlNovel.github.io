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
  function bar(){var b=document.createElement('div');b.className='pbar';
    b.innerHTML='<button class="prev">'+(ru?'← назад':'← back')+'</button><span class="num"></span><button class="next">'+(ru?'дальше →':'next →')+'</button>';return b}
  var b1=bar(),b2=bar();
  var anchor=end<kids.length?kids[end]:null;
  f.insertBefore(b1,anchor);f.insertBefore(pager,anchor);f.insertBefore(b2,anchor);
  var bars=[b1,b2],cur=0;
  var rt;function redesk(){clearTimeout(rt);rt=setTimeout(function(){['.season-desk','.season-over'].forEach(function(q){var e=document.querySelector(q);if(e)e.style.height='0px'});window.dispatchEvent(new Event('resize'))},300)}
  function show(i,dir){
    i=Math.max(0,Math.min(pages.length-1,i));
    pages.forEach(function(p,j){p.classList.toggle('on',j==i);p.classList.remove('in-l','in-r')});
    if(dir){void pages[i].offsetWidth;pages[i].classList.add(dir>0?'in-r':'in-l')}
    cur=i;
    bars.forEach(function(b){b.querySelector('.num').textContent=(i+1)+' / '+pages.length;
      b.querySelector('.prev').disabled=i==0;b.querySelector('.next').disabled=i==pages.length-1});
    if(dir){var t=b1.getBoundingClientRect().top;if(t<0)window.scrollTo(0,window.scrollY+t-10)}
    redesk()}
  bars.forEach(function(b){b.querySelector('.prev').onclick=function(){if(cur>0)show(cur-1,-1)};b.querySelector('.next').onclick=function(){if(cur<pages.length-1)show(cur+1,1)}});
  var sx=0,sy=0,tr=false;
  pager.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;tr=true},{passive:true});
  pager.addEventListener('touchend',function(e){if(!tr)return;tr=false;var t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.6){if(dx<0&&cur<pages.length-1)show(cur+1,1);else if(dx>0&&cur>0)show(cur-1,-1)}},{passive:true});
  show(0,0);
})();
