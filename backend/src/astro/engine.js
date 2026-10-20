// Sidereal (Lahiri) chart calculations built on astronomy-engine (VSOP87/ELP based ephemeris)
const A = require('astronomy-engine');
const D = require('./data');

const RAD = Math.PI / 180, DEG = 180 / Math.PI, DAY = 864e5, YEAR = 365.25 * DAY;
const norm = (x) => ((x % 360) + 360) % 360;
const AY0 = 23.8571, RATE = 0.0139689; // Lahiri ayanamsa at J2000 and annual precession
const ROT = A.Rotation_EQJ_ECL();

function toDate(dob, tob, tz) {
  const [y, m, d] = dob.split('-').map(Number);
  const [h, mi] = (tob || '12:00').split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, h, mi) - tz * 3600000);
}
const ayanamsa = (date) => AY0 + (RATE * A.MakeTime(date).tt) / 365.25;

function lonOf(p, date) {
  if (p === 'Rahu' || p === 'Ketu') {
    // True node (Meeus): mean node + main periodic terms
    const T = A.MakeTime(date).tt / 36525;
    const Dm = (297.8501921 + 445267.1114034 * T) * RAD, M = (357.5291092 + 35999.0502909 * T) * RAD;
    const Mm = (134.9633964 + 477198.8675055 * T) * RAD, F = (93.272095 + 483202.0175233 * T) * RAD;
    const corr = -1.4979 * Math.sin(2 * (Dm - F)) - 0.15 * Math.sin(M) - 0.1226 * Math.sin(2 * Dm) + 0.1176 * Math.sin(2 * F) - 0.0801 * Math.sin(2 * (F - Mm));
    const r = norm(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + corr - ayanamsa(date));
    return p === 'Rahu' ? r : norm(r + 180);
  }
  const v = A.GeoVector(A.Body[p], date, true);
  return norm(A.SphereFromVector(A.RotateVector(ROT, v)).lon - AY0);
}

