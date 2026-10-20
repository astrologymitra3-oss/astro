// One OpenAI call per report: compact computed data in, strict JSON sections out
async function askAI(settings, { lang, report, context, keys }) {
  if (!settings.openai_key) throw new Error('OpenAI API key is not configured (Admin > Settings)');
  const langLine = lang === 'hi'
    ? 'Write every value in clear, natural Hindi (Devanagari script). Use Hindi names for planets, signs, nakshatras and houses (सूर्य, मेष, अश्विनी, प्रथम भाव). Keep mantras in Devanagari.'
    : 'Write every value in clear, warm Indian English.';
  const schema = keys.map(([k, type, g]) => `"${k}": ${type === 'list' ? 'array of strings' : 'string'} - ${g}`).join('\n');
  const system = `You are a senior Indian astrologer (Pandit ji) writing a paid, personalised ${report}. Rules: use ONLY the computed data supplied - never invent or alter positions, dates, scores or statuses; make every paragraph specific to this person's data; practical, positive yet honest; no markdown, no headings, no disclaimers inside values; separate paragraphs in strings with \\n\\n. ${langLine}\nReturn ONE JSON object with exactly these keys:\n${schema}`;
  let lastErr;
  for (let attempt = 0; attempt < 2; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 240000);
    try {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST', signal: ctrl.signal,
        headers: { Authorization: `Bearer ${settings.openai_key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: settings.openai_model || 'gpt-4o-mini', response_format: { type: 'json_object' }, max_completion_tokens: 14000,
          messages: [{ role: 'system', content: system }, { role: 'user', content: context }],
        }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(`OpenAI: ${j.error?.message || r.status}`);
      const out = JSON.parse(j.choices[0].message.content);
      for (const [k, type] of keys) if (out[k] == null) out[k] = type === 'list' ? [] : '';
      out.__usage = j.usage;
      return out;
    } catch (e) {
      lastErr = e;
      if (/API key|401|quota|billing/i.test(e.message)) break;
    } finally { clearTimeout(timer); }
  }
  throw lastErr;
}

module.exports = { askAI };
