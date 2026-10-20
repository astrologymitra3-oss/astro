// HTML building blocks for the PDF (A4 fixed pages, auto-paginated before printing)
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const toArr = (v) => (Array.isArray(v) ? v : String(v || '').split(/\n+/)).map((x) => (typeof x === 'string' ? x : x && (x.text || x.title || JSON.stringify(x)))).filter(Boolean);
const para = (t) => toArr(Array.isArray(t) ? t : String(t || '').split(/\n\s*\n|\n/)).map((p) => `<p>${esc(p)}</p>`).join('');
const list = (arr) => `<ul class="ul">${toArr(arr).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
const cell = (c) => (c && typeof c === 'object' && 'html' in c ? c.html : esc(c));
const table = (head, rows, cls = '') => `<table class="tb ${cls}">${head ? `<thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>` : ''}<tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${cell(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const kv = (rows) => table(null, rows, 'kv');
const squiggle = '<svg class="sq" width="44" height="8" viewBox="0 0 44 8"><path d="M1 5 C 8 -1, 14 9, 22 4 S 36 1, 43 5" fill="none" stroke="#9b2c3d" stroke-width="1.3"/></svg>';
const h3 = (t) => `<h3>${esc(t)}${squiggle}</h3>`;
const callout = (title, text) => `<div class="callout">${title ? `<h4>${esc(title)}</h4>` : ''}${para(text)}</div>`;
const quote = (t) => (t ? `<div class="quote"><span class="qm">&ldquo;</span>${esc(t)}</div>` : '');
const tags = (arr, cls = 'g') => `<div class="tags">${toArr(arr).map((x) => `<span class="tag ${cls}">${esc(x)}</span>`).join('')}</div>`;
const grid2 = (a, b) => `<div class="g2"><div>${a}</div><div>${b}</div></div>`;
const grid3 = (items) => `<div class="g3">${items.map((i) => `<div>${i}</div>`).join('')}</div>`;
const box = (title, sub, extra = '', cls = '') => `<div class="card ${cls}"><div class="ct">${esc(title)}</div>${sub ? `<div class="cs">${esc(sub)}</div>` : ''}${extra}</div>`;

let uid = 0;
const page = (title, sub, body) => `<section class="page" data-uid="p${++uid}"><div class="vline"></div>
  <header class="ph"><div class="pill-row"><span class="ln"></span><span class="pill">${esc(title)}</span><span class="ln"></span></div><div class="sub">${esc(sub || '')}</div></header>
  <div class="content">${body}</div>
  <footer class="pf"><span>AstrologyMitra &nbsp;|&nbsp; Vedic Astrology Report</span><span class="pn"></span><span>astrologymitra.com</span></footer></section>`;

function cover({ title, name, lines = [], hindi }) {
  const petals = Array.from({ length: 24 }, (_, i) => `<path transform="rotate(${i * 15} 150 150)" d="M150 12 C 165 30, 165 48, 150 60 C 135 48, 135 30, 150 12 Z" fill="none" stroke="#e8b46a" stroke-width="1.2"/>`).join('');
  const dots = Array.from({ length: 48 }, (_, i) => { const a = (i * 7.5 * Math.PI) / 180; return `<circle cx="${150 + 82 * Math.cos(a)}" cy="${150 + 82 * Math.sin(a)}" r="1.8" fill="#e8b46a"/>`; }).join('');
  return `<section class="page cover" data-uid="cover"><div class="vline"></div>
  <div class="mandala"><svg width="300" height="300" viewBox="0 0 300 300">${petals}${dots}<circle cx="150" cy="150" r="74" fill="none" stroke="#e8b46a"/><circle cx="150" cy="150" r="70" fill="#ee7d14" stroke="#b9560a" stroke-width="2"/><circle cx="150" cy="150" r="60" fill="none" stroke="#f6b06a" stroke-width="0.8"/></svg><div class="om">ॐ</div></div>
  <div class="ganesh">॥ श्री गणेशाय नमः ॥</div>
  <div class="band"><div class="bt">${esc(title)}</div><div class="bn">${esc(name)}</div>${lines.map((l) => `<div class="bl">${esc(l)}</div>`).join('')}</div>
  <div class="gen">${hindi ? 'प्रस्तुतकर्ता' : 'prepared by'}</div>
  <div class="brand">ASTROLOGY<span>MITRA</span></div><div class="brand2">astrologymitra.com</div>
  <svg class="wave" width="120" height="10" viewBox="0 0 120 10"><path d="M2 6 C 25 0, 40 10, 60 5 S 100 0, 118 6" fill="none" stroke="#ee7d14" stroke-width="1.5"/></svg>
  <div class="method">Lahiri (Chitrapaksha) Ayanamsa · High-precision Ephemeris · Parashari System</div></section>`;
}

// North Indian diamond chart. items: [{house, label}] ; ascSign 0-11
const HP = { 1: [150, 66, 150, 136], 2: [75, 24, 75, 64], 3: [24, 75, 62, 75], 4: [72, 146, 136, 150], 5: [24, 225, 62, 225], 6: [75, 262, 75, 238], 7: [150, 224, 150, 166], 8: [225, 262, 225, 238], 9: [276, 225, 240, 225], 10: [228, 146, 164, 150], 11: [276, 75, 240, 75], 12: [225, 24, 225, 64] };
function northChart(ascSign, items, title, sub) {
  let s = `<svg viewBox="0 0 300 300" class="nc"><rect x="1" y="1" width="298" height="298" fill="#fff" stroke="#2d2a5a" stroke-width="1.6"/><path d="M1 1 L299 299 M299 1 L1 299 M150 1 L299 150 L150 299 L1 150 Z" fill="none" stroke="#2d2a5a" stroke-width="1.3"/>`;
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

const PATTERN = `url("data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="260" height="260" viewBox="0 0 260 260"><g fill="none" stroke="#efe5d6" stroke-width="1.4"><path d="M40 40 m-14 0 a14 14 0 1 0 28 0 a10 10 0 1 0 -20 0 a6 6 0 1 0 12 0"/><g transform="translate(190 70)"><circle r="6"/><path d="M0 -6 C 8 -22, 22 -8, 6 0 C 22 8, 8 22, 0 6 C -8 22, -22 8, -6 0 C -22 -8, -8 -22, 0 -6Z"/></g><path d="M80 190 c 10 -25 35 -25 40 0 c -10 10 -30 10 -40 0z"/><path d="M200 200 m-12 0 a12 12 0 1 0 24 0 a8 8 0 1 0 -16 0"/><path d="M120 110 l 18 -6 l -4 12 l 14 4 l -16 6"/></g></svg>')}")`;

const CSS = `
@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}
body{font-family:'Nunito Sans','Noto Sans Devanagari','Noto Sans',sans-serif;color:#3b3b4f;font-size:11.2px;line-height:1.55;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hi body,.hi{font-family:'Noto Sans Devanagari','Nunito Sans',sans-serif}
.page{width:210mm;height:296.8mm;position:relative;overflow:hidden;page-break-after:always;break-after:page;display:flex;flex-direction:column;padding:11mm 13mm 0 17mm;background:#fffdf9 ${PATTERN};background-size:260px 260px}
.page:last-of-type{page-break-after:auto;break-after:auto}
.vline{position:absolute;left:6mm;top:0;bottom:0;width:3px;background:#ee7d14}
.ph{flex:0 0 auto;text-align:center;margin-bottom:6px}
.pill-row{display:flex;align-items:center;gap:0}.ln{flex:1;height:1.5px;background:#ee7d14}
.pill{border:2px solid #ee7d14;border-radius:30px;padding:7px 34px;font-family:'Comfortaa','Noto Sans Devanagari',sans-serif;font-weight:700;font-size:22px;color:#ee7d14;background:#fffdf9;white-space:nowrap}
.hi .pill{font-family:'Noto Sans Devanagari',sans-serif}
.sub{color:#777;font-size:11px;margin-top:9px}
.content{flex:1 1 auto;min-height:0;overflow:hidden;padding-top:4px}
.pf{flex:0 0 13mm;display:flex;align-items:center;justify-content:space-between;font-size:9.5px;color:#777}
.pn{display:inline-flex;width:24px;height:24px;border:1px solid #ccc;border-radius:50%;align-items:center;justify-content:center;color:#2d2a5a;font-size:10px}
h3{font-family:'Comfortaa','Noto Sans Devanagari',sans-serif;color:#2d2a5a;font-size:15px;margin:12px 0 7px;padding-bottom:5px;border-bottom:1px solid #ece4d8;position:relative}
.hi h3{font-family:'Noto Sans Devanagari',sans-serif}
h3 .sq{display:block;margin-top:2px}
h4{margin:0 0 5px;color:#2d2a5a;font-size:12.5px}
p{margin:0 0 7px;text-align:justify}
.tb{width:100%;border-collapse:collapse;margin:4px 0 10px;font-size:10.4px;background:#fff}
.tb th{background:#f39220;color:#fff;font-weight:600;text-align:left;padding:6px 8px}
.tb td{padding:5px 8px;border-bottom:1px solid #f1e6e6;vertical-align:top}
.tb tr:nth-child(even) td{background:#fde8ea}
.tb.kv td:first-child{color:#444;width:40%}.tb.kv td:last-child{color:#666}
.tb .ok{color:#2e8b57;font-weight:700}.tb .bad{color:#c9442b;font-weight:700}.tb .mid{color:#d98200;font-weight:700}
.callout{background:#fdeef0;border-left:6px solid #ee7d14;padding:11px 15px;margin:10px 0}
.callout h4{color:#b9560a}
.quote{background:#f6f1ec;border-left:6px solid #ee7d14;padding:13px 18px 13px 40px;margin:12px 0;color:#ee7d14;font-style:italic;font-size:13.5px;font-family:'Poppins','Noto Sans Devanagari',sans-serif;position:relative}
.quote .qm{position:absolute;left:14px;top:6px;font-size:30px;font-weight:700}
.ul{margin:4px 0 8px;padding-left:18px}.ul li{margin-bottom:4px}
.tags{display:flex;flex-wrap:wrap;gap:7px;margin:6px 0 10px}.tag{padding:5px 14px;border-radius:20px;font-size:10px}
.tag.g{background:#e3f1e9;color:#2e7d50}.tag.r{background:#fde4e1;color:#c9442b}.tag.o{border:1px solid #ee7d14;color:#2d2a5a;background:#fff}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
.card{border:1px solid #ece4d8;border-radius:8px;padding:9px 11px;background:#fff}.ct{font-weight:700;color:#2d2a5a;font-size:12px}.cs{color:#888;font-size:10px}
.card .st{font-size:10px;margin-top:2px}.st.ok{color:#2e8b57}.st.bad{color:#c9442b}.st.mid{color:#2c6fb4}
.chartbox{text-align:center}.nc{width:100%;max-width:285px}.nc .hn{font-size:10px;fill:#ee7d14;text-anchor:middle}.nc .pl{font-size:10.5px;fill:#2d2a5a;text-anchor:middle;font-weight:600}
.cht{color:#9b2c3d;font-weight:700;font-size:11.5px;margin-top:2px}.chs{color:#888;font-size:9.5px}
.bars{width:100%}.bars .bv{font-size:11px;text-anchor:middle;fill:#2d2a5a}.bars .bl{font-size:10px;text-anchor:middle;fill:#666}.bars .bs{font-size:9px;text-anchor:middle;fill:#9b2c3d}
.yantra{text-align:center;margin:6px auto 12px}.yt{font-weight:700;color:#9b2c3d;margin-bottom:6px;font-size:13px}
.ysq{margin:0 auto;border-collapse:collapse;border:3px double #ee7d14;background:#fff8ef}.ysq td{width:62px;height:56px;text-align:center;font-size:21px;font-weight:700;color:#2d2a5a;border:1.5px solid #ee7d14}
.ys{font-size:10px;color:#888;margin-top:5px}
.tcard{border:2px solid #ee7d14;border-radius:10px;background:linear-gradient(#2d2a5a,#1b1640);color:#f7d9a8;text-align:center;padding:10px 6px;height:150px;display:flex;flex-direction:column;justify-content:center;align-items:center}
.tcard .tn{font-size:11.5px;font-weight:700;margin-top:6px}.tcard .tr{font-size:9px;color:#f39220;margin-top:3px}.tcard .ts{font-size:30px}
.tcard.rev .ts{transform:rotate(180deg)}
.row{display:flex;gap:14px;align-items:flex-start}.row>.side{flex:0 0 120px}.row>.main{flex:1}
.score{font-size:42px;font-weight:800;color:#ee7d14;text-align:center;font-family:'Comfortaa',sans-serif}.scs{text-align:center;color:#666;margin-bottom:8px}
.cover{padding:0;display:block;text-align:center}
.cover .mandala{position:relative;width:300px;height:300px;margin:120px auto 0}.cover .om{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:76px;color:#fff;font-family:'Noto Sans Devanagari',sans-serif;padding-bottom:10px}
.ganesh{color:#ee7d14;font-size:26px;margin:26px 0 28px;font-family:'Noto Sans Devanagari',sans-serif}
.band{background:#ee7d14;color:#fff;padding:26px 20px 24px}.bt{font-family:'Comfortaa','Noto Sans Devanagari',sans-serif;font-size:29px;font-weight:700;letter-spacing:.5px;text-transform:uppercase}
.bn{font-size:23px;margin-top:8px;text-transform:uppercase}.bl{font-size:12.5px;opacity:.85;margin-top:6px}
.gen{margin-top:70px;color:#666;font-size:12px}.brand{font-family:'Comfortaa',sans-serif;font-size:36px;font-weight:700;color:#2d2a5a;letter-spacing:1px;margin-top:6px}.brand span{color:#ee7d14}
.brand2{color:#ee7d14;letter-spacing:4px;font-size:12px;margin-top:2px}.wave{margin-top:14px}.method{position:absolute;bottom:22px;left:0;right:0;font-size:10px;color:#777}
.small{font-size:9.6px;color:#888}.center{text-align:center}
`;

// Moves overflowing blocks to continuation pages, then numbers pages
const PAGINATE = `function __paginate(){let n=0;for(let g=0;g<400;g++){const pages=[...document.querySelectorAll('.page:not(.cover)')];const p=pages.find(x=>{const c=x.querySelector('.content');return c&&!x.dataset.stuck&&c.scrollHeight>c.clientHeight+1});if(!p)break;const c=p.querySelector('.content');let nx=p.nextElementSibling;if(!nx||nx.dataset.cont!==p.dataset.uid){nx=p.cloneNode(true);nx.dataset.uid=p.dataset.uid+'c'+(++n);nx.dataset.cont=p.dataset.uid;nx.querySelector('.content').innerHTML='';const s=nx.querySelector('.sub');s.textContent=(s.textContent?s.textContent+' ':'')+'(contd.)';p.after(nx);}const nc=nx.querySelector('.content');const last=c.lastElementChild;if(!last){p.dataset.stuck=1;continue;}const only=c.children.length===1;const sid=last.dataset.sid||(last.dataset.sid='s'+Math.random().toString(36).slice(2));const first=nc.firstElementChild;if(last.tagName==='TABLE'&&last.tBodies[0]&&last.tBodies[0].rows.length>1&&(only||last.offsetHeight>c.clientHeight*0.35)){let t=first&&first.dataset.sid===sid?first:null;if(!t){t=last.cloneNode(false);if(last.tHead)t.appendChild(last.tHead.cloneNode(true));t.appendChild(document.createElement('tbody'));nc.prepend(t);}const rows=last.tBodies[0].rows;t.tBodies[0].prepend(rows[rows.length-1]);continue;}if((last.tagName==='UL'||last.classList.contains('callout')||last.classList.contains('prose'))&&last.children.length>1&&(only||last.offsetHeight>c.clientHeight*0.35)){let t=first&&first.dataset.sid===sid?first:null;if(!t){t=last.cloneNode(false);nc.prepend(t);}t.prepend(last.lastElementChild);continue;}if(only){p.dataset.stuck=1;continue;}nc.prepend(last);}document.querySelectorAll('.page:not(.cover) .content').forEach(c=>{let l=c.lastElementChild;const pg=c.closest('.page');const nx=pg.nextElementSibling;if(l&&/^H[34]$/.test(l.tagName)&&nx&&nx.dataset.cont===pg.dataset.uid){nx.querySelector('.content').prepend(l);}});document.querySelectorAll('.page').forEach((p,i)=>{const e=p.querySelector('.pn');if(e)e.textContent=i+1;});return document.querySelectorAll('.page').length;}`;

function doc(lang, body) {
  return `<!doctype html><html lang="${lang}" class="${lang === 'hi' ? 'hi' : ''}"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@500;700&family=Nunito+Sans:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700&family=Poppins:ital,wght@1,400&display=block" rel="stylesheet">
<style>${CSS}</style><script>${PAGINATE}</script></head><body>${body}</body></html>`;
}

module.exports = { esc, para, list, table, kv, h3, callout, quote, tags, grid2, grid3, box, page, cover, northChart, bars, square, doc, toArr };
