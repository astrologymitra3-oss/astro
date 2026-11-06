// HTML building blocks for the PDF (A4 fixed pages, auto-paginated before printing)
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toArr = (v) => (Array.isArray(v) ? v : String(v || '').split(/\n+/)).map((x) => (typeof x === 'string' ? x : x && (x.text || x.title || JSON.stringify(x)))).filter(Boolean);
const para = (t) => toArr(Array.isArray(t) ? t : String(t || '').split(/\n\s*\n|\n/)).map((p) => `<p>${esc(p)}</p>`).join('');
const list = (arr) => `<ul class="ul">${toArr(arr).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const cell = (c) => (c && typeof c === 'object' && 'html' in c ? c.html : esc(c));
const table = (head, rows, cls = '') => `<table class="tb ${cls}">${head ? `<thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const kv = (rows) => table(null, rows, 'kv');
const squiggle = '<svg class="sq" width="70" height="8" viewBox="0 0 70 8"><path d="M0 4H28M42 4H70" stroke="#b8862b" stroke-width="1"/><path d="M35 0.5L38.5 4L35 7.5L31.5 4Z" fill="#b8862b"/></svg>';
const h3 = (t) => `<h3>${esc(t)}${squiggle}</h3>`;
const callout = (title, text) => `<div class="callout">${title ? `<h4>${esc(title)}</h4>` : ''}${para(text)}</div>`;
const quote = (t) => (t ? `<div class="quote"><span class="qm">&ldquo;</span>${esc(t)}</div>` : '');
const tags = (arr, cls = 'g') => `<div class="tags">${toArr(arr).map((x) => `<span class="tag ${cls}">${esc(x)}</span>`).join('')}</div>`;
const grid2 = (a, b) => `<div class="g2"><div>${a}</div><div>${b}</div></div>`;
const grid3 = (items) => `<div class="g3">${items.map((i) => `<div>${i}</div>`).join('')}</div>`;
const box = (title, sub, extra = '', cls = '') => `<div class="card ${cls}"><div class="ct">${esc(title)}</div>${sub ? `<div class="cs">${esc(sub)}</div>` : ''}${extra}</div>`;

let uid = 0;
let REPORT = '';
const setReport = (name) => { REPORT = name; };
const EMBLEM = (size = 30) => `<svg width="${size}" height="${size}" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="#d4651a"/><circle cx="32" cy="32" r="26.5" fill="none" stroke="#fff" stroke-width="1.4"/><text x="32" y="43" text-anchor="middle" font-size="30" fill="#fff" font-family="'Noto Sans Devanagari',sans-serif">ॐ</text></svg>`;
const page = (title, sub, body) => `<section class="page" data-uid="p${++uid}"><div class="frame"></div><div class="wm"></div>
  <div class="topbar"><span class="tb-l">${EMBLEM(22)}<b>Astrology<i>Mitra</i></b></span><span class="tb-r">${esc(REPORT)}</span></div>
  <header class="ph"><h2 class="pt">${esc(title)}</h2>${squiggle.replace('class="sq"', 'class="sq big"')}<div class="sub">${esc(sub || '')}</div></header>
  <div class="content">${body}</div>
  <footer class="pf"><span>AstrologyMitra · ${esc(REPORT)}</span><span class="pn"></span><span>astrologymitra.com</span></footer></section>`;

function cover({ title, name, lines = [], hindi }) {
  const C = 150, petals = (n, r1, r2, w, op) => Array.from({ length: n }, (_, i) => `<path transform="rotate(${(i * 360) / n} ${C} ${C})" d="M${C} ${C - r2} C ${C + w} ${C - r2 + (r2 - r1) * 0.45}, ${C + w} ${C - r1 - 4}, ${C} ${C - r1} C ${C - w} ${C - r1 - 4}, ${C - w} ${C - r2 + (r2 - r1) * 0.45}, ${C} ${C - r2} Z" fill="none" stroke="#d9b56a" stroke-width="1.1" opacity="${op}"/>`).join('');
  const dots = Array.from({ length: 72 }, (_, i) => { const a = (i * 5 * Math.PI) / 180; return `<circle cx="${C + 104 * Math.cos(a)}" cy="${C + 104 * Math.sin(a)}" r="1.3" fill="#d9b56a"/>`; }).join('');
  const corner = (rot) => `<svg class="cn" style="transform:rotate(${rot}deg)" width="70" height="70" viewBox="0 0 70 70"><path d="M2 68V20Q2 2 20 2H68" fill="none" stroke="#d9b56a" stroke-width="1.5"/><path d="M10 68V26Q10 10 26 10H68" fill="none" stroke="#d9b56a" stroke-width="0.8"/><circle cx="22" cy="22" r="4" fill="#d9b56a"/></svg>`;
  return `<section class="page cover" data-uid="cover">
  <div class="cv-frame"></div><div class="cv-frame2"></div>
  <div class="cn-wrap tl">${corner(0)}</div><div class="cn-wrap tr">${corner(90)}</div><div class="cn-wrap br">${corner(180)}</div><div class="cn-wrap bl">${corner(270)}</div>
  <div class="ganesh">॥ श्री गणेशाय नमः ॥</div>
  <div class="mandala"><svg width="300" height="300" viewBox="0 0 300 300">${petals(16, 62, 132, 20, 0.95)}${petals(16, 62, 112, 13, 0.6).replace(/rotate\((\d+(?:\.\d+)?)/g, (m, d) => `rotate(${+d + 11.25}`)}${dots}<circle cx="150" cy="150" r="58" fill="none" stroke="#d9b56a" stroke-width="1.2"/></svg><div class="emb">${EMBLEM(104)}</div></div>
  <div class="cv-title">${esc(title)}</div>
  <svg class="cv-div" width="220" height="12" viewBox="0 0 220 12"><path d="M0 6H96M124 6H220" stroke="#d9b56a" stroke-width="1"/><path d="M110 0L116 6L110 12L104 6Z" fill="#d9b56a"/><circle cx="96" cy="6" r="2" fill="#d9b56a"/><circle cx="124" cy="6" r="2" fill="#d9b56a"/></svg>
  <div class="cv-for">${hindi ? 'विशेष रूप से तैयार' : 'specially prepared for'}</div>
  <div class="cv-name">${esc(name)}</div>
  ${lines.map((l) => `<div class="cv-line">${esc(l)}</div>`).join('')}
  <div class="cv-brand">${EMBLEM(40)}<div><b>Astrology<i>Mitra</i></b><span>ज्योतिष मित्र · astrologymitra.com</span></div></div>
  <div class="method">Lahiri (Chitrapaksha) Ayanamsa · Parashari System · ${hindi ? 'पंडित जी द्वारा तैयार' : 'Prepared by Pandit ji'}</div></section>`;
}

// North Indian diamond chart. items: [{house, label}] ; ascSign 0-11
const HP = { 1: [150, 66, 150, 136], 2: [75, 24, 75, 64], 3: [24, 75, 62, 75], 4: [72, 146, 136, 150], 5: [24, 225, 62, 225], 6: [75, 262, 75, 238], 7: [150, 224, 150, 166], 8: [225, 262, 225, 238], 9: [276, 225, 240, 225], 10: [228, 146, 164, 150], 11: [276, 75, 240, 75], 12: [225, 24, 225, 64] };
function northChart(ascSign, items, title, sub) {
  let s = `<svg viewBox="0 0 300 300" class="nc"><rect x="1" y="1" width="298" height="298" fill="#fffdf7" stroke="#7a1d1d" stroke-width="1.8"/><path d="M1 1 L299 299 M299 1 L1 299 M150 1 L299 150 L150 299 L1 150 Z" fill="none" stroke="#7a1d1d" stroke-width="1.3"/>`;
  for (let h = 1; h <= 12; h++) {
    const [px, py, nx, ny] = HP[h];
    s += `<text x="${nx}" y="${ny + 4}" class="hn">${((ascSign + h - 1) % 12) + 1}</text>`;
    const ls = items.filter((i) => i.house === h).map((i) => i.label);
    const rows = [];
    for (let i = 0; i < ls.length; i += 2) rows.push(ls.slice(i, i + 2).join(' '));
    const y0 = py - ((rows.length - 1) * 12) / 2;
    rows.forEach((r, i) => (s += `<text x="${px}" y="${y0 + i * 12 + 4}" class="pl">${esc(r)}</text>`));
  }
  return `<div class="chartbox">${s}</svg><div class="cht">${esc(title)}</div>${sub ? `<div class="chs">${esc(sub)}</div>` : ''}</div>`;
}

function bars(items, max, { h = 150 } = {}) {
  const w = 640, bw = Math.min(46, (w - 20) / items.length - 10), gap = (w - items.length * bw) / (items.length + 1);
  let s = `<svg viewBox="0 0 ${w} ${h + 46}" class="bars">`;
  items.forEach((it, i) => {
    const x = gap + i * (bw + gap), bh = Math.max(2, (it.value / max) * h), y = h - bh + 14;
    s += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" fill="${it.color || '#2e8b57'}"/><text x="${x + bw / 2}" y="${y - 4}" class="bv">${esc(it.value)}</text><text x="${x + bw / 2}" y="${h + 30}" class="bl">${esc(it.label)}</text>`;
    if (it.sub) s += `<text x="${x + bw / 2}" y="${h + 42}" class="bs">${esc(it.sub)}</text>`;
  });
  return `${s}<line x1="0" y1="${h + 14}" x2="${w}" y2="${h + 14}" stroke="#ddd"/></svg>`;
}