// Ascendant + Placidus cusps (sidereal)
function houses(date, lat, lon) {
  const t = A.MakeTime(date), T = t.tt / 36525;
  const eps = (23.4392911 - 0.0130042 * T) * RAD, phi = lat * RAD;
  const ramc = norm(A.SiderealTime(t) * 15 + lon), ay = ayanamsa(date);
  const eclFromRA = (ra) => norm(Math.atan2(Math.sin(ra * RAD), Math.cos(ra * RAD) * Math.cos(eps)) * DEG);
  const asc = norm(Math.atan2(Math.cos(ramc * RAD), -(Math.sin(ramc * RAD) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) * DEG);
  const mc = eclFromRA(ramc);
  const plac = (f, below) => {
    let ad = 0, l = 0;
    for (let i = 0; i < 15; i++) {
      const ra = below ? ramc + 180 - f * (90 - ad) : ramc + f * (90 + ad);
      l = eclFromRA(ra);
      const dec = Math.asin(Math.sin(eps) * Math.sin(l * RAD));
      ad = Math.asin(Math.max(-1, Math.min(1, Math.tan(phi) * Math.tan(dec)))) * DEG;
    }
    return l;
  };
  const c = new Array(12);
  c[0] = asc; c[9] = mc; c[10] = plac(1 / 3, false); c[11] = plac(2 / 3, false); c[1] = plac(2 / 3, true); c[2] = plac(1 / 3, true);
  for (let i = 3; i < 9; i++) c[i] = norm(c[(i + 6) % 12] + 180);
  return { asc: norm(asc - ay), cusps: c.map((x) => norm(x - ay)) };
}

function nakInfo(lon) {
  const n = Math.min(26, Math.floor(lon / (40 / 3)));
  const within = lon - (n * 40) / 3;
  return { n, pada: Math.min(4, Math.floor(within / (10 / 3)) + 1), lord: D.DASHA_ORDER[n % 9], frac: within / (40 / 3) };
}

function kpLords(lon) {
  const nk = nakInfo(lon), span = 40 / 3;
  let pos = lon - nk.n * span, idx = D.DASHA_ORDER.indexOf(nk.lord), sub = nk.lord, subsub = nk.lord;
  for (let i = 0; i < 9; i++) {
    const p = D.DASHA_ORDER[(idx + i) % 9], len = (span * D.DASHA_YEARS[p]) / 120;
    if (pos < len || i === 8) {
      sub = p;
      let pos2 = pos; const j0 = (idx + i) % 9;
      for (let k = 0; k < 9; k++) {
        const q = D.DASHA_ORDER[(j0 + k) % 9], l2 = (len * D.DASHA_YEARS[q]) / 120;
        if (pos2 < l2 || k === 8) { subsub = q; break; }
        pos2 -= l2;
      }
      break;
    }
    pos -= len;
  }
  return { sign: D.SIGN_LORD[Math.floor(lon / 30)], star: nk.lord, sub, subsub };
}

function dignity(p, sign) {
  if (D.EXALT[p] === sign) return 'Exalted';
  if ((D.EXALT[p] + 6) % 12 === sign) return 'Debilitated';
  if (D.MOOLA[p] === sign) return 'Moolatrikona';
  if (D.OWN[p].includes(sign)) return 'Own';
  const lord = D.SIGN_LORD[sign], f = D.FRIENDS[p];
  if (!f) return 'Neutral';
  if (f.f.includes(lord)) return 'Friendly';
  if (f.e.includes(lord)) return 'Enemy';
  return 'Neutral';
}

function vashya(lon) {
  const s = Math.floor(lon / 30), deg = lon % 30;
  if (s === 8) return deg < 15 ? 1 : 0;
  if (s === 9) return deg < 15 ? 0 : 2;
  return [0, 0, 1, 2, 3, 1, 1, 4, 0, 0, 1, 2][s];
}

function dashas(moonLon, birth) {
  const nk = nakInfo(moonLon), start = D.DASHA_ORDER.indexOf(nk.lord);
  let t = +birth - nk.frac * D.DASHA_YEARS[nk.lord] * YEAR;
  const list = [];
  for (let i = 0; i < 9; i++) {
    const p = D.DASHA_ORDER[(start + i) % 9], len = D.DASHA_YEARS[p] * YEAR;
    const md = { lord: p, start: new Date(t), end: new Date(t + len), antar: [] };
    let s = t;
    for (let j = 0; j < 9; j++) {
      const q = D.DASHA_ORDER[(start + i + j) % 9], l = (len * D.DASHA_YEARS[q]) / 120;
      md.antar.push({ lord: q, start: new Date(s), end: new Date(s + l) });
      s += l;
    }
    list.push(md);
    t += len;
  }
  return list;
}
function dashaAt(list, when = new Date()) {
  const md = list.find((m) => m.start <= when && m.end > when) || list[list.length - 1];
  const ad = md.antar.find((a) => a.start <= when && a.end > when) || md.antar[0];
  return { md, ad };
}

const navSign = (lon) => Math.floor((lon * 9) / 30) % 12;

function planetsAt(date, ascSign) {
  const sunLon = lonOf('Sun', date);
  return D.PLANETS.map((p) => {
    const lon = lonOf(p, date), sign = Math.floor(lon / 30);
    let retro = p === 'Rahu' || p === 'Ketu';
    if (!['Sun', 'Moon', 'Rahu', 'Ketu'].includes(p)) {
      const a = lonOf(p, new Date(+date - DAY / 2)), b = lonOf(p, new Date(+date + DAY / 2));
      retro = norm(b - a) > 180;
    }
    const dist = Math.abs(norm(lon - sunLon + 180) - 180);
    const lim = p === 'Mercury' && retro ? 12 : p === 'Venus' && retro ? 8 : D.COMBUST[p];
    const nk = nakInfo(lon);
    return {
      name: p, lon, sign, deg: lon % 30, retro, combust: !!lim && dist < lim, nak: nk.n, pada: nk.pada, nakLord: nk.lord,
      house: ((sign - ascSign + 12) % 12) + 1, dignity: dignity(p, sign), nav: navSign(lon), kp: kpLords(lon),
    };
  });
}

const fmtTime = (d, tz) => new Date(+d + tz * 3600000).toISOString().substr(11, 8);

function chart({ dob, tob, tz = 5.5, lat, lon }) {
  tz = Number(tz); lat = Number(lat); lon = Number(lon);
  const date = toDate(dob, tob, tz);
  const h = houses(date, lat, lon);
  const ascSign = Math.floor(h.asc / 30);
  const planets = planetsAt(date, ascSign);
  const P = Object.fromEntries(planets.map((p) => [p.name, p]));
  const moon = P.Moon.lon, sun = P.Sun.lon;
  // Panchang
  const diff = norm(moon - sun), ti = Math.floor(diff / 12), k = Math.floor(diff / 6);
  const tithiIdx = ti % 15, shukla = ti < 15;
  const karana = k === 0 ? 10 : k >= 57 ? 7 + (k - 57) : (k - 1) % 7;
  const obs = new A.Observer(lat, lon, 0);
  const localMid = toDate(dob, '00:00', tz);
  const rise = A.SearchRiseSet(A.Body.Sun, obs, +1, localMid, 1);
  const set = A.SearchRiseSet(A.Body.Sun, obs, -1, localMid, 1);
  let wd = new Date(+date + tz * 3600000).getUTCDay();
  if (rise && date < rise.date) wd = (wd + 6) % 7;
  const ascNk = nakInfo(h.asc), moonNk = nakInfo(moon), moonSign = P.Moon.sign;
  // KP bhava placement by Placidus cusps
  const bhava = (l) => {
    for (let i = 0; i < 12; i++) {
      const a = h.cusps[i], b = h.cusps[(i + 1) % 12];
      if (norm(l - a) < norm(b - a)) return i + 1;
    }
    return 1;
  };
  planets.forEach((p) => (p.bhava = bhava(p.lon)));
  const dl = dashas(moon, date);
  return {
    input: { dob, tob, tz, lat, lon }, date, ayanamsa: ayanamsa(date), asc: h.asc, ascSign, ascDeg: h.asc % 30, ascNak: ascNk.n, ascPada: ascNk.pada,
    ascNav: navSign(h.asc), cusps: h.cusps.map((c) => ({ lon: c, sign: Math.floor(c / 30), deg: c % 30, nak: nakInfo(c).n, kp: kpLords(c) })),
    planets, P, moonSign,
    panchang: { tithi: tithiIdx, shukla, purnima: shukla && tithiIdx === 14, amavasya: !shukla && tithiIdx === 14, yoga: Math.floor(norm(moon + sun) / (40 / 3)), karana, weekday: wd, sunrise: rise ? fmtTime(rise.date, tz) : '-', sunset: set ? fmtTime(set.date, tz) : '-' },
    avakahada: {
      varna: moonSign % 4, vashya: vashya(moon), yoni: D.NAK_YONI[moonNk.n], gana: D.NAK_GANA[moonNk.n], nadi: D.NAK_NADI[moonNk.n],
      tatva: moonSign % 4, nak: moonNk.n, pada: moonNk.pada, syllable: moonNk.n * 4 + moonNk.pada - 1,
    },
    dashas: dl, current: dashaAt(dl),
  };
}

// House lordships for an ascendant sign
const lordOf = (ascSign, house) => D.SIGN_LORD[(ascSign + house - 1) % 12];
const housesOwned = (ascSign, planet) => [...Array(12).keys()].map((i) => i + 1).filter((hh) => lordOf(ascSign, hh) === planet);

function functionalNature(ascSign, p) {
  if (p === 'Rahu' || p === 'Ketu') return 'Shadow';
  const hs = housesOwned(ascSign, p);
  const tri = hs.some((x) => [1, 5, 9].includes(x)), ken = hs.some((x) => [4, 7, 10].includes(x));
  const dus = hs.some((x) => [6, 8, 12].includes(x)), upa = hs.some((x) => [3, 11].includes(x));
  if (tri && ken && !hs.includes(1)) return 'Yogakaraka';
  if (tri) return 'Benefic';
  if (dus || upa) return 'Malefic';
  return 'Neutral';
}

function yogasAndDoshas(c) {
  const P = c.P, from = (p, ref) => ((P[p].sign - ref + 12) % 12) + 1, ms = c.moonSign;
  const same = (a, b) => P[a].sign === P[b].sign;
  const ys = [];
  if ([1, 4, 7, 10].includes(from('Jupiter', ms))) ys.push(['Gajakesari Yoga', 'Jupiter in a kendra from the Moon']);
  if (same('Sun', 'Mercury')) ys.push(['Budhaditya Yoga', `Sun and Mercury together in ${D.SIGNS[P.Sun.sign]}`]);
  if (same('Moon', 'Mars')) ys.push(['Chandra-Mangal Yoga', `Moon and Mars together in ${D.SIGNS[P.Moon.sign]}`]);
  const pm = { Mars: 'Ruchaka', Mercury: 'Bhadra', Jupiter: 'Hamsa', Venus: 'Malavya', Saturn: 'Shasha' };
  for (const [p, n] of Object.entries(pm)) if ([1, 4, 7, 10].includes(P[p].house) && ['Exalted', 'Own', 'Moolatrikona'].includes(P[p].dignity)) ys.push([`${n} Yoga (Pancha Mahapurusha)`, `${p} ${P[p].dignity} in house ${P[p].house}`]);
  const real = ['Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const second = real.filter((p) => from(p, ms) === 2), twelfth = real.filter((p) => from(p, ms) === 12);
  if (second.length && twelfth.length) ys.push(['Durudhura Yoga', `${second.join(', ')} 2nd and ${twelfth.join(', ')} 12th from Moon`]);
  else if (second.length) ys.push(['Sunapha Yoga', `${second.join(', ')} 2nd from Moon`]);
  else if (twelfth.length) ys.push(['Anapha Yoga', `${twelfth.join(', ')} 12th from Moon`]);
  const adhi = ['Mercury', 'Jupiter', 'Venus'].filter((p) => [6, 7, 8].includes(from(p, ms)));
  if (adhi.length >= 2) ys.push(['Adhi Yoga', `${adhi.join(', ')} in 6/7/8 from Moon`]);
  const asc = c.ascSign;
  for (const hh of [6, 8, 12]) { const l = lordOf(asc, hh); if (!['Rahu', 'Ketu'].includes(l) && [6, 8, 12].includes(P[l].house) && !housesOwned(asc, l).includes(1)) { ys.push(['Viparita Raja Yoga', `${hh}th lord ${l} in house ${P[l].house}`]); break; } }
  const kendraL = [1, 4, 7, 10].map((x) => lordOf(asc, x)), trikL = [5, 9].map((x) => lordOf(asc, x));
  const rj = new Set();
  for (const k of kendraL) for (const t of trikL) if (k !== t && same(k, t)) rj.add([k, t].sort().join(' + '));
  rj.forEach((x) => ys.push(['Raja Yoga', `${x} (kendra and trikona lords) conjoined`]));
  for (const hh of [2, 11]) { const l = lordOf(asc, hh); if ([1, 4, 5, 7, 9, 10].includes(P[l].house)) { ys.push(['Dhana Yoga', `${hh === 2 ? '2nd' : '11th'} lord ${l} in house ${P[l].house}`]); break; } }

  const ds = {};
  const mH = P.Mars.house, mM = from('Mars', ms), mV = from('Mars', P.Venus.sign), bad = [1, 2, 4, 7, 8, 12];
  ds.manglik = { lagna: bad.includes(mH), moon: bad.includes(mM), venus: bad.includes(mV), houseLagna: mH, houseMoon: mM, houseVenus: mV, mitigated: ['Own', 'Exalted', 'Moolatrikona'].includes(P.Mars.dignity) };
  ds.manglik.present = ds.manglik.lagna || ds.manglik.moon;
  const rahu = P.Rahu.lon, seven = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
  const sides = seven.map((p) => norm(P[p].lon - rahu) < 180);
  const ksp = sides.every((x) => x) || sides.every((x) => !x);
  ds.kaalSarp = { present: ksp, type: P.Rahu.house - 1, rahuHouse: P.Rahu.house, ketuHouse: P.Ketu.house };
  const pit = [];
  if (same('Sun', 'Rahu')) pit.push('Sun with Rahu');
  if (same('Sun', 'Ketu')) pit.push('Sun with Ketu');
  if (same('Sun', 'Saturn')) pit.push('Sun with Saturn');
  if (P.Rahu.house === 9) pit.push('Rahu in 9th house');
  if (P.Ketu.house === 9) pit.push('Ketu in 9th house');
  const l9 = lordOf(asc, 9);
  if (same(l9, 'Rahu') || same(l9, 'Ketu')) pit.push(`9th lord ${l9} with a node`);
  ds.pitru = { present: pit.length > 0, reasons: pit };
  ds.grahan = { present: same('Sun', 'Rahu') || same('Sun', 'Ketu') || same('Moon', 'Rahu') || same('Moon', 'Ketu') };
  ds.guruChandal = { present: same('Jupiter', 'Rahu') || same('Jupiter', 'Ketu') };
  const kem = !real.some((p) => [1, 2, 12].includes(from(p, ms)));
  ds.kemadruma = { present: kem && ![1, 4, 7, 10].some((x) => real.some((p) => P[p].house === x)) };
  ds.shrapit = { present: same('Saturn', 'Rahu') };
  return { yogas: ys, doshas: ds };
}

// Saturn transit over natal Moon: Sade Sati and Dhaiya periods
function sadeSati(moonSign, from = new Date(), years = 40) {
  const startT = +from - 8 * YEAR, endT = +from + years * YEAR, step = 10 * DAY;
  const res = [];
  let cur = null;
  for (let t = startT; t <= endT; t += step) {
    const s = Math.floor(lonOf('Saturn', new Date(t)) / 30), rel = (s - moonSign + 12) % 12;
    const phase = rel === 11 ? 'Rising' : rel === 0 ? 'Peak' : rel === 1 ? 'Setting' : rel === 3 ? 'Kantak Dhaiya' : rel === 7 ? 'Ashtam Dhaiya' : null;
    if (cur && cur.phase === phase) { cur.end = new Date(t); continue; }
    if (cur) res.push(cur);
    cur = phase ? { phase, start: new Date(t), end: new Date(t), sign: s } : null;
  }
  if (cur) res.push(cur);
  // merge retrograde re-entries (same phase within 1 year)
  const out = [];
  for (const r of res) {
    const prev = out.find((o) => o.phase === r.phase && +r.start - +o.end < YEAR);
    if (prev) prev.end = r.end; else out.push({ ...r });
  }
  out.sort((a, b) => a.start - b.start);
  const nowSat = Math.floor(lonOf('Saturn', from) / 30), nowRel = (nowSat - moonSign + 12) % 12;
  return { periods: out.filter((p) => p.end > +from - 3 * YEAR), active: [11, 0, 1].includes(nowRel), dhaiya: [3, 7].includes(nowRel), saturnSign: nowSat };
}

function transits(date = new Date()) {
  return ['Jupiter', 'Saturn', 'Rahu', 'Ketu'].map((p) => ({ name: p, sign: Math.floor(lonOf(p, date) / 30) }));
}

function solarReturn(natalSunLon, dob, year) {
  const [, m, d] = dob.split('-').map(Number);
  let t = Date.UTC(year, m - 1, d);
  for (let i = 0; i < 10; i++) {
    const diff = norm(natalSunLon - lonOf('Sun', new Date(t)) + 180) - 180;
    t += (diff / 0.98565) * DAY;
    if (Math.abs(diff) < 1e-6) break;
  }
  return new Date(t);
}

function chartAtDate(date, lat, lon, tz) {
  const h = houses(date, lat, lon), ascSign = Math.floor(h.asc / 30);
  const planets = planetsAt(date, ascSign);
  return { date, asc: h.asc, ascSign, ascDeg: h.asc % 30, planets, P: Object.fromEntries(planets.map((p) => [p.name, p])), tz };
}

module.exports = { chart, chartAtDate, lonOf, nakInfo, kpLords, dashas, dashaAt, yogasAndDoshas, sadeSati, transits, solarReturn, lordOf, housesOwned, functionalNature, norm, YEAR, DAY };
