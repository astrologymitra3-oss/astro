const crypto = require('crypto');
const D = require('../astro/data');
const E = require('../astro/engine');
const T = require('./template');
const { tr } = require('./i18n');

const pad = (n) => String(n).padStart(2, '0');
const fmtD = (d, tz = 5.5) => { const z = new Date(+d + tz * 3600000); return `${pad(z.getUTCDate())}-${pad(z.getUTCMonth() + 1)}-${z.getUTCFullYear()}`; };
const fmtDT = (d, tz = 5.5) => { const z = new Date(+d + tz * 3600000); return `${fmtD(d, tz)} ${pad(z.getUTCHours())}:${pad(z.getUTCMinutes())}`; };
const dms = (x) => { const d = Math.floor(x), m = Math.floor((x - d) * 60), s = Math.floor(((x - d) * 60 - m) * 60); return `${pad(d)}:${pad(m)}:${pad(s)}`; };
const geo = (v, a, b) => `${Math.floor(Math.abs(v))} ${v >= 0 ? a : b} ${pad(Math.round((Math.abs(v) % 1) * 60))}`;
const tzS = (tz) => `${tz < 0 ? '-' : '+'}${pad(Math.floor(Math.abs(tz)))}:${pad(Math.round((Math.abs(tz) % 1) * 60))}`;
const ord = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
const ageAt = (dob, when = new Date()) => Math.floor((+when - Date.parse(dob)) / E.YEAR);
const reduce = (n) => { while (n > 9) n = String(n).split('').reduce((a, b) => a + +b, 0); return n; };
const SYM = [['The Ram', 'मेढ़ा'], ['The Bull', 'वृषभ (बैल)'], ['The Twins', 'युगल'], ['The Crab', 'केकड़ा'], ['The Lion', 'सिंह'], ['The Maiden', 'कन्या'], ['The Scales', 'तराज़ू'], ['The Scorpion', 'बिच्छू'], ['The Archer', 'धनुर्धर'], ['The Sea-Goat', 'मकर'], ['The Water Bearer', 'कलशधारी'], ['The Fish', 'मछली']];
const QUAL = [['Movable', 'चर'], ['Fixed', 'स्थिर'], ['Dual', 'द्विस्वभाव']];
const DIRS = [['East', 'पूर्व'], ['South', 'दक्षिण'], ['West', 'पश्चिम'], ['North', 'उत्तर']];

function X(lang, tz = 5.5) {
  const hi = lang === 'hi', t = tr(lang);
  return {
    lang, hi, t, tz,
    sign: (i) => (hi ? D.SIGNS_HI[i] : D.SIGNS[i]),
    pl: (p) => (hi ? D.PL_HI[p] || p : p),
    ab: (p) => (hi ? D.PL_AB_HI[p] : D.PL_AB[p]),
    nak: (i) => (hi ? D.NAKS_HI[i] : D.NAKS[i]),
    pick: (pair) => (Array.isArray(pair) ? pair[hi ? 1 : 0] : pair),
    hs: (n) => (hi ? `${n} भाव` : `${ord(n)} house`),
    d: (d) => fmtD(d, tz), dt: (d) => fmtDT(d, tz),
  };
}
// Hindi rendering of computed yoga/dosha descriptions
const YOGA_HI = { 'Gajakesari Yoga': 'गजकेसरी योग', 'Budhaditya Yoga': 'बुधादित्य योग', 'Chandra-Mangal Yoga': 'चन्द्र-मंगल योग', 'Durudhura Yoga': 'दुरुधरा योग', 'Sunapha Yoga': 'सुनफा योग', 'Anapha Yoga': 'अनफा योग', 'Adhi Yoga': 'अधि योग', 'Viparita Raja Yoga': 'विपरीत राज योग', 'Raja Yoga': 'राज योग', 'Dhana Yoga': 'धन योग', Ruchaka: 'रुचक', Bhadra: 'भद्र', Hamsa: 'हंस', Malavya: 'मालव्य', Shasha: 'शश', 'Yoga (Pancha Mahapurusha)': 'योग (पंच महापुरुष)', Exalted: 'उच्च', Own: 'स्वराशि', Moolatrikona: 'मूलत्रिकोण' };
function hiText(x, s) {
  if (!x.hi || !s) return s;
  const P = '(Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn|Rahu|Ketu)';
  const pl = (str) => str.replace(new RegExp(P, 'g'), (m) => D.PL_HI[m]);
  const rules = [
    [new RegExp(`^${P} and ${P} together in (\\w+)$`), (m, a, b, sg) => `${D.PL_HI[a]} और ${D.PL_HI[b]} ${D.SIGNS_HI[D.SIGNS.indexOf(sg)]} राशि में एक साथ`],
    [/^Jupiter in a kendra from the Moon$/, () => 'गुरु चन्द्रमा से केन्द्र में'],
    [new RegExp(`^${P} (\\w+) in house (\\d+)$`), (m, a, dg, h) => `${D.PL_HI[a]} ${YOGA_HI[dg] || dg} होकर ${h} भाव में`],
    [/^(.+) 2nd and (.+) 12th from Moon$/, (m, a, b) => `${pl(a)} चन्द्रमा से द्वितीय और ${pl(b)} द्वादश भाव में`],
    [/^(.+) 2nd from Moon$/, (m, a) => `${pl(a)} चन्द्रमा से द्वितीय भाव में`],
    [/^(.+) 12th from Moon$/, (m, a) => `${pl(a)} चन्द्रमा से द्वादश भाव में`],
    [/^(.+) in 6\/7\/8 from Moon$/, (m, a) => `${pl(a)} चन्द्रमा से 6/7/8 भाव में`],
    [/^(\d+)(?:st|nd|rd|th) lord (\w+) in house (\d+)$/, (m, n, a, h) => `${n} भाव का स्वामी ${D.PL_HI[a]} ${h} भाव में`],
    [/^(.+) \(kendra and trikona lords\) conjoined$/, (m, a) => `केन्द्र और त्रिकोण के स्वामी ${pl(a)} की युति`],
    [new RegExp(`^${P} with ${P}$`), (m, a, b) => `${D.PL_HI[a]} के साथ ${D.PL_HI[b]}`],
    [new RegExp(`^${P} in 9th house$`), (m, a) => `${D.PL_HI[a]} नवम भाव में`],
    [/^9th lord (\w+) with a node$/, (m, a) => `नवमेश ${D.PL_HI[a]} राहु/केतु के साथ`],
  ];
  for (const [re, fn] of rules) if (re.test(s)) return s.replace(re, fn);
  let out = s;
  for (const [k, v] of Object.entries(YOGA_HI).sort((a, b) => b[0].length - a[0].length)) out = out.split(k).join(v);
  return pl(out);
}
const nature = (c, p) => E.functionalNature(c.ascSign, p);
const ownedStr = (x, c, p) => { const h = E.housesOwned(c.ascSign, p); return h.length ? h.map((n) => (x.hi ? `${n}` : ord(n))).join(' + ') + (x.hi ? ' भाव स्वामी' : ' lord') : '--'; };
const stCls = (s) => (/Benefic|Yogakaraka|Exalted|Own|Moolatrikona/.test(s) ? 'ok' : /Malefic|Debilitated|Enemy/.test(s) ? 'bad' : 'mid');

// ---------- English data summary for the AI (compact = fewer tokens) ----------
function summary(c, inp, label = '') {
  const f = (p) => `${p.name} ${D.SIGNS[p.sign]} ${p.deg.toFixed(1)}° H${p.house} ${D.NAKS[p.nak]}-${p.pada}${p.retro && !['Rahu', 'Ketu'].includes(p.name) ? ' R' : ''}${p.combust ? ' combust' : ''} ${p.dignity}`;
  const { md, ad } = c.current;
  const nextAd = md.antar.filter((a) => a.end > new Date()).slice(1, 4).map((a) => `${a.lord}(${fmtD(a.start)}-${fmtD(a.end)})`).join(', ');
  return `${label}Name ${inp.name}; ${inp.gender || ''}; born ${inp.dob} ${inp.tob} ${inp.place}; age ${ageAt(inp.dob)}.
Lagna ${D.SIGNS[c.ascSign]} ${c.ascDeg.toFixed(1)}° ${D.NAKS[c.ascNak]}; Moon sign ${D.SIGNS[c.moonSign]}; Janma nakshatra ${D.NAKS[c.avakahada.nak]}-${c.avakahada.pada}; Navamsa lagna ${D.SIGNS[c.ascNav]}.
Planets: ${c.planets.map(f).join('; ')}.
House lords: ${[...Array(12).keys()].map((i) => `${i + 1}:${E.lordOf(c.ascSign, i + 1)}`).join(' ')}.
Mahadasha ${md.lord} ${fmtD(md.start)}-${fmtD(md.end)}; Antardasha ${ad.lord} to ${fmtD(ad.end)}; next: ${nextAd}.\n`;
}