function square(nums, title, sub) {
  return `<div class="yantra"><div class="yt">${esc(title)}</div><table class="ysq">${nums.map((r) => `<tr>${r.map((n) => `<td>${esc(n)}</td>`).join('')}</tr>`).join('')}</table>${sub ? `<div class="ys">${esc(sub)}</div>` : ''}</div>`;
}

const WM = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><g fill="none" stroke="#b8862b" stroke-width="1">' + Array.from({ length: 24 }, (_, i) => `<path transform="rotate(${i * 15} 200 200)" d="M200 40 C 222 90, 222 130, 200 150 C 178 130, 178 90, 200 40 Z"/>`).join('') + '<circle cx="200" cy="200" r="50"/><circle cx="200" cy="200" r="165"/><circle cx="200" cy="200" r="175"/></g></svg>')}")`;

const CSS = `
@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}
:root{--mar:#7a1d1d;--mar2:#5c1414;--gold:#b8862b;--gold2:#d9b56a;--saf:#c75b12;--ink:#3a2a22;--mut:#7a6a5e;--line:#eadcc4;--cream:#fdf8ef}
body{font-family:'Hind','Noto Sans Devanagari','Noto Sans',sans-serif;color:var(--ink);font-size:11.4px;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hi body{font-size:12px}
.page{width:210mm;height:296.8mm;position:relative;overflow:hidden;page-break-after:always;break-after:page;display:flex;flex-direction:column;padding:13mm 15mm 0 15mm;background:var(--cream)}
.page:last-of-type{page-break-after:auto;break-after:auto}
.frame{position:absolute;inset:6mm;border:1.2px solid var(--gold);pointer-events:none}
.frame:after{content:'';position:absolute;inset:1.4mm;border:0.6px solid var(--gold2)}
.wm{position:absolute;left:50%;top:52%;width:150mm;height:150mm;transform:translate(-50%,-50%);background:${WM} center/contain no-repeat;opacity:.07;pointer-events:none}
.topbar{position:relative;flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;border-bottom:0.8px solid var(--line);padding:1mm 1mm 2.4mm;margin-bottom:4mm}
.tb-l{display:flex;align-items:center;gap:6px}.tb-l b{font:700 13px 'Cormorant Garamond','Noto Serif',serif;color:var(--mar);letter-spacing:.3px}.tb-l i{font-style:normal;color:var(--saf)}
.tb-r{font-size:10px;color:var(--mut);letter-spacing:.5px;text-transform:uppercase}
.ph{position:relative;flex:0 0 auto;text-align:center;margin-bottom:5px}
.pt{margin:0;font:700 26px 'Cormorant Garamond','Noto Serif',serif;color:var(--mar);letter-spacing:.3px}
.hi .pt{font-family:'Tiro Devanagari Hindi','Noto Serif Devanagari',serif;font-weight:400;font-size:24px}
.sq.big{display:block;margin:3px auto 0}
.sub{color:var(--mut);font-size:10.5px;margin-top:3px;font-style:italic}
.content{position:relative;flex:1 1 auto;min-height:0;overflow:hidden;padding:4px 1mm 0}
.pf{position:relative;flex:0 0 19mm;display:flex;align-items:flex-start;justify-content:space-between;font-size:9.5px;color:var(--mut);padding:2.5mm 1mm 0;border-top:0.8px solid var(--line);margin-top:2mm}
.pn{position:relative;isolation:isolate;display:inline-flex;width:28px;height:28px;align-items:center;justify-content:center;color:var(--mar);font-size:10px;font-weight:700}
.pn:before{content:'';position:absolute;inset:4px;transform:rotate(45deg);border:1px solid var(--gold);background:#fff;z-index:-1}
h3{font:700 17px 'Cormorant Garamond','Noto Serif',serif;color:var(--mar);margin:12px 0 6px;padding-bottom:3px;border-bottom:0.8px solid var(--line)}
.hi h3{font-family:'Tiro Devanagari Hindi','Noto Serif Devanagari',serif;font-weight:400;font-size:16px}
h3 .sq{display:block;margin-top:2px}
h4{margin:0 0 4px;color:var(--mar);font-size:12.5px}
p{margin:0 0 7px;text-align:justify}
.tb{width:100%;border-collapse:collapse;margin:4px 0 10px;font-size:10.5px;background:#fff;border:0.8px solid var(--line)}
.tb th{background:var(--mar);color:#f7e6c2;font-weight:600;text-align:left;padding:6px 8px;border-bottom:2px solid var(--gold)}
.tb td{padding:5px 8px;border-bottom:0.6px solid #f1e6d3;vertical-align:top}
.tb tr:nth-child(even) td{background:#fbf3e4}
.tb.kv td:first-child{color:var(--mar);font-weight:500;width:40%}.tb.kv td:last-child{color:var(--ink)}
.tb .ok{color:#2f7a4a;font-weight:700}.tb .bad{color:#b3261e;font-weight:700}.tb .mid{color:#b06a10;font-weight:700}
.callout{background:#fff;border:0.8px solid var(--line);border-left:4px solid var(--gold);padding:10px 14px;margin:10px 0}
.callout h4{color:var(--mar);font-family:'Cormorant Garamond','Noto Serif',serif;font-size:14px}
.quote{background:var(--mar);color:#f7e6c2;padding:14px 20px 14px 46px;margin:14px 0;font:italic 600 15px 'Cormorant Garamond','Noto Serif',serif;position:relative;border-left:4px solid var(--gold)}
.hi .quote{font-family:'Tiro Devanagari Hindi','Noto Serif Devanagari',serif;font-style:normal;font-weight:400;font-size:14px}
.quote .qm{position:absolute;left:14px;top:4px;font-size:34px;color:var(--gold2)}
.ul{margin:4px 0 8px;padding-left:18px}.ul li{margin-bottom:4px}.ul li::marker{color:var(--gold)}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px}.tag{padding:4px 12px;border-radius:3px;font-size:10px}
.tag.g{background:#eef5ee;color:#2f7a4a;border:0.6px solid #cfe3d3}.tag.r{background:#fbecea;color:#b3261e;border:0.6px solid #f0cdc8}.tag.o{border:0.6px solid var(--gold);color:var(--mar);background:#fff}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}
.card{border:0.8px solid var(--line);border-top:2px solid var(--gold);padding:8px 10px;background:#fff}.ct{font-weight:700;color:var(--mar);font-size:12px}.cs{color:var(--mut);font-size:10px}
.card .st{font-size:10px;margin-top:2px}.st.ok{color:#2f7a4a}.st.bad{color:#b3261e}.st.mid{color:#1f5f9a}
.chartbox{text-align:center}.nc{width:100%;max-width:285px}.nc .hn{font-size:10px;fill:var(--saf);text-anchor:middle;font-weight:600}.nc .pl{font-size:10.5px;fill:var(--mar);text-anchor:middle;font-weight:700}
.cht{color:var(--mar);font-weight:700;font-size:11.5px;margin-top:2px;letter-spacing:.4px}.chs{color:var(--mut);font-size:9.5px}
.bars{width:100%}.bars .bv{font-size:11px;text-anchor:middle;fill:var(--mar)}.bars .bl{font-size:10px;text-anchor:middle;fill:var(--mut)}.bars .bs{font-size:9px;text-anchor:middle;fill:var(--saf)}
.yantra{text-align:center;margin:6px auto 12px}.yt{font-weight:700;color:var(--mar);margin-bottom:6px;font-size:13px}
.ysq{margin:0 auto;border-collapse:collapse;border:3px double var(--gold);background:#fffaf0}.ysq td{width:62px;height:56px;text-align:center;font-size:21px;font-weight:700;color:var(--mar);border:1.5px solid var(--gold)}
.ys{font-size:10px;color:var(--mut);margin-top:5px}
.tcard{border:2px solid var(--gold);border-radius:8px;background:linear-gradient(#6d1919,#3e0d0d);color:#f3d58f;text-align:center;padding:10px 6px;height:150px;display:flex;flex-direction:column;justify-content:center;align-items:center}
.tcard .tn{font-size:11.5px;font-weight:700;margin-top:6px}.tcard .tr{font-size:9px;color:var(--gold2);margin-top:3px}.tcard .ts{font-size:30px}
.row{display:flex;gap:14px;align-items:flex-start}.row>.side{flex:0 0 120px}.row>.main{flex:1}
.score{font:700 44px 'Cormorant Garamond','Noto Serif',serif;color:var(--mar);text-align:center}.scs{text-align:center;color:var(--mut);margin-bottom:8px}
.band{background:var(--mar);color:#f7e6c2;padding:14px 20px;border-left:4px solid var(--gold)}
.band .bt{font:700 24px 'Cormorant Garamond','Noto Serif',serif;color:#f3d58f}.band .bl{font-size:11px;opacity:.9;margin-top:3px}
.small{font-size:9.6px;color:var(--mut)}.center{text-align:center}
/* cover */
.cover{display:block;padding:0;text-align:center;background:radial-gradient(ellipse at 50% 35%,#7e2020 0%,#5c1414 45%,#3a0c0c 100%);color:#f7e6c2}
.cv-frame{position:absolute;inset:9mm;border:1.4px solid #d9b56a}.cv-frame2{position:absolute;inset:11mm;border:0.6px solid rgba(217,181,106,.6)}
.cn-wrap{position:absolute;width:70px;height:70px}.cn-wrap.tl{left:7mm;top:7mm}.cn-wrap.tr{right:7mm;top:7mm}.cn-wrap.br{right:7mm;bottom:7mm}.cn-wrap.bl{left:7mm;bottom:7mm}
.cover .ganesh{position:relative;padding-top:30mm;font:400 20px 'Tiro Devanagari Hindi','Noto Serif Devanagari',serif;color:#e7c77e;letter-spacing:.5px}
.cover .mandala{position:relative;width:300px;height:300px;margin:12mm auto 0}
.cover .emb{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.cv-title{margin-top:10mm;font:700 25px 'Cormorant Garamond','Noto Serif',serif;letter-spacing:4px;text-transform:uppercase;color:#f3d58f}
.hi .cv-title{font-family:'Tiro Devanagari Hindi','Noto Serif Devanagari',serif;letter-spacing:1px;font-weight:400;font-size:28px}
.cv-div{display:block;margin:10px auto 8px}
.cv-for{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d9b56a;margin-top:6px}
.hi .cv-for{letter-spacing:1px;text-transform:none;font-size:13px}
.cv-name{font:italic 600 46px 'Cormorant Garamond','Noto Serif',serif;color:#fff6e3;margin:4px 0 6px;letter-spacing:.5px}
.cv-line{font-size:13px;color:#ead2a6;margin-top:3px;letter-spacing:.5px}
.cv-brand{position:absolute;left:0;right:0;bottom:30mm;display:flex;align-items:center;justify-content:center;gap:10px;text-align:left}
.cv-brand b{display:block;font:700 26px 'Cormorant Garamond','Noto Serif',serif;color:#fff6e3}.cv-brand i{font-style:normal;color:#f0a35a}
.cv-brand span{font-size:10.5px;color:#d9b56a;letter-spacing:1px}
.cover .method{position:absolute;bottom:17mm;left:0;right:0;font-size:9.5px;color:#c9ab7a;letter-spacing:.5px}
`;

