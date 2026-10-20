const fs = require('fs');
const puppeteer = require('puppeteer-core');
const T = require('./template');
const SERVICES = require('../services');
const { S, X } = require('./reports');
const { askAI } = require('./ai');

const CHROME_PATHS = [process.env.CHROME_PATH, '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean);
let browserP = null;
function browser() {
  if (!browserP) {
    const executablePath = CHROME_PATHS.find((p) => fs.existsSync(p));
    browserP = puppeteer.launch({ executablePath, headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'] })
      .then((b) => { b.on('disconnected', () => (browserP = null)); return b; })
      .catch((e) => { browserP = null; throw e; });
  }
  return browserP;
}

async function htmlToPdf(html) {
  const b = await browser();
  const page = await b.newPage();
  try {
    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const pages = await page.evaluate(async () => {
      await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 15000))]);
      return window.__paginate();
    });
    const pdf = await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    return { pdf: Buffer.from(pdf), pages };
  } finally { await page.close(); }
}

function coverLines(svc, inp) {
  if (svc.form === 'match') return [`${inp.boy.name} & ${inp.girl.name}`, []];
  const l = [inp.dob.split('-').reverse().join('/') + (inp.tob ? `     ${inp.tob}` : '')];
  if (inp.place) l.push(inp.place);
  return [inp.name, l];
}

// Builds the full report. ai = precomputed AI JSON (optional, used for testing)
async function buildReport(order, settings, ai) {
  const svc = SERVICES.find((s) => s.slug === order.service);
  const def = S[order.service];
  if (!svc || !def) throw new Error('Unknown service');
  const inp = order.input, lang = order.language === 'hi' ? 'hi' : 'en';
  const data = def.prep(inp, order);
  if (!ai) {
    const spec = def.ai(data, inp);
    ai = await askAI(settings, { lang, report: svc.name, ...spec });
  }
  const x = X(lang, Number(inp.tz ?? inp.boy?.tz ?? 5.5));
  const [name, lines] = coverLines(svc, inp);
  const body = T.cover({ title: lang === 'hi' ? svc.hi : svc.name, name, lines, hindi: lang === 'hi' }) + def.render(data, ai, x, inp).join('');
  const html = T.doc(lang, body);
  const { pdf, pages } = await htmlToPdf(html);
  return { pdf, pages, usage: ai.__usage, html };
}

module.exports = { buildReport, htmlToPdf, browser };