// ---------- shared pages ----------
function basicPage(x, c, inp, title) {
  const { t } = x, pc = c.panchang, av = c.avakahada;
  const tithi = pc.purnima ? t('Purnima') : pc.amavasya ? t('Amavasya') : x.pick([D.TITHIS[pc.tithi], D.TITHIS_HI[pc.tithi]]);
  const left = T.h3(t('Basic Details')) + T.kv([
    [t('Name'), inp.name], [t('Gender'), t(inp.gender || '-')], [t('Date of birth'), inp.dob.split('-').reverse().join('/')], [t('Time of birth'), inp.tob],
    [t('Place of birth'), inp.place], [t('Latitude'), geo(c.input.lat, 'N', 'S')], [t('Longitude'), geo(c.input.lon, 'E', 'W')], [t('Timezone'), tzS(c.input.tz)],
    [t('Ayanamsha'), dms(c.ayanamsa)], [t('Sunrise'), pc.sunrise], [t('Sunset'), pc.sunset], [t('Day'), x.pick([D.DAYS[pc.weekday], D.DAYS_HI[pc.weekday]])],
  ]);
  const right = T.h3(t('Panchang Details')) + T.kv([
    [t('Tithi'), `${x.hi ? (pc.shukla ? 'शुक्ल' : 'कृष्ण') : pc.shukla ? 'Shukla' : 'Krishna'} ${tithi}`],
    [t('Yog'), x.pick([D.YOGAS[pc.yoga], D.YOGAS_HI[pc.yoga]])], [t('Nakshatra'), x.nak(av.nak)], [t('Karan'), x.pick([D.KARANAS[pc.karana], D.KARANAS_HI[pc.karana]])],
    [t('Paksha'), pc.shukla ? t('Shukla (waxing)') : t('Krishna (waning)')],
  ]) + T.h3(t('Avakahada Chakra')) + T.kv([
    [t('Varna'), x.pick([D.VARNA[av.varna], D.VARNA_HI[av.varna]])], [t('Vashya'), x.pick([D.VASHYA[av.vashya], D.VASHYA_HI[av.vashya]])],
    [t('Yoni'), x.pick([D.YONI[av.yoni], D.YONI_HI[av.yoni]])], [t('Gan'), x.pick([D.GANA[av.gana], D.GANA_HI[av.gana]])], [t('Nadi'), x.pick([D.NADI[av.nadi], D.NADI_HI[av.nadi]])],
    [t('Sign'), x.sign(c.moonSign)], [t('Sign Lord'), x.pl(D.SIGN_LORD[c.moonSign])], [t('Nakshatra Lord'), x.pl(D.DASHA_ORDER[av.nak % 9])], [t('Charan'), av.pada],
    [t('Tatva'), x.pick([D.TATVA[av.tatva], D.TATVA_HI[av.tatva]])], [t('Name Alphabet'), x.pick([D.SYLLABLES[av.syllable], D.SYLLABLES_HI[av.syllable]])],
    [t('Ascendant'), x.sign(c.ascSign)], [t('Ascendant Lord'), x.pl(D.SIGN_LORD[c.ascSign])],
  ]);
  return T.page(title || t('Basic Astrological Details'), t('Birth particulars, Panchang and Avakahada Chakra'), T.grid2(left, right) +
    T.h3(t('How to Read This Report')) + `<p>${T.esc(t('READ_NOTE'))}</p>`);
}

function planetsPage(x, c) {
  const { t } = x;
  const rows = c.planets.map((p) => [x.pl(p.name), p.retro ? t('Yes') : '--', x.sign(p.sign), dms(p.deg), x.pl(D.SIGN_LORD[p.sign]), x.nak(p.nak), p.pada, x.pl(p.nakLord), ownedStr(x, c, p.name), p.house]);
  rows.push([t('Ascendant'), '--', x.sign(c.ascSign), dms(c.ascDeg), x.pl(D.SIGN_LORD[c.ascSign]), x.nak(c.ascNak), c.ascPada, x.pl(D.DASHA_ORDER[c.ascNak % 9]), '--', 1]);
  const cards = c.planets.map((p) => {
    const n = nature(c, p.name), st = n === 'Shadow' ? t(p.dignity) : t(n);
    return T.box(x.pl(p.name), `${x.sign(p.sign)} · ${x.nak(p.nak)}${p.combust ? ' · ' + t('Combust') : ''}`, `<div class="st ${stCls(n === 'Shadow' ? p.dignity : n)}">${T.esc(st)} · ${T.esc(t(p.dignity))}</div>`);
  });
  return T.page(t('Planetary Positions'), t('Sidereal longitudes, nakshatras and house placement'),
    T.table([t('Planets'), 'R', t('Sign'), t('Degrees'), t('Sign Lord'), t('Nakshatra'), t('Pada'), t('Nak Lord'), t('Lordship'), t('House')], rows) +
    `<h3 class="center">${T.esc(t('Functional Status for') + ' ' + x.sign(c.ascSign) + ' ' + t('Ascendant'))}</h3>` + T.grid3(cards));
}

const items = (x, c, key = 'house') => c.planets.map((p) => ({ house: p[key], label: x.ab(p.name) + (p.retro && !['Rahu', 'Ketu'].includes(p.name) ? 'ᴿ' : '') }));
const relItems = (x, c, ref, key = 'sign') => c.planets.map((p) => ({ house: ((p[key] - ref + 12) % 12) + 1, label: x.ab(p.name) }));

function chartsPage(x, c, note) {
  const { t } = x;
  const d1 = T.northChart(c.ascSign, items(x, c), t('LAGNA CHART (D1)'), `${t('Ascendant')}: ${x.sign(c.ascSign)}`);
  const ch = T.northChart(c.moonSign, relItems(x, c, c.moonSign), t('CHANDRA CHART'), `${t('Moon sign')}: ${x.sign(c.moonSign)}`);
  const d9 = T.northChart(c.ascNav, relItems(x, c, c.ascNav, 'nav'), t('NAVAMSA CHART (D9)'), `${t('Ascendant')}: ${x.sign(c.ascNav)}`);
  const lords = [...Array(12).keys()].map((i) => { const s = (c.ascSign + i) % 12; return [`${i + 1} ${x.sign(s)}`, x.pl(D.SIGN_LORD[s]), t(`H${i + 1}`)]; });
  return T.page(t('Horoscope Charts'), t('Rashi (D1), Chandra and Navamsa (D9)'), T.grid2(d1, ch) + `<p>${T.esc(t('CHART_NOTE'))}</p>` +
    T.grid2(d9, note ? T.callout(t('Reading the D9'), note) : T.table([t('House'), t('Lord'), t('Signification')], lords.slice(0, 12), 'small')) +
    (note ? T.h3(t('House Significations from') + ' ' + x.sign(c.ascSign) + ' ' + t('Ascendant')) + T.grid2(T.table([t('House'), t('Lord'), t('Signification')], lords.slice(0, 6)), T.table([t('House'), t('Lord'), t('Signification')], lords.slice(6))) : ''));
}

function dashaPage(x, c, text, inp) {
  const { t } = x, by = Date.parse(inp.dob);
  const mds = c.dashas.filter((m) => m.end > c.date).slice(0, 7).map((m) => {
    const a1 = Math.max(0, Math.floor((+m.start - by) / E.YEAR)), a2 = Math.floor((+m.end - by) / E.YEAR);
    const cur = m === c.current.md;
    return [{ html: cur ? `<b>${T.esc(x.pl(m.lord))}</b>` : T.esc(x.pl(m.lord)) }, x.d(m.start < c.date ? c.date : m.start), x.d(m.end), `${D.DASHA_YEARS[m.lord]} ${t('y')}`, `${a1} - ${a2}`, cur ? t('CURRENT') : ''];
  });
  const ads = c.current.md.antar.map((a) => [{ html: a === c.current.ad ? `<b>${T.esc(x.pl(a.lord))}</b>` : T.esc(x.pl(a.lord)) }, x.d(a.start), x.d(a.end), a === c.current.ad ? t('CURRENT') : '']);
  return T.page(t('Vimshottari Dasha'), t('Mahadasha sequence and the current periods'),
    T.h3(t('Mahadasha Timeline')) + T.table([t('Mahadasha'), t('From'), t('To'), t('Duration'), t('Age'), ''], mds) +
    T.h3(`${t('Antardasha within')} ${x.pl(c.current.md.lord)} ${t('Mahadasha')}`) + T.table([t('Antardasha'), t('From'), t('To'), ''], ads) +
    (text ? T.callout(`${t('Reading the Current')} ${x.pl(c.current.md.lord)} ${t('Mahadasha')}`, text) : ''));
}

function luckyRows(x, c) {
  const { t } = x, l1 = D.SIGN_LORD[c.ascSign], l5 = E.lordOf(c.ascSign, 5), l9 = E.lordOf(c.ascSign, 9);
  const days = [...new Set([l1, l5, l9].map((p) => D.PLANET_DAY[p]))].map((i) => x.pick([D.DAYS[i], D.DAYS_HI[i]])).join(', ');
  const nums = [...new Set([l1, l5, l9].map((p) => D.PLANET_NUM[p]))].join(', ');
  return [
    [t('Lucky Colours'), x.pick(D.COLORS[l1])], [t('Supporting Colours'), x.pick(D.COLORS[l9])], [t('Lucky Numbers'), nums], [t('Lucky Days'), days],
    [t('Lucky Direction'), x.pick(D.DIRECTION[l1])], [t('Primary Gemstone'), x.pick(D.GEMS[l1])], [t('Primary Mantra'), x.pick(D.MANTRA[l1])],
  ];
}
const textPage = (title, sub, parts) => T.page(title, sub, parts.join(''));
const sec = (h, text) => (text ? T.h3(h) + T.para(text) : '');
const cards = (x, names, texts) => names.map((n, i) => (texts[i] ? `<h4>${T.esc(n)}</h4><p>${T.esc(texts[i])}</p>` : '')).join('');

function personFromInput(inp) {
  return { name: inp.name, gender: inp.gender, dob: inp.dob, tob: inp.tob, place: inp.place, tz: Number(inp.tz ?? 5.5), lat: Number(inp.lat), lon: Number(inp.lon) };
}

// ============ SERVICES ============
const S = {};