// Moves overflowing blocks to continuation pages, then numbers pages
const PAGINATE = `function __paginate(){let n=0;for(let g=0;g<400;g++){const pages=[...document.querySelectorAll('.page:not(.cover)')];const p=pages.find(x=>{const c=x.querySelector('.content');return c&&!x.dataset.stuck&&c.scrollHeight>c.clientHeight+1});if(!p)break;const c=p.querySelector('.content');let nx=p.nextElementSibling;if(!nx||nx.dataset.cont!==p.dataset.uid){nx=p.cloneNode(true);nx.dataset.uid=p.dataset.uid+'c'+(++n);nx.dataset.cont=p.dataset.uid;nx.querySelector('.content').innerHTML='';const s=nx.querySelector('.sub');s.textContent=(s.textContent?s.textContent+' ':'')+'(contd.)';p.after(nx);}const nc=nx.querySelector('.content');const last=c.lastElementChild;if(!last){p.dataset.stuck=1;continue;}const only=c.children.length===1;const sid=last.dataset.sid||(last.dataset.sid='s'+Math.random().toString(36).slice(2));const first=nc.firstElementChild;if(last.tagName==='TABLE'&&last.tBodies[0]&&last.tBodies[0].rows.length>1&&(only||last.offsetHeight>c.clientHeight*0.35)){let t=first&&first.dataset.sid===sid?first:null;if(!t){t=last.cloneNode(false);if(last.tHead)t.appendChild(last.tHead.cloneNode(true));t.appendChild(document.createElement('tbody'));nc.prepend(t);}const rows=last.tBodies[0].rows;t.tBodies[0].prepend(rows[rows.length-1]);continue;}if((last.tagName==='UL'||last.classList.contains('callout')||last.classList.contains('prose'))&&last.children.length>1&&(only||last.offsetHeight>c.clientHeight*0.35)){let t=first&&first.dataset.sid===sid?first:null;if(!t){t=last.cloneNode(false);nc.prepend(t);}t.prepend(last.lastElementChild);continue;}if(only){p.dataset.stuck=1;continue;}nc.prepend(last);}document.querySelectorAll('.page:not(.cover) .content').forEach(c=>{let l=c.lastElementChild;const pg=c.closest('.page');const nx=pg.nextElementSibling;if(l&&/^H[34]$/.test(l.tagName)&&nx&&nx.dataset.cont===pg.dataset.uid){nx.querySelector('.content').prepend(l);}});document.querySelectorAll('.page').forEach((p,i)=>{const e=p.querySelector('.pn');if(e)e.textContent=i+1;});return document.querySelectorAll('.page').length;}`;

function doc(lang, body) {
  return `<!doctype html><html lang="${lang}" class="${lang === 'hi' ? 'hi' : ''}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Hind:wght@400;500;600;700&family=Tiro+Devanagari+Hindi&family=Noto+Sans+Devanagari:wght@400;600;700&display=block" rel="stylesheet">
<style>${CSS}</style><script>${PAGINATE}</script></head><body>${body}</body></html>`;
}

module.exports = { setReport, esc, para, list, table, kv, h3, callout, quote, tags, grid2, grid3, box, page, cover, northChart, bars, square, doc, toArr };
