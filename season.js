/* Seasonal layer: autumn leaves, winter snow and fir, spring petals, summer pressed flowers.
   The season follows the current month, so the site changes on its own.
   Things lie on the desk around the notebook (mostly in the empty space on the right)
   and a few have fallen onto the pages. */
(function () {
  var m = new Date().getMonth(); // 0 = Jan
  var season = (m >= 8 && m <= 10) ? "autumn" : (m === 11 || m <= 1) ? "winter" : (m >= 2 && m <= 4) ? "spring" : "summer";
  var forced = (location.search.match(/season=(\w+)/) || [])[1];
  if (!forced) forced = document.documentElement.getAttribute("data-season");
  if (forced) season = forced;

  var MAPLE = "M50 4 L57 26 L72 16 L68 38 L92 34 L76 52 L88 60 L62 64 L64 88 L52 72 L50 96 L48 72 L36 88 L38 64 L12 60 L24 52 L8 34 L32 38 L28 16 L43 26 Z";
  var OVAL = "M50 6 C 76 22, 82 62, 50 94 C 18 62, 24 22, 50 6 Z";
  var palettes = {
    autumn: ["#C0562B", "#D9822B", "#E3A33A", "#A8452A", "#B9A03B", "#8E5A2B", "#CF6A2E"],
    spring: ["#F4C6D2", "#F7D9E2", "#EDB3C4", "#FFFFFF", "#F9E4EA"],
    summer: ["#E9C46A", "#F2D59B", "#C9A7D8", "#F4A6A6", "#FFFFFF"],
    winter: ["#FFFFFF", "#EEF3F7", "#DCE8F0"]
  };

  // optional extra per page: <html data-petals="rose"> scatters red rose petals among the seasonal things
  var petals = document.documentElement.getAttribute("data-petals");
  var ROSE = ["#8E0E18", "#A3121E", "#B3141F", "#C21A26", "#7A0C14"];
  function petal() {
    var c = ROSE[Math.floor(rnd() * ROSE.length)];
    // a soft rose petal: wide rounded top with a small notch, narrow base, one edge curling
    return '<path d="M50 95 C34 90 14 70 11 46 C9 26 22 12 36 11 C42 11 46 14 50 13 C55 12 60 9 66 11 C80 14 92 28 89 48 C86 70 66 90 50 95 Z" fill="' + c + '" stroke="rgba(60,0,0,.28)" stroke-width="1"/>' +
           '<path d="M16 44 C14 28 24 17 36 16" stroke="rgba(255,225,225,.32)" stroke-width="4" fill="none" stroke-linecap="round"/>' +
           '<path d="M64 14 C80 18 88 32 86 48 C80 38 72 26 64 14 Z" fill="rgba(0,0,0,.2)"/>' +
           '<path d="M50 90 C47 72 46 52 50 30" stroke="rgba(40,0,0,.2)" stroke-width="1.3" fill="none"/>';
  }
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function pick(a) { return a[Math.floor(rnd() * a.length)]; }

  function item(x, y, size, layer) {
    var rot = Math.floor(rnd() * 360), c = pick(palettes[season]), s = "";
    if (petals && rnd() < 0.6) {
      s = petal(); size = Math.round(size * 1.35);
    } else if (season === "autumn") {
      var shape = rnd() < 0.62 ? MAPLE : OVAL;
      s = '<path d="' + shape + '" fill="' + c + '" stroke="rgba(80,40,10,.35)" stroke-width="1.5"/>' +
          '<path d="M50 96 L50 30 M50 60 L32 44 M50 60 L68 44" stroke="rgba(70,35,10,.45)" stroke-width="2" fill="none"/>';
    } else if (season === "spring") {
      s = '<ellipse cx="50" cy="50" rx="22" ry="38" fill="' + c + '" stroke="rgba(160,90,110,.35)" stroke-width="1.5"/>';
    } else if (season === "summer") {
      if (rnd() < 0.5) {
        for (var i = 0; i < 5; i++) s += '<ellipse cx="50" cy="28" rx="13" ry="22" fill="' + c + '" opacity=".85" transform="rotate(' + (i * 72) + ' 50 50)"/>';
        s += '<circle cx="50" cy="50" r="9" fill="#C98A2B"/>';
      } else {
        for (var j = 0; j < 9; j++) s += '<circle cx="' + (20 + rnd() * 60) + '" cy="' + (20 + rnd() * 60) + '" r="' + (1.5 + rnd() * 3) + '" fill="rgba(180,150,100,.6)"/>';
      }
    } else {
      if (rnd() < 0.75) {
        for (var k = 0; k < 3; k++) s += '<path d="M50 8 L50 92 M44 18 L50 26 L56 18 M44 82 L50 74 L56 82" stroke="' + c + '" stroke-width="5" stroke-linecap="round" fill="none" transform="rotate(' + (k * 60) + ' 50 50)"/>';
      } else {
        s = '<path d="M50 96 L50 6" stroke="#5B4632" stroke-width="3"/>';
        for (var n = 0; n < 9; n++) { var yy = 14 + n * 9; s += '<path d="M50 ' + yy + ' l -20 10 M50 ' + yy + ' l 20 10" stroke="#3F6B45" stroke-width="3" stroke-linecap="round"/>'; }
      }
    }
    var op = layer === "over" ? 0.92 : 0.95;
    return '<svg viewBox="0 0 100 100" style="left:' + x + 'px;top:' + y + 'px;width:' + size + 'px;height:' + size + 'px;transform:rotate(' + rot + 'deg);opacity:' + op +
           ';filter:drop-shadow(2px 4px 3px rgba(60,40,10,.3))">' + s + '</svg>';
  }

  function draw() {
    var desk = document.querySelector(".season-desk"), over = document.querySelector(".season-over"), sheet = document.querySelector(".sheet");
    if (!desk || !sheet) return;
    seed = 7;
    var H = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    var W = document.documentElement.clientWidth;
    var r = sheet.getBoundingClientRect(), sx = window.scrollX || 0;
    var right = r.right + sx, left = r.left + sx;
    desk.style.height = H + "px"; if (over) over.style.height = H + "px";
    var out = "", outOver = "";
    var gap = W - right;                       // empty desk on the right
    var big = season === "winter" ? 34 : 54, small = season === "winter" ? 18 : 30;
    if (gap > 40) {
      var count = Math.min(220, Math.round(gap * H / 9000));
      for (var i = 0; i < count; i++) {
        var x = right - 30 + rnd() * (gap + 20), y = rnd() * H, sz = small + rnd() * (big - small);
        out += item(Math.round(x), Math.round(y), Math.round(sz), "desk");
      }
    }
    // a thin scatter in the left gutter and along the bottom
    var lc = Math.round(H / 260);
    for (var j = 0; j < lc; j++) out += item(Math.round(rnd() * Math.max(10, left - 10)), Math.round(rnd() * H), Math.round(small + rnd() * 16), "desk");
    // a few that fell onto the notebook pages, near the edges
    var oc = Math.max(4, Math.round(H / 900));
    for (var k = 0; k < oc; k++) {
      var nearRight = rnd() < 0.7;
      var ox = nearRight ? right - 70 - rnd() * 60 : left + 20 + rnd() * 60;
      outOver += item(Math.round(ox), Math.round(120 + rnd() * (H - 260)), Math.round(small + rnd() * 18), "over");
    }
    desk.innerHTML = out; if (over) over.innerHTML = outOver;
  }
  window.addEventListener("load", draw);
  window.addEventListener("resize", function () { clearTimeout(draw._t); draw._t = setTimeout(draw, 150); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();

/* Desk props: my mug, pencils and a little shaving, lying by the right edge of the notebook.
   Three drawings (desk-a/b/c.svg); each page gets one. Hidden on narrow screens. */
(function () {
  function place() {
    var old = document.getElementById("deskprop"); if (old) old.remove();
    if (window.innerWidth < 1100) return;
    var sheet = document.querySelector(".sheet"); if (!sheet) return;
    var page = (location.pathname.split("/").pop() || "index.html");
    var v = document.documentElement.getAttribute("data-prop");
    if (!v) {
      if (/^(index|ru)\.html$/.test(page) || page === "") v = "a";
      else if (/standards/.test(page)) v = "b";
      else if (/ny-11/.test(page)) v = "c";
      else { var h = 0; for (var i = 0; i < page.length; i++) h = (h * 31 + page.charCodeAt(i)) % 997; v = "abc"[h % 3]; }
    }
    var r = sheet.getBoundingClientRect();
    if (window.innerWidth - r.right < 90) return;
    var img = document.createElement("img");
    img.id = "deskprop"; img.src = "photos/desk-" + v + ".svg"; img.alt = ""; img.setAttribute("aria-hidden", "true");
    var w = 210, overlap = 95;
    img.style.cssText = "position:absolute;z-index:5;pointer-events:none;width:" + w + "px;left:" + Math.min(r.right - overlap, document.documentElement.clientWidth - w - 6) + window.scrollX + "px;top:" + (r.top + window.scrollY + (v === "a" ? 520 : 1350)) + "px;transform:rotate(" + (v === "a" ? 6 : -4) + "deg)";
    document.body.appendChild(img);
  }
  window.addEventListener("load", place);
  var t; window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(place, 200); });
})();