S['vedic-kundli'] = {
  prep: (inp) => { const c = E.chart(inp); return { c, yd: E.yogasAndDoshas(c) }; },
  ai: ({ c, yd }, inp) => ({
    context: summary(c, inp) + `Yogas: ${yd.yogas.map((y) => y[0] + ' (' + y[1] + ')').join('; ') || 'none major'}. Doshas: ${Object.entries(yd.doshas).filter(([, v]) => v.present).map(([k]) => k).join(', ') || 'none'}.`,
    keys: [['ascendant', 'text', 'lagna, lagna lord and personality analysis, ~220 words'], ['traits_pos', 'list', '6 positive traits, 1-3 words each'], ['traits_neg', 'list', '4 watch-outs, 1-3 words each'],
      ['planets', 'list', 'exactly 9 items in order Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu; ~55 words each on that placement'],
      ['career', 'text', 'career & profession, ~200 words'], ['wealth', 'text', 'wealth & finance, ~160 words'], ['marriage', 'text', 'marriage & relationships, ~180 words'],
      ['health', 'text', 'health, ~120 words'], ['education', 'text', 'education & intellect, ~110 words'], ['yogas', 'text', 'effect of the listed yogas and doshas, ~170 words'],
      ['dasha', 'text', 'current mahadasha/antardasha and next periods, ~190 words'], ['remedies', 'list', '7 practical remedies'], ['quote', 'text', 'one powerful closing line, max 22 words']],
  }),
  render: ({ c, yd }, a, x, inp) => {
    const { t } = x, s = c.ascSign, ak = [...c.planets].filter((p) => !['Rahu', 'Ketu'].includes(p.name)).sort((p, q) => q.deg - p.deg);
    const l10 = E.lordOf(s, 10), l7 = E.lordOf(s, 7), l2 = E.lordOf(s, 2), l11 = E.lordOf(s, 11);
    const band = `<div class="band" style="text-align:left;margin:4px 0 10px;padding:16px 22px"><div class="bt" style="font-size:24px">${T.esc(x.sign(s))}</div><div class="bl">${T.esc(x.nak(c.ascNak))} ${t('Nakshatra')}, ${t('Pada')} ${c.ascPada} | ${t('Lord')}: ${T.esc(x.pl(D.SIGN_LORD[s]))}</div></div>`;
    return [
      basicPage(x, c, inp), planetsPage(x, c), chartsPage(x, c),
      textPage(t('Ascendant Report'), `${x.sign(s)} ${t('rising')}`, [band, T.kv([[t('Lord'), x.pl(D.SIGN_LORD[s])], [t('Symbol'), x.pick(SYM[s])], [t('Characteristics'), `${x.pick([D.TATVA[s % 4], D.TATVA_HI[s % 4]])}, ${x.pick(QUAL[s % 3])}, ${x.pick(DIRS[s % 4])}`], [t('Lucky gem'), x.pick(D.GEMS[D.SIGN_LORD[s]])], [t('Day of fast'), x.pick([D.DAYS[D.PLANET_DAY[D.SIGN_LORD[s]]], D.DAYS_HI[D.PLANET_DAY[D.SIGN_LORD[s]]]])]]),
        sec(`${t('What')} ${x.sign(s)} ${t('Rising Means Here')}`, a.ascendant), T.h3(t('Traits Carried Into Life')), `<div class="small">${t('POSITIVE TRAITS')}</div>`, T.tags(a.traits_pos, 'g'), `<div class="small">${t('WATCH-OUTS')}</div>`, T.tags(a.traits_neg, 'r')]),
      textPage(t('Planets in Your Chart'), t('What each planet does from its house'), [cards(x, c.planets.map((p) => `${x.pl(p.name)} — ${x.sign(p.sign)}, ${x.hs(p.house)}`), T.toArr(a.planets))]),
      textPage(t('Career & Finance'), t('The 10th house, its lord, and the karakas of profession'), [T.table([t('Signature'), t('Placement')], [[`${t('10th House')} — ${x.sign((s + 9) % 12)}`, `${t('Lord')} ${x.pl(l10)} — ${x.hs(c.P[l10].house)}`], [t('Atmakaraka'), `${x.pl(ak[0].name)} — ${x.sign(ak[0].sign)}`], [t('Amatyakaraka'), `${x.pl(ak[1].name)} — ${x.sign(ak[1].sign)}`], [`${t('2nd Lord')} / ${t('11th Lord')}`, `${x.pl(l2)} (${x.hs(c.P[l2].house)}) / ${x.pl(l11)} (${x.hs(c.P[l11].house)})`]]), sec(t('Profession Indicated'), a.career), sec(t('Wealth & Finance'), a.wealth)]),
      textPage(t('Marriage, Health & Education'), t('Relationships, wellbeing and learning'), [T.kv([[`${t('7th House')}`, `${x.sign((s + 6) % 12)} — ${t('Lord')} ${x.pl(l7)} ${x.hs(c.P[l7].house)}`], [t('Venus'), `${x.sign(c.P.Venus.sign)}, ${x.hs(c.P.Venus.house)}`], [t('Manglik'), yd.doshas.manglik.present ? t('Present') : t('Not Present')]]), sec(t('Marriage & Relationships'), a.marriage), sec(t('Health'), a.health), sec(t('Education'), a.education)]),
      textPage(t('Yogas & Doshas'), t('Combinations that shape life'), [T.h3(t('Yogas Present')), T.table([t('Yoga'), t('Formation')], yd.yogas.length ? yd.yogas.map((y) => [hiText(x, y[0]), hiText(x, y[1])]) : [[t('None major'), '--']]), T.h3(t('Doshas — Present and Absent')), doshaTable(x, yd.doshas), T.callout(t('What This Means'), a.yogas)]),
      dashaPage(x, c, a.dasha, inp),
      textPage(t('Remedies & Lucky Factors'), t('Supporting elements for your life'), [T.h3(t('Auspicious Elements')), T.kv(luckyRows(x, c)), T.h3(t('Remedial Priority')), T.list(a.remedies), T.quote(a.quote)]),
    ];
  },
};

function doshaTable(x, ds) {
  const { t } = x, st = (v) => ({ html: v ? `<span class="bad">${T.esc(t('PRESENT'))}</span>` : `<span class="ok">${T.esc(t('NOT PRESENT'))}</span>` });
  return T.table([t('Dosha'), t('Status'), t('Detail')], [
    [t('Manglik / Kuja'), st(ds.manglik.present), `${t('Mars')}: ${x.hs(ds.manglik.houseLagna)} ${t('from Lagna')}, ${x.hs(ds.manglik.houseMoon)} ${t('from Moon')}${ds.manglik.mitigated ? ' — ' + t('mitigated by dignity') : ''}`],
    [t('Kaal Sarp Dosha'), st(ds.kaalSarp.present), ds.kaalSarp.present ? `${x.pick([D.KAAL_SARP[ds.kaalSarp.type], D.KAAL_SARP_HI[ds.kaalSarp.type]])} — ${t('Rahu')} ${x.hs(ds.kaalSarp.rahuHouse)}` : t('Planets on both sides of the Rahu-Ketu axis')],
    [t('Pitru Dosha'), st(ds.pitru.present), ds.pitru.reasons.map((r) => hiText(x, r)).join(', ') || '--'],
    [t('Grahan Dosha'), st(ds.grahan.present), t('Sun/Moon with Rahu or Ketu')],
    [t('Guru Chandal Dosha'), st(ds.guruChandal.present), t('Jupiter with Rahu or Ketu')],
    [t('Shrapit Dosha'), st(ds.shrapit.present), t('Saturn with Rahu')],
    [t('Kemadruma Yoga'), st(ds.kemadruma.present), t('No planets around the Moon')],
  ]);
}

