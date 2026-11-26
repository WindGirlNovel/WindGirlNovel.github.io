// phones: page through the tickets sideways, with dots and arrows
(function(){
  var c=document.querySelector('.coll.scatter'); if(!c) return;
  var bar=document.querySelector('.swipebar'); if(!bar) return;
  var cards=[].slice.call(c.querySelectorAll(':scope > .tk'));
  var dots=bar.querySelector('.dots'); dots.innerHTML=cards.map(function(){return '<i></i>'}).join('');
  var ds=[].slice.call(dots.children), num=bar.querySelector('.num');
  function cur(){var mid=c.scrollLeft+c.clientWidth/2,best=0,bd=1e9;cards.forEach(function(k,i){var m=k.offsetLeft+k.offsetWidth/2,d=Math.abs(m-mid);if(d<bd){bd=d;best=i}});return best}
  function upd(){var i=cur();ds.forEach(function(d,j){d.className=j==i?'on':''});if(num)num.textContent=(i+1)+' / '+cards.length}
  function go(d){var i=Math.max(0,Math.min(cards.length-1,cur()+d));var k=cards[i];c.scrollTo({left:k.offsetLeft-(c.clientWidth-k.offsetWidth)/2,behavior:'smooth'})}
  bar.querySelector('.prev').onclick=function(){go(-1)}; bar.querySelector('.next').onclick=function(){go(1)};
  c.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true}); upd();
})();