S['lal-kitab-kundli'] = {
  prep: (inp) => {
    const c = E.chart(inp), H = (p) => c.P[p].house;
    const rins = [
      ['Pitri Rin', ['Venus', 'Mercury', 'Rahu'].some((p) => [2, 5, 9, 12].includes(H(p)))], ['Matri Rin', H('Ketu') === 4],
      ['Stri Rin', ['Sun', 'Rahu', 'Ketu'].some((p) => [2, 7].includes(H(p)))], ['Bhai-Bandhu Rin', ['Mercury', 'Ketu'].some((p) => [1, 8].includes(H(p)))],
      ['Behen-Beti Rin', [3, 6].includes(H('Moon'))], ['Nirdayi Rin', ['Sun', 'Moon', 'Mars'].some((p) => [10, 11].includes(H(p)))],
      ['Ajanma Rin', ['Sun', 'Venus', 'Mars'].some((p) => H(p) === 12)], ['Swayam Rin', ['Venus', 'Saturn', 'Rahu', 'Ketu'].some((p) => H(p) === 5)],
    ];
    const ex = { Rahu: [[3, 6], [8, 9]], Ketu: [[9, 12], [3, 6]] };
    const lk = c.planets.map((p) => {
      const [u, n] = ex[p.name] || [[D.EXALT[p.name] + 1], [((D.EXALT[p.name] + 6) % 12) + 1]];
      return { name: p.name, house: p.house, pakka: D.LK_PAKKA[p.name].includes(p.house), status: u.includes(p.house) ? 'Exalted' : n.includes(p.house) ? 'Debilitated' : 'Normal' };
    });
    return { c, rins, lk };
  },
  ai: ({ c, rins, lk }, inp) => ({
    context: summary(c, inp) + `Lal Kitab houses (Aries=1st): ${lk.map((p) => `${p.name} H${p.house}${p.pakka ? ' pakka ghar' : ''} ${p.status}`).join('; ')}. Rins present: ${rins.filter((r) => r[1]).map((r) => r[0]).join(', ') || 'none'}.`,
    keys: [['overview', 'text', 'Lal Kitab overview of this kundli, ~200 words'], ['planets', 'list', 'exactly 9 items in order Sun..Ketu; Lal Kitab phal of the planet in its house, ~70 words each'],
      ['rins', 'text', 'meaning of the rins (ancestral debts) present/absent and how to clear them, ~150 words'], ['career', 'text', 'career and money per Lal Kitab, ~150 words'], ['family', 'text', 'family, marriage and children, ~150 words'], ['health', 'text', 'health, ~110 words'],
      ['upay', 'list', '10 specific Lal Kitab upay (totke), each naming the planet it fixes'], ['dos', 'list', '6 things to do'], ['donts', 'list', '6 things to avoid'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: ({ c, rins, lk }, a, x, inp) => {
    const { t } = x;
    const chart = T.northChart(0, c.planets.map((p) => ({ house: p.house, label: x.ab(p.name) })), t('LAL KITAB CHART'), t('Aries fixed in the 1st house'));
    const tb = T.table([t('Planet'), t('House'), t('Pakka Ghar'), t('Status')], lk.map((p) => [x.pl(p.name), p.house, p.pakka ? t('Yes') : '--', { html: `<span class="${stCls(p.status)}">${T.esc(t(p.status))}</span>` }]));
    return [
      basicPage(x, c, inp), planetsPage(x, c), chartsPage(x, c),
      textPage(t('Lal Kitab Kundli'), t('Planets in fixed houses'), [T.grid2(chart, tb), sec(t('Overview'), a.overview)]),
      textPage(t('Planets as per Lal Kitab'), t('Result of each planet in its house'), [cards(x, c.planets.map((p) => `${x.pl(p.name)} — ${x.hs(p.house)}`), T.toArr(a.planets))]),
      textPage(t('Rin (Ancestral Debts)'), t('Karmic debts indicated by the chart'), [T.table([t('Rin'), t('Status')], rins.map((r) => [t(r[0]), { html: r[1] ? `<span class="bad">${T.esc(t('PRESENT'))}</span>` : `<span class="ok">${T.esc(t('NOT PRESENT'))}</span>` }])), T.callout(t('What This Means'), a.rins)]),
      textPage(t('Life Areas'), t('Career, family and health'), [sec(t('Career & Money'), a.career), sec(t('Family, Marriage & Children'), a.family), sec(t('Health'), a.health)]),
      textPage(t('Lal Kitab Upay'), t('Simple remedies for afflicted planets'), [T.list(a.upay), T.callout(t('How to perform upay'), t('UPAY_NOTE'))]),
      textPage(t("Do's & Don'ts"), t('Daily conduct that keeps planets favourable'), [T.h3(t("Do's")), T.list(a.dos), T.h3(t("Don'ts")), T.list(a.donts), T.quote(a.quote)]),
    ];
  },
};

S.varshphal = {
  prep: (inp) => {
    const c = E.chart(inp), now = new Date(), by = +inp.dob.slice(0, 4);
    let year = Number(inp.year) || now.getFullYear();
    if (!inp.year && E.solarReturn(c.P.Sun.lon, inp.dob, year) > now) year -= 1;
    const sr = E.solarReturn(c.P.Sun.lon, inp.dob, year), end = new Date(+sr + E.YEAR);
    const v = E.chartAtDate(sr, c.input.lat, c.input.lon, c.input.tz);
    const muntha = (c.ascSign + (year - by)) % 12;
    const ads = c.dashas.flatMap((m) => m.antar.map((a) => ({ md: m.lord, ...a }))).filter((a) => a.end > sr && a.start < end);
    const months = [...Array(12).keys()].map((i) => { const d = new Date(+sr + (i * E.YEAR) / 12); return { start: d, end: new Date(+sr + ((i + 1) * E.YEAR) / 12 - E.DAY), sun: Math.floor(E.lonOf('Sun', new Date(+d + 15 * E.DAY)) / 30) }; });
    const tq = [0, 3, 6, 9].map((m) => { const d = new Date(+sr + (m * E.YEAR) / 12); return { d, tr: E.transits(d) }; });
    return { c, v, year, sr, end, muntha, munthaHouse: ((muntha - v.ascSign + 12) % 12) + 1, ads, months, tq, age: year - by };
  },
  ai: (d, inp) => ({
    context: summary(d.c, inp) + `VARSHPHAL ${d.year}-${d.year + 1} (age ${d.age} completed). Varsh pravesh ${fmtDT(d.sr, d.c.input.tz)}. Year lagna ${D.SIGNS[d.v.ascSign]}. Muntha ${D.SIGNS[d.muntha]} in varsh house ${d.munthaHouse}, lord ${D.SIGN_LORD[d.muntha]}. Varsh planets: ${d.v.planets.map((p) => `${p.name} ${D.SIGNS[p.sign]} H${p.house}`).join('; ')}. Dasha periods in year: ${d.ads.map((a) => `${a.md}/${a.lord} ${fmtD(a.start)}-${fmtD(a.end)}`).join('; ')}. Months: ${d.months.map((m, i) => `M${i + 1} ${fmtD(m.start)} Sun in ${D.SIGNS[m.sun]}`).join('; ')}. Transits at start: ${d.tq[0].tr.map((p) => `${p.name} ${D.SIGNS[p.sign]}`).join(', ')}.`,
    keys: [['overview', 'text', 'overall year forecast, ~200 words'], ['months', 'list', 'exactly 12 items, month-by-month forecast in the given order, ~50 words each'],
      ['career', 'text', 'career this year, ~140 words'], ['finance', 'text', 'finance this year, ~130 words'], ['relationships', 'text', 'family & relationships, ~120 words'], ['health', 'text', 'health, ~100 words'],
      ['lalkitab', 'list', '7 Lal Kitab upay for this year (based on age and planets)'], ['vedic', 'list', '5 Vedic remedies for this year'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: (d, a, x, inp) => {
    const { t } = x, { c, v } = d;
    const vchart = T.northChart(v.ascSign, items(x, v), t('VARSH CHART'), `${t('Year Lagna')}: ${x.sign(v.ascSign)}`);
    const nchart = T.northChart(c.ascSign, items(x, c), t('BIRTH CHART (D1)'), `${t('Ascendant')}: ${x.sign(c.ascSign)}`);
    return [
      basicPage(x, c, inp), planetsPage(x, c), chartsPage(x, c),
      textPage(t('Varsh Pravesh'), `${t('Solar return')} ${d.year} - ${d.year + 1}`, [T.kv([[t('Varsh Pravesh (date & time)'), x.dt(d.sr)], [t('Year'), `${d.year} - ${d.year + 1}`], [t('Age completed'), d.age], [t('Year Lagna'), x.sign(v.ascSign)], [t('Muntha'), `${x.sign(d.muntha)} — ${x.hs(d.munthaHouse)}`], [t('Muntha Lord'), x.pl(D.SIGN_LORD[d.muntha])], [t('Moon in Varsh chart'), x.sign(v.P.Moon.sign)]]), T.grid2(vchart, nchart)]),
      textPage(t('Varsh Planetary Positions'), t('Planets at the moment of solar return'), [T.table([t('Planets'), 'R', t('Sign'), t('Degrees'), t('Nakshatra'), t('House')], v.planets.map((p) => [x.pl(p.name), p.retro ? t('Yes') : '--', x.sign(p.sign), dms(p.deg), x.nak(p.nak), p.house])), T.h3(t('Dasha Periods This Year')), T.table([t('Mahadasha'), t('Antardasha'), t('From'), t('To')], d.ads.map((p) => [x.pl(p.md), x.pl(p.lord), x.d(p.start), x.d(p.end)]))]),
      textPage(t('Year Overview'), t('The broad picture of the year'), [T.h3(t('Key Transits')), T.table([t('From'), t('Jupiter'), t('Saturn'), t('Rahu'), t('Ketu')], d.tq.map((q) => [x.d(q.d), ...q.tr.map((p) => x.sign(p.sign))])), sec(t('Overview'), a.overview)]),
      textPage(t('Month-by-Month Forecast'), `${d.year} - ${d.year + 1}`, [cards(x, d.months.map((m, i) => `${t('Month')} ${i + 1}: ${x.d(m.start)} — ${x.d(m.end)}`), T.toArr(a.months))]),
      textPage(t('Life Areas This Year'), t('Career, money, relationships and health'), [sec(t('Career'), a.career), sec(t('Finance'), a.finance), sec(t('Family & Relationships'), a.relationships), sec(t('Health'), a.health)]),
      textPage(t('Remedies for the Year'), t('Lal Kitab and Vedic upay'), [T.h3(t('Lal Kitab Upay')), T.list(a.lalkitab), T.h3(t('Vedic Remedies')), T.list(a.vedic), T.quote(a.quote)]),
    ];
  },
};

// ---------- numerology ----------
const CHAL = { A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1, J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2, S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7 };
const PYT = (ch) => ((ch.charCodeAt(0) - 65) % 9) + 1;
const NUM_FRIENDS = { 1: [[1, 2, 3, 5, 9], [6, 8]], 2: [[1, 2, 3, 5], [4, 8, 9]], 3: [[1, 2, 3, 5, 9], [6]], 4: [[1, 5, 6, 7, 8], [2, 9]], 5: [[1, 2, 3, 5, 6], []], 6: [[1, 5, 6, 7], [3]], 7: [[1, 3, 4, 5, 6], []], 8: [[3, 5, 6, 7], [1, 2]], 9: [[1, 2, 3, 5], [4, 8]] };
function numerology(inp) {
  const [y, m, dd] = inp.dob.split('-').map(Number), letters = inp.name.toUpperCase().replace(/[^A-Z]/g, '').split('');
  const mulank = reduce(dd), bhagyank = reduce(String(dd) + String(m) + String(y));
  const chal = letters.reduce((s, ch) => s + CHAL[ch], 0), pyt = letters.reduce((s, ch) => s + PYT(ch), 0);
  const vow = letters.filter((ch) => 'AEIOU'.includes(ch)), con = letters.filter((ch) => !'AEIOU'.includes(ch));
  const soul = reduce(vow.reduce((s, ch) => s + PYT(ch), 0)), pers = reduce(con.reduce((s, ch) => s + PYT(ch), 0));
  const digits = inp.dob.replace(/-/g, '').split('').map(Number).filter(Boolean);
  digits.push(bhagyank); if (dd > 9) digits.push(mulank);
  const count = Array(10).fill(0); digits.forEach((n) => count[n]++);
  const now = new Date(), py = reduce(dd + m + reduce(now.getFullYear())), pm = reduce(py + now.getMonth() + 1);
  const words = inp.name.trim().split(/\s+/).map((w) => ({ w, v: w.toUpperCase().replace(/[^A-Z]/g, '').split('').reduce((s, ch) => s + CHAL[ch], 0) }));
  return { mulank, bhagyank, chal, chalR: reduce(chal), pyt, pytR: reduce(pyt), soul, pers, count, missing: [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !count[n]), py, pm, letters, words, year: now.getFullYear(), dd, m, y };
}
S['numerology-report'] = {
  prep: (inp) => ({ n: numerology(inp) }),
  ai: ({ n }, inp) => ({
    context: `Name ${inp.name}; gender ${inp.gender || ''}; DOB ${inp.dob}. Mulank (psychic) ${n.mulank} (${D.NUM_PLANET[n.mulank]}); Bhagyank (destiny) ${n.bhagyank} (${D.NUM_PLANET[n.bhagyank]}); Chaldean name ${n.chal}/${n.chalR}; word totals ${n.words.map((w) => w.w + '=' + w.v).join(', ')}; Pythagorean ${n.pyt}/${n.pytR}; soul urge ${n.soul}; personality ${n.pers}; Lo Shu counts ${n.count.slice(1).map((v, i) => `${i + 1}:${v}`).join(' ')}; missing ${n.missing.join(',') || 'none'}; personal year ${n.year}: ${n.py}; personal month ${n.pm}. Friendly numbers of mulank ${NUM_FRIENDS[n.mulank][0].join(',')}; unfriendly ${NUM_FRIENDS[n.mulank][1].join(',') || 'none'}.`,
    keys: [['mulank', 'text', 'mulank meaning for this person, ~170 words'], ['bhagyank', 'text', 'bhagyank / life path, ~170 words'], ['name', 'text', 'name number analysis and its harmony with mulank & bhagyank, ~170 words'],
      ['soul', 'text', 'soul urge, ~90 words'], ['personality', 'text', 'personality number, ~90 words'], ['loshu', 'text', 'Lo Shu grid: strong, repeated and missing numbers, ~160 words'],
      ['personalYear', 'text', 'personal year and month forecast, ~150 words'], ['career', 'text', 'career by numbers, ~140 words'], ['relationships', 'text', 'relationships & compatible numbers, ~120 words'], ['health', 'text', 'health tendencies, ~90 words'],
      ['nameAdvice', 'text', 'whether the name spelling supports the person and what total to aim for (do not invent new spellings), ~110 words'], ['remedies', 'list', '7 numerology remedies'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: ({ n }, a, x, inp) => {
    const { t } = x, pn = (k) => x.pl(D.NUM_PLANET[k]);
    const info = (k) => T.kv([[t('Ruling Planet'), pn(k)], [t('Lucky Day'), x.pick([D.DAYS[D.PLANET_DAY[D.NUM_PLANET[k]]], D.DAYS_HI[D.PLANET_DAY[D.NUM_PLANET[k]]]])], [t('Lucky Colours'), x.pick(D.COLORS[D.NUM_PLANET[k]])], [t('Gemstone'), x.pick(D.GEMS[D.NUM_PLANET[k]])], [t('Friendly Numbers'), NUM_FRIENDS[k][0].join(', ')], [t('Unfriendly Numbers'), NUM_FRIENDS[k][1].join(', ') || '--']]);
    const grid = D.LOSHU.map((r) => r.map((k) => (n.count[k] ? String(k).repeat(n.count[k]) : '')));
    const bigNum = (v, l) => `<div class="score">${v}</div><div class="scs">${T.esc(l)}</div>`;
    return [
      textPage(t('Core Numbers'), t('Your numerology profile at a glance'), [T.kv([[t('Name'), inp.name], [t('Date of birth'), inp.dob.split('-').reverse().join('/')], [t('Mulank (Psychic)'), `${n.mulank} — ${pn(n.mulank)}`], [t('Bhagyank (Life Path)'), `${n.bhagyank} — ${pn(n.bhagyank)}`], [t('Name Number (Chaldean)'), `${n.chal} / ${n.chalR}`], [t('Name Number (Pythagorean)'), `${n.pyt} / ${n.pytR}`], [t('Soul Urge'), n.soul], [t('Personality'), n.pers], [`${t('Personal Year')} ${n.year}`, n.py]]), T.h3(t('Number Frequency in Your Birth Date')), T.bars([1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => ({ label: k, sub: x.ab(D.NUM_PLANET[k]), value: n.count[k], color: n.count[k] ? '#2e8b57' : '#d04a2f' })), Math.max(3, ...n.count))]),
      textPage(t('Mulank — Psychic Number'), t('How you see yourself'), [T.grid2(bigNum(n.mulank, `${t('Mulank')} · ${pn(n.mulank)}`), info(n.mulank)), T.para(a.mulank)]),
      textPage(t('Bhagyank — Life Path'), t('The direction of your destiny'), [T.grid2(bigNum(n.bhagyank, `${t('Bhagyank')} · ${pn(n.bhagyank)}`), info(n.bhagyank)), T.para(a.bhagyank)]),
      textPage(t('Name Numerology'), t('Chaldean letter values of your name'), [T.table([t('Letter'), ...n.letters.slice(0, 14)], [[t('Value'), ...n.letters.slice(0, 14).map((ch) => CHAL[ch])]]), n.letters.length > 14 ? T.table([t('Letter'), ...n.letters.slice(14, 28)], [[t('Value'), ...n.letters.slice(14, 28).map((ch) => CHAL[ch])]]) : '', T.table([t('Name'), t('Total'), t('Reduced')], [...n.words.map((w) => [w.w, w.v, reduce(w.v)]), [inp.name, n.chal, n.chalR]]), T.para(a.name), T.callout(t('Name Advice'), a.nameAdvice)]),
      textPage(t('Soul Urge & Personality'), t('Your inner desire and outer expression'), [T.grid2(bigNum(n.soul, t('Soul Urge')), bigNum(n.pers, t('Personality'))), sec(t('Soul Urge'), a.soul), sec(t('Personality'), a.personality)]),
      textPage(t('Lo Shu Grid'), t('The magic square of your birth date'), [T.square(grid, t('Your Lo Shu Grid'), `${t('Missing numbers')}: ${n.missing.join(', ') || '--'}`), T.para(a.loshu)]),
      textPage(t('Personal Year Forecast'), `${n.year}`, [T.table([t('Year'), t('Personal Year')], [0, 1, 2, 3].map((k) => [n.year + k, reduce(n.dd + n.m + reduce(n.year + k))])), T.para(a.personalYear)]),
      textPage(t('Career, Relationships & Health'), t('Numbers in daily life'), [sec(t('Career'), a.career), sec(t('Relationships'), a.relationships), sec(t('Health'), a.health)]),
      textPage(t('Lucky Factors & Remedies'), t('Supporting elements'), [T.kv([[t('Lucky Numbers'), [...new Set([n.mulank, n.bhagyank, ...NUM_FRIENDS[n.mulank][0]])].join(', ')], [t('Avoid Numbers'), NUM_FRIENDS[n.mulank][1].join(', ') || '--'], [t('Lucky Days'), [...new Set([n.mulank, n.bhagyank].map((k) => D.PLANET_DAY[D.NUM_PLANET[k]]))].map((i) => x.pick([D.DAYS[i], D.DAYS_HI[i]])).join(', ')], [t('Lucky Colours'), x.pick(D.COLORS[D.NUM_PLANET[n.mulank]])], [t('Primary Gemstone'), x.pick(D.GEMS[D.NUM_PLANET[n.mulank]])], [t('Primary Mantra'), x.pick(D.MANTRA[D.NUM_PLANET[n.mulank]])]]), T.h3(t('Remedies')), T.list(a.remedies), T.quote(a.quote)]),
    ];
  },
};

// ---------- kundli milan ----------
const VASHYA_M = [[2, 1, 1, 0.5, 1], [1, 2, 0.5, 0, 1], [1, 0.5, 2, 1, 1], [0, 0, 1, 2, 0], [1, 1, 1, 0, 2]];
const GANA_M = [[6, 6, 0], [5, 6, 0], [1, 0, 6]];
const rel = (a, b) => (a === b || D.FRIENDS[a].f.includes(b) ? 'F' : D.FRIENDS[a].e.includes(b) ? 'E' : 'N');
function ashtakoot(b, g) {
  const ba = b.avakahada, ga = g.avakahada;
  const tara = (from, to) => { const r = (((to - from + 27) % 27) + 1) % 9; return [3, 5, 7].includes(r) ? 0 : 1.5; };
  const lb = D.SIGN_LORD[b.moonSign], lg = D.SIGN_LORD[g.moonSign], rr = [rel(lb, lg), rel(lg, lb)].sort().join('');
  const maitri = lb === lg ? 5 : { FF: 5, FN: 4, NN: 3, EF: 1, EN: 0.5, EE: 0 }[rr];
  const dist = ((g.moonSign - b.moonSign + 12) % 12) + 1;
  return [
    ['Varna', 1, D.VARNA_RANK[ba.varna] >= D.VARNA_RANK[ga.varna] ? 1 : 0, D.VARNA[ba.varna], D.VARNA[ga.varna]],
    ['Vashya', 2, VASHYA_M[ba.vashya][ga.vashya], D.VASHYA[ba.vashya], D.VASHYA[ga.vashya]],
    ['Tara', 3, tara(ga.nak, ba.nak) + tara(ba.nak, ga.nak), D.NAKS[ba.nak], D.NAKS[ga.nak]],
    ['Yoni', 4, D.YONI_MATRIX[ba.yoni][ga.yoni], D.YONI[ba.yoni], D.YONI[ga.yoni]],
    ['Graha Maitri', 5, maitri, lb, lg],
    ['Gana', 6, GANA_M[ba.gana][ga.gana], D.GANA[ba.gana], D.GANA[ga.gana]],
    ['Bhakoot', 7, [2, 12, 5, 9, 6, 8].includes(dist) ? 0 : 7, D.SIGNS[b.moonSign], D.SIGNS[g.moonSign]],
    ['Nadi', 8, ba.nadi === ga.nadi ? 0 : 8, D.NADI[ba.nadi], D.NADI[ga.nadi]],
  ];
}
S['kundli-milan'] = {
  prep: (inp) => {
    const bi = personFromInput(inp.boy), gi = personFromInput(inp.girl);
    const b = E.chart(bi), g = E.chart(gi);
    return { b, g, bi, gi, k: ashtakoot(b, g), bd: E.yogasAndDoshas(b).doshas, gd: E.yogasAndDoshas(g).doshas };
  },
  ai: (d) => ({
    context: summary(d.b, d.bi, 'BOY: ') + summary(d.g, d.gi, 'GIRL: ') + `Ashtakoot: ${d.k.map((r) => `${r[0]} ${r[2]}/${r[1]} (boy ${r[3]}, girl ${r[4]})`).join('; ')}; total ${d.k.reduce((s, r) => s + r[2], 0)}/36. Manglik boy: ${d.bd.manglik.present ? 'yes' : 'no'} (Mars H${d.bd.manglik.houseLagna}), girl: ${d.gd.manglik.present ? 'yes' : 'no'} (Mars H${d.gd.manglik.houseLagna}).`,
    keys: [['overview', 'text', 'overall compatibility summary, ~170 words'], ['koots', 'list', 'exactly 8 items in order Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi; explain each score, ~50 words each'],
      ['manglik', 'text', 'manglik analysis for both and whether it is balanced/cancelled, ~140 words'], ['emotional', 'text', 'emotional & mental compatibility from Moon signs, ~120 words'], ['family', 'text', 'family life & children, ~110 words'],
      ['finance', 'text', 'finance & prosperity together, ~100 words'], ['verdict', 'text', 'final honest verdict with conditions, ~150 words'], ['remedies', 'list', '6 remedies for the couple'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: (d, a, x) => {
    const { t } = x, { b, g, bi, gi, k } = d, total = k.reduce((s, r) => s + r[2], 0);
    const det = (c, i) => T.kv([[t('Name'), i.name], [t('Date of birth'), i.dob.split('-').reverse().join('/')], [t('Time of birth'), i.tob], [t('Place of birth'), i.place], [t('Ascendant'), x.sign(c.ascSign)], [t('Moon sign'), x.sign(c.moonSign)], [t('Nakshatra'), `${x.nak(c.avakahada.nak)} - ${c.avakahada.pada}`], [t('Varna'), x.pick([D.VARNA[c.avakahada.varna], D.VARNA_HI[c.avakahada.varna]])], [t('Yoni'), x.pick([D.YONI[c.avakahada.yoni], D.YONI_HI[c.avakahada.yoni]])], [t('Gan'), x.pick([D.GANA[c.avakahada.gana], D.GANA_HI[c.avakahada.gana]])], [t('Nadi'), x.pick([D.NADI[c.avakahada.nadi], D.NADI_HI[c.avakahada.nadi]])], [t('Manglik'), E.yogasAndDoshas(c).doshas.manglik.present ? t('Yes') : t('No')]]);
    const ptab = (c) => T.table([t('Planet'), t('Sign'), t('Degrees'), t('House')], c.planets.map((p) => [x.pl(p.name), x.sign(p.sign), dms(p.deg), p.house]));
    const verdict = total >= 28 ? t('Excellent match') : total >= 18 ? t('Good match') : t('Below recommended');
    const kn = (n) => t(n);
    return [
      textPage(t('Birth Details of the Couple'), t('Particulars used for matching'), [T.grid2(T.h3(t('Boy')) + det(b, bi), T.h3(t('Girl')) + det(g, gi))]),
      textPage(t('Planetary Positions'), t('Boy and girl'), [T.grid2(T.h3(bi.name) + ptab(b), T.h3(gi.name) + ptab(g))]),
      textPage(t('Horoscope Charts'), t('Lagna and Navamsa charts'), [T.grid2(T.northChart(b.ascSign, items(x, b), `${bi.name} — D1`, x.sign(b.ascSign)), T.northChart(g.ascSign, items(x, g), `${gi.name} — D1`, x.sign(g.ascSign))), T.grid2(T.northChart(b.ascNav, relItems(x, b, b.ascNav, 'nav'), `${bi.name} — D9`, ''), T.northChart(g.ascNav, relItems(x, g, g.ascNav, 'nav'), `${gi.name} — D9`, ''))]),
      textPage(t('Ashtakoot Guna Milan'), t('The eight-fold compatibility test'), [`<div class="score">${total} / 36</div><div class="scs">${T.esc(verdict)}</div>`, T.table([t('Koot'), t('Boy'), t('Girl'), t('Maximum'), t('Obtained')], k.map((r) => [kn(r[0]), t(r[3]), t(r[4]), r[1], { html: `<span class="${r[2] === r[1] ? 'ok' : r[2] === 0 ? 'bad' : 'mid'}">${r[2]}</span>` }])), T.bars(k.map((r) => ({ label: kn(r[0]).split(' ')[0], value: r[2], color: r[2] === 0 ? '#d04a2f' : r[2] === r[1] ? '#2e8b57' : '#f39220' })), 8, { h: 110 })]),
      textPage(t('Koot-wise Analysis'), t('What each score means for the couple'), [cards(x, k.map((r) => `${kn(r[0])} — ${r[2]}/${r[1]}`), T.toArr(a.koots))]),
      textPage(t('Manglik Analysis'), t('Mars placement for both charts'), [T.table([t('Detail'), bi.name, gi.name], [[t('Mars from Lagna'), x.hs(d.bd.manglik.houseLagna), x.hs(d.gd.manglik.houseLagna)], [t('Mars from Moon'), x.hs(d.bd.manglik.houseMoon), x.hs(d.gd.manglik.houseMoon)], [t('Manglik'), d.bd.manglik.present ? t('Yes') : t('No'), d.gd.manglik.present ? t('Yes') : t('No')]]), T.para(a.manglik), T.h3(t('Overview')), T.para(a.overview)]),
      textPage(t('Married Life'), t('Emotional bond, family and prosperity'), [sec(t('Emotional Compatibility'), a.emotional), sec(t('Family & Children'), a.family), sec(t('Finance & Prosperity'), a.finance)]),
      textPage(t('Dasha Comparison'), t('Current planetary periods of both'), [T.table([t('Detail'), bi.name, gi.name], [[t('Mahadasha'), `${x.pl(b.current.md.lord)} (${t('to')} ${x.d(b.current.md.end)})`, `${x.pl(g.current.md.lord)} (${t('to')} ${x.d(g.current.md.end)})`], [t('Antardasha'), `${x.pl(b.current.ad.lord)} (${t('to')} ${x.d(b.current.ad.end)})`, `${x.pl(g.current.ad.lord)} (${t('to')} ${x.d(g.current.ad.end)})`]]), T.callout(t('Final Verdict'), a.verdict)]),
      textPage(t('Remedies for the Couple'), t('For a harmonious married life'), [T.list(a.remedies), T.quote(a.quote)]),
    ];
  },
};

S['dosha-report'] = {
  prep: (inp) => { const c = E.chart(inp); return { c, yd: E.yogasAndDoshas(c), ss: E.sadeSati(c.moonSign), tr: E.transits() }; },
  ai: ({ c, yd, ss, tr }, inp) => ({
    context: summary(c, inp) + `Doshas: ${JSON.stringify(yd.doshas)}. Sade Sati now: ${ss.active ? 'ACTIVE' : 'no'}; Dhaiya now: ${ss.dhaiya ? 'yes' : 'no'}; Saturn now in ${D.SIGNS[ss.saturnSign]}. Periods: ${ss.periods.map((p) => `${p.phase} ${fmtD(p.start)}-${fmtD(p.end)}`).join('; ')}. Current transits: ${tr.map((p) => p.name + ' ' + D.SIGNS[p.sign]).join(', ')}.`,
    keys: [['summary', 'text', 'overall dosha summary, ~140 words'], ['manglik', 'text', 'manglik dosha analysis & effects, ~190 words'], ['kaalsarp', 'text', 'kaal sarp analysis (present or absent and why), ~160 words'],
      ['pitru', 'text', 'pitru dosha analysis, ~150 words'], ['sadesati', 'text', 'sade sati & dhaiya analysis with the listed dates, ~190 words'], ['others', 'text', 'grahan, guru chandal, shrapit and kemadruma as applicable, ~150 words'],
      ['remedies', 'list', '10 remedies, each naming which dosha it addresses'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: ({ c, yd, ss, tr }, a, x, inp) => {
    const { t } = x, ds = yd.doshas, st = (v) => (v ? t('PRESENT') : t('NOT PRESENT'));
    return [
      basicPage(x, c, inp), chartsPage(x, c),
      textPage(t('Dosha Summary'), t('All major doshas checked in your chart'), [doshaTable(x, ds), T.callout(t('Summary'), a.summary)]),
      textPage(t('Manglik Dosha'), t('Mars and its placement'), [T.kv([[t('Mars position'), `${x.sign(c.P.Mars.sign)}, ${x.hs(c.P.Mars.house)}`], [t('Mars from Lagna'), x.hs(ds.manglik.houseLagna)], [t('Mars from Moon'), x.hs(ds.manglik.houseMoon)], [t('Mars from Venus'), x.hs(ds.manglik.houseVenus)], [t('Status'), st(ds.manglik.present)], [t('Mitigation by dignity'), ds.manglik.mitigated ? t('Yes') : t('No')]]), T.para(a.manglik)]),
      textPage(t('Kaal Sarp Dosha'), t('All planets between Rahu and Ketu?'), [T.kv([[t('Rahu'), `${x.sign(c.P.Rahu.sign)}, ${x.hs(c.P.Rahu.house)}`], [t('Ketu'), `${x.sign(c.P.Ketu.sign)}, ${x.hs(c.P.Ketu.house)}`], [t('Status'), st(ds.kaalSarp.present)], [t('Type (if present)'), ds.kaalSarp.present ? x.pick([D.KAAL_SARP[ds.kaalSarp.type], D.KAAL_SARP_HI[ds.kaalSarp.type]]) : '--']]), T.para(a.kaalsarp)]),
      textPage(t('Pitru Dosha'), t('Ancestral karma in the chart'), [T.kv([[t('Status'), st(ds.pitru.present)], [t('Indicators'), ds.pitru.reasons.map((r) => hiText(x, r)).join(', ') || '--'], [t('Sun'), `${x.sign(c.P.Sun.sign)}, ${x.hs(c.P.Sun.house)}`], [t('9th Lord'), x.pl(E.lordOf(c.ascSign, 9))]]), T.para(a.pitru)]),
      textPage(t('Sade Sati & Dhaiya'), t("Saturn's transit over your Moon"), [T.kv([[t('Moon sign'), x.sign(c.moonSign)], [t('Saturn now in'), x.sign(ss.saturnSign)], [t('Sade Sati now'), ss.active ? t('Yes') : t('No')], [t('Dhaiya now'), ss.dhaiya ? t('Yes') : t('No')]]), T.table([t('Phase'), t('Sign'), t('From'), t('To')], ss.periods.map((p) => [t(p.phase), x.sign(p.sign), x.d(p.start), x.d(p.end)])), T.para(a.sadesati)]),
      textPage(t('Other Doshas'), t('Grahan, Guru Chandal, Shrapit and Kemadruma'), [T.h3(t('Current Transits')), T.table([t('Planet'), t('Sign'), t('From Moon')], tr.map((p) => [x.pl(p.name), x.sign(p.sign), x.hs(((p.sign - c.moonSign + 12) % 12) + 1)])), T.para(a.others)]),
      textPage(t('Dosha Remedies'), t('Remedial measures in priority order'), [T.list(a.remedies), T.quote(a.quote)]),
    ];
  },
};

S['gemstone-suggestion'] = {
  prep: (inp) => {
    const c = E.chart(inp), s = c.ascSign, life = D.SIGN_LORD[s], lucky = E.lordOf(s, 5), bhagya = E.lordOf(s, 9), dl = c.current.md.lord;
    const avoid = D.PLANETS.filter((p) => ![life, lucky, bhagya].includes(p) && (nature(c, p) === 'Malefic' || ['Rahu', 'Ketu'].includes(p)));
    return { c, life, lucky, bhagya, dl, avoid };
  },
  ai: (d, inp) => ({
    context: summary(d.c, inp) + `Life stone planet ${d.life} (${D.GEMS[d.life][0]}); lucky (5th lord) ${d.lucky} (${D.GEMS[d.lucky][0]}); bhagya (9th lord) ${d.bhagya} (${D.GEMS[d.bhagya][0]}); current dasha lord ${d.dl} nature ${nature(d.c, d.dl)}; stones to avoid: ${d.avoid.map((p) => D.GEMS[p][0]).join(', ')}.`,
    keys: [['overview', 'text', 'gemstone overview for this chart, ~150 words'], ['life', 'text', 'life stone benefits, ~150 words'], ['lucky', 'text', 'lucky stone benefits, ~140 words'], ['bhagya', 'text', 'bhagya stone benefits, ~140 words'],
      ['dasha', 'text', 'whether to wear the dasha lord stone now, ~120 words'], ['avoid', 'text', 'why to avoid the listed stones, ~120 words'], ['ritual', 'text', 'energising & wearing ritual, ~130 words'], ['care', 'list', '6 care & quality tips'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: (d, a, x, inp) => {
    const { t } = x, { c } = d;
    const row = (purpose, p) => [t(purpose), x.pl(p), x.pick(D.GEMS[p]), x.pick(D.GEM_WEAR[p].finger), x.pick(D.GEM_WEAR[p].metal), x.pick([D.DAYS[D.PLANET_DAY[p]], D.DAYS_HI[D.PLANET_DAY[p]]]), D.GEM_WEAR[p].ratti];
    const stonePage = (title, p, text) => textPage(title, `${x.pick(D.GEMS[p])} — ${x.pl(p)}`, [T.kv([[t('Planet'), `${x.pl(p)} (${ownedStr(x, c, p)})`], [t('Placement'), `${x.sign(c.P[p].sign)}, ${x.hs(c.P[p].house)}, ${t(c.P[p].dignity)}`], [t('Gemstone'), x.pick(D.GEMS[p])], [t('Substitute'), x.pick(D.SUBSTITUTES[p])], [t('Finger'), x.pick(D.GEM_WEAR[p].finger)], [t('Metal'), x.pick(D.GEM_WEAR[p].metal)], [t('Day'), x.pick([D.DAYS[D.PLANET_DAY[p]], D.DAYS_HI[D.PLANET_DAY[p]]])], [t('Weight (ratti)'), D.GEM_WEAR[p].ratti], [t('Mantra'), x.pick(D.MANTRA[p])]]), T.para(text)]);
    return [
      basicPage(x, c, inp),
      textPage(t('Planetary Strength & Nature'), `${t('Functional nature for')} ${x.sign(c.ascSign)} ${t('Ascendant')}`, [T.table([t('Planet'), t('Sign'), t('House'), t('Dignity'), t('Lordship'), t('Nature')], c.planets.map((p) => [x.pl(p.name), x.sign(p.sign), p.house, t(p.dignity), ownedStr(x, c, p.name), { html: `<span class="${stCls(nature(c, p.name))}">${T.esc(t(nature(c, p.name)))}</span>` }])), T.para(a.overview)]),
      chartsPage(x, c),
      textPage(t('Gemstone Recommendation'), t('Your personalised stones'), [T.table([t('Purpose'), t('Planet'), t('Gemstone'), t('Finger'), t('Metal'), t('Day'), t('Ratti')], [row('Life Stone', d.life), row('Lucky Stone', d.lucky), row('Bhagya Stone', d.bhagya)]), T.callout(t('Important'), t('GEM_NOTE'))]),
      stonePage(t('Life Stone'), d.life, a.life), stonePage(t('Lucky Stone'), d.lucky, a.lucky), stonePage(t('Bhagya Stone'), d.bhagya, a.bhagya),
      textPage(t('Dasha Stone & Stones to Avoid'), `${t('Current Mahadasha')}: ${x.pl(d.dl)}`, [sec(`${t('Dasha Lord')} — ${x.pl(d.dl)} (${x.pick(D.GEMS[d.dl])})`, a.dasha), T.h3(t('Stones to Avoid')), T.tags(d.avoid.map((p) => x.pick(D.GEMS[p])), 'r'), T.para(a.avoid)]),
      textPage(t('Wearing Ritual & Care'), t('How to energise and maintain your gemstone'), [T.para(a.ritual), T.h3(t('Care & Quality')), T.list(a.care), T.quote(a.quote)]),
    ];
  },
};

const yantraSquare = (p) => (p === 'Kuber' ? D.KUBER : D.LOSHU.map((r) => r.map((n) => n + D.YANTRA_BASE[p] - 1)));
const KUBER_MANTRA = ['Om Yakshaya Kuberaya Vaishravanaya Dhana Dhanyadhipataye Dhana Dhanya Samriddhim Me Dehi Dapaya Swaha', 'ॐ यक्षाय कुबेराय वैश्रवणाय धनधान्याधिपतये धनधान्यसमृद्धिं मे देहि दापय स्वाहा'];
const YNAME = { Sun: ['Surya Yantra', 'सूर्य यंत्र'], Moon: ['Chandra Yantra', 'चन्द्र यंत्र'], Mars: ['Mangal Yantra', 'मंगल यंत्र'], Mercury: ['Budh Yantra', 'बुध यंत्र'], Jupiter: ['Guru Yantra', 'गुरु यंत्र'], Venus: ['Shukra Yantra', 'शुक्र यंत्र'], Saturn: ['Shani Yantra', 'शनि यंत्र'], Rahu: ['Rahu Yantra', 'राहु यंत्र'], Ketu: ['Ketu Yantra', 'केतु यंत्र'], Kuber: ['Kuber Yantra', 'कुबेर यंत्र'] };
S['yantra-suggestion'] = {
  prep: (inp) => {
    const c = E.chart(inp), prob = D.PROBLEMS[inp.problem] ? inp.problem : 'career', mul = reduce(+inp.dob.slice(8, 10));
    return { c, prob, P: D.PROBLEMS[prob], birth: D.NUM_PLANET[mul], mul, lagna: D.SIGN_LORD[c.ascSign] };
  },
  ai: (d, inp) => ({
    context: summary(d.c, inp) + `Problem: ${d.P.en}. Primary yantra: ${YNAME[d.P.planet][0]}. Birth number ${d.mul} -> ${YNAME[d.birth][0]}. Lagna lord ${d.lagna} -> ${YNAME[d.lagna][0]}.`,
    keys: [['overview', 'text', 'why yantras help this person, ~150 words'], ['primary', 'text', 'how the primary yantra addresses the problem, ~200 words'], ['birth', 'text', 'birth number yantra benefits, ~140 words'], ['lagna', 'text', 'lagna lord yantra benefits, ~140 words'],
      ['procedure', 'list', '8 step-by-step installation & pran-pratishtha steps'], ['mantra', 'text', 'how to do japa for these yantras, ~100 words'], ['dos', 'list', '5 dos'], ['donts', 'list', '5 donts'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: (d, a, x, inp) => {
    const { t } = x, { c } = d;
    const spec = (p) => (p === 'Kuber' ? [[t('Day'), x.pick(['Friday or Thursday', 'शुक्रवार या गुरुवार'])], [t('Direction'), x.pick(['North', 'उत्तर'])], [t('Material'), x.pick(['Copper / Silver / Bhojpatra', 'तांबा / चांदी / भोजपत्र'])], [t('Mantra'), x.pick(KUBER_MANTRA)], [t('Japa'), '108 × 21']]
      : [[t('Planet'), x.pl(p)], [t('Day'), x.pick([D.DAYS[D.PLANET_DAY[p]], D.DAYS_HI[D.PLANET_DAY[p]]])], [t('Direction'), x.pick(D.DIRECTION[p])], [t('Material'), x.pick(['Copper / Silver / Bhojpatra', 'तांबा / चांदी / भोजपत्र'])], [t('Mantra'), x.pick(D.MANTRA[p])], [t('Japa'), `108 × 11 (${t('total')} ${D.MANTRA[p][2]})`]]);
    const yp = (title, sub, p, text) => textPage(title, sub, [T.grid2(T.square(yantraSquare(p), x.pick(YNAME[p]), `${t('Magic sum')}: ${yantraSquare(p)[0].reduce((s, n) => s + n, 0)}`), T.kv(spec(p))), T.para(text)]);
    return [
      basicPage(x, c, inp), planetsPage(x, c), chartsPage(x, c),
      textPage(t('Yantra Recommendation'), x.pick([d.P.en, d.P.hi]), [T.table([t('Purpose'), t('Yantra'), t('Basis')], [[x.pick([d.P.en, d.P.hi]), x.pick(YNAME[d.P.planet]), t('Your concern')], [t('Birth number'), x.pick(YNAME[d.birth]), `${t('Mulank')} ${d.mul}`], [t('Ascendant Lord'), x.pick(YNAME[d.lagna]), x.sign(c.ascSign)]]), T.para(a.overview)]),
      yp(t('Primary Yantra'), x.pick([d.P.en, d.P.hi]), d.P.planet, a.primary),
      yp(t('Birth Number Yantra'), `${t('Mulank')} ${d.mul}`, d.birth, a.birth),
      yp(t('Ascendant Lord Yantra'), `${x.sign(c.ascSign)} ${t('Ascendant')}`, d.lagna, a.lagna),
      textPage(t('Installation Procedure'), t('Pran-pratishtha and placement'), [T.list(a.procedure), T.callout(t('Mantra Japa'), a.mantra)]),
      textPage(t("Do's & Don'ts"), t('Keeping the yantra energised'), [T.h3(t("Do's")), T.list(a.dos), T.h3(t("Don'ts")), T.list(a.donts), T.quote(a.quote)]),
    ];
  },
};

// ---------- tarot ----------
const MAJOR = ['The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance', 'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgement', 'The World'];
const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const DECK = [...MAJOR.map((n, i) => ({ name: n, suit: 'Major', num: ROMAN[i] })), ...['Wands', 'Cups', 'Swords', 'Pentacles'].flatMap((s) => ['Ace', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Page', 'Knight', 'Queen', 'King'].map((r) => ({ name: `${r} of ${s}`, suit: s, num: r })))];
const POS = ['Present situation', 'Challenge', 'Foundation (root cause)', 'Recent past', 'Best possible outcome', 'Near future', 'Your attitude', 'Environment & people', 'Hopes and fears', 'Final outcome'];
const ICON = {
  Major: '<polygon points="20,2 25,15 39,15 28,24 32,38 20,30 8,38 12,24 1,15 15,15" fill="#f39220"/>',
  Wands: '<rect x="18" y="2" width="4" height="36" rx="2" fill="#f39220"/><circle cx="20" cy="6" r="5" fill="#f7d9a8"/>',
  Cups: '<path d="M8 6 h24 c0 14 -6 18 -12 18 c-6 0 -12 -4 -12 -18z M18 24 h4 v8 h6 v4 h-16 v-4 h6z" fill="#f39220"/>',
  Swords: '<path d="M20 1 l4 26 h-8z M10 27 h20 v3 h-20z M18 30 h4 v8 h-4z" fill="#f39220"/>',
  Pentacles: '<circle cx="20" cy="20" r="17" fill="none" stroke="#f39220" stroke-width="3"/><polygon points="20,6 24,16 34,16 26,23 29,33 20,27 11,33 14,23 6,16 16,16" fill="#f39220"/>',
};
const tcard = (c, rev, pos) => `<div class="tcard ${rev ? 'rev' : ''}"><div class="small" style="color:#f7d9a8">${T.esc(pos || '')}</div><svg width="44" height="44" viewBox="0 0 40 40" class="ts" style="${rev ? 'transform:rotate(180deg)' : ''}">${ICON[c.suit]}</svg><div class="tn">${T.esc(c.name)}</div><div class="tr">${c.suit === 'Major' ? 'Major Arcana ' + c.num : c.suit}${rev ? ' · Reversed' : ''}</div></div>`;
S['tarot-reading'] = {
  prep: (inp, order) => {
    const seed = crypto.createHash('sha256').update(`${order.id}|${order.created_at}|${inp.question}`).digest();
    let i = 0; const rnd = () => { const v = seed.readUInt32BE((i * 4) % 28) ^ (i * 2654435761); i++; return ((v >>> 0) % 100000) / 100000; };
    const deck = [...DECK.keys()];
    for (let k = deck.length - 1; k > 0; k--) { const j = Math.floor(rnd() * (k + 1)); [deck[k], deck[j]] = [deck[j], deck[k]]; }
    const draw = deck.slice(0, 10).map((ix, k) => ({ card: DECK[ix], rev: rnd() < 0.3, pos: POS[k] }));
    const [y, m, dd] = inp.dob.split('-').map(Number);
    let bc = m + dd + y; while (bc > 21) bc = String(bc).split('').reduce((s, n) => s + +n, 0);
    return { draw, birth: DECK[bc], when: order.paid_at || new Date() };
  },
  ai: (d, inp) => ({
    context: `Querent ${inp.name}; DOB ${inp.dob}; gender ${inp.gender || ''}. Question: "${inp.question || 'General life guidance'}". Celtic Cross spread: ${d.draw.map((c, i) => `${i + 1}. ${c.pos}: ${c.card.name}${c.rev ? ' (reversed)' : ''}`).join('; ')}. Tarot birth card: ${d.birth.name}.`,
    keys: [['overview', 'text', 'opening overview of the reading for the question, ~150 words'], ['cards', 'list', 'exactly 10 items in spread order; meaning of the card in its position for this question, ~85 words each'],
      ['birth', 'text', 'birth card meaning for this person, ~120 words'], ['synthesis', 'text', 'combined reading and clear answer, ~200 words'], ['advice', 'list', '6 actionable pieces of advice'], ['timing', 'text', 'likely timing and what to watch, ~90 words'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: (d, a, x, inp) => {
    const { t } = x, ct = T.toArr(a.cards);
    const cp = (from, to) => textPage(t('Card-by-Card Reading'), `${t('Cards')} ${from + 1} - ${to}`, d.draw.slice(from, to).map((c, k) => `<div class="row" style="margin-bottom:10px"><div class="side">${tcard(c.card, c.rev, `${from + k + 1}`)}</div><div class="main"><h4>${from + k + 1}. ${T.esc(t(c.pos))} — ${T.esc(c.card.name)}${c.rev ? ' (' + T.esc(t('Reversed')) + ')' : ''}</h4><p>${T.esc(ct[from + k] || '')}</p></div></div>`));
    return [
      textPage(t('Reading Details'), t('Querent and spread'), [T.kv([[t('Name'), inp.name], [t('Date of birth'), inp.dob.split('-').reverse().join('/')], [t('Question'), inp.question || t('General life guidance')], [t('Date of reading'), x.d(d.when)], [t('Spread'), t('Celtic Cross (10 cards)')], [t('Birth Card'), d.birth.name]]), T.callout(t('Overview'), a.overview)]),
      textPage(t('Your Spread'), t('Celtic Cross layout'), [`<div class="g3" style="grid-template-columns:repeat(5,1fr)">${d.draw.map((c, i) => `<div>${tcard(c.card, c.rev, `${i + 1}. ${t(c.pos)}`)}</div>`).join('')}</div>`, T.h3(t('Positions')), T.table(['#', t('Position'), t('Card')], d.draw.map((c, i) => [i + 1, t(c.pos), c.card.name + (c.rev ? ` (${t('Reversed')})` : '')]))]),
      cp(0, 3), cp(3, 6), cp(6, 8), cp(8, 10),
      textPage(t('Your Birth Card'), d.birth.name, [`<div class="row"><div class="side">${tcard(d.birth, false, t('Birth Card'))}</div><div class="main">${T.para(a.birth)}</div></div>`]),
      textPage(t('The Complete Reading'), t('What the cards say together'), [T.para(a.synthesis), T.callout(t('Timing'), a.timing)]),
      textPage(t('Guidance & Advice'), t('Steps to take now'), [T.list(a.advice), T.quote(a.quote)]),
    ];
  },
};

S['kp-kundli'] = {
  prep: (inp) => {
    const c = E.chart(inp), now = new Date();
    const sig = [...Array(12).keys()].map((i) => {
      const h = i + 1, occ = c.planets.filter((p) => p.bhava === h).map((p) => p.name), owner = D.SIGN_LORD[c.cusps[i].sign];
      return { h, l1: c.planets.filter((p) => occ.includes(p.kp.star)).map((p) => p.name), l2: occ, l3: c.planets.filter((p) => p.kp.star === owner).map((p) => p.name), l4: [owner] };
    });
    const nc = E.chartAtDate(now, c.input.lat, c.input.lon, c.input.tz), ascK = E.kpLords(nc.asc), moonK = nc.P.Moon.kp;
    const wd = new Date(+now + c.input.tz * 3600000).getUTCDay();
    const rp = [['Day Lord', D.DAY_LORD[wd]], ['Ascendant Sign Lord', ascK.sign], ['Ascendant Star Lord', ascK.star], ['Moon Sign Lord', moonK.sign], ['Moon Star Lord', moonK.star]];
    return { c, sig, rp, now };
  },
  ai: ({ c, sig, rp }, inp) => ({
    context: summary(c, inp) + `KP Placidus cusps: ${c.cusps.map((k, i) => `C${i + 1} ${D.SIGNS[k.sign]} ${k.deg.toFixed(1)} sign:${k.kp.sign} star:${k.kp.star} sub:${k.kp.sub}`).join('; ')}. Planets KP: ${c.planets.map((p) => `${p.name} bhava${p.bhava} star:${p.kp.star} sub:${p.kp.sub}`).join('; ')}. Significators: ${sig.map((s) => `H${s.h}: ${[...new Set([...s.l1, ...s.l2, ...s.l3, ...s.l4])].join(',')}`).join('; ')}. Ruling planets now: ${rp.map((r) => r[1]).join(', ')}.`,
    keys: [['overview', 'text', 'KP overview of this chart, ~150 words'], ['houses', 'list', 'exactly 12 items for cusps 1-12; cusp sub-lord verdict for that house, ~45 words each'],
      ['career', 'text', 'career via 10th cusp sub-lord & 2/6/10/11, ~140 words'], ['marriage', 'text', 'marriage via 7th cusp sub-lord & 2/7/11, ~140 words'], ['finance', 'text', 'finance via 2/11, ~120 words'], ['health', 'text', 'health via 1/6/8/12, ~100 words'],
      ['dasha', 'text', 'current dasha results per KP significations, ~140 words'], ['remedies', 'list', '6 remedies'], ['quote', 'text', 'closing line, max 20 words']],
  }),
  render: ({ c, sig, rp, now }, a, x, inp) => {
    const { t } = x, L = (arr) => arr.map((p) => x.ab(p)).join(', ') || '--';
    return [
      basicPage(x, c, inp),
      textPage(t('KP Cusps (Placidus)'), t('Sign, star, sub and sub-sub lords of each cusp'), [T.table([t('Cusp'), t('Sign'), t('Degrees'), t('Sign Lord'), t('Star Lord'), t('Sub Lord'), t('Sub-Sub')], c.cusps.map((k, i) => [i + 1, x.sign(k.sign), dms(k.deg), x.pl(k.kp.sign), x.pl(k.kp.star), x.pl(k.kp.sub), x.pl(k.kp.subsub)])), T.callout(t('KP Overview'), a.overview)]),
      textPage(t('KP Planetary Positions'), t('Star and sub lords of planets'), [T.table([t('Planet'), t('Sign'), t('Degrees'), t('Bhava'), t('Sign Lord'), t('Star Lord'), t('Sub Lord')], c.planets.map((p) => [x.pl(p.name), x.sign(p.sign), dms(p.deg), p.bhava, x.pl(p.kp.sign), x.pl(p.kp.star), x.pl(p.kp.sub)])), T.grid2(T.northChart(c.ascSign, items(x, c), t('LAGNA CHART (D1)'), x.sign(c.ascSign)), T.northChart(c.ascSign, items(x, c, 'bhava'), t('BHAVA CHALIT (KP)'), t('Placidus houses')))]),
      textPage(t('House Significators'), t('Four-level KP significators'), [T.table([t('House'), t('L1: In star of occupants'), t('L2: Occupants'), t('L3: In star of owner'), t('L4: Owner')], sig.map((s) => [s.h, L(s.l1), L(s.l2), L(s.l3), L(s.l4)])), T.h3(`${t('Ruling Planets')} (${x.dt(now)})`), T.table([t('Factor'), t('Planet')], rp.map((r) => [t(r[0]), x.pl(r[1])]))]),
      textPage(t('Cusp-wise Analysis'), t('Verdict of each cusp sub-lord'), [cards(x, c.cusps.map((k, i) => `${t('Cusp')} ${i + 1} — ${t('Sub Lord')} ${x.pl(k.kp.sub)}`), T.toArr(a.houses))]),
      textPage(t('Career & Marriage'), t('10th and 7th cusp analysis'), [sec(t('Career'), a.career), sec(t('Marriage'), a.marriage)]),
      textPage(t('Finance & Health'), t('2nd, 11th, 6th and 8th cusp analysis'), [sec(t('Finance'), a.finance), sec(t('Health'), a.health)]),
      dashaPage(x, c, a.dasha, inp),
      textPage(t('Remedies'), t('KP based remedial measures'), [T.list(a.remedies), T.quote(a.quote)]),
    ];
  },
};

module.exports = { S, X, summary, fmtD };
