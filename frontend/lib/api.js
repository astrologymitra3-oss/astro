export const API = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export const getToken = (key = 'am_token') => { try { return localStorage.getItem(key); } catch { return null; } };
export const setToken = (t, key = 'am_token') => { try { t ? localStorage.setItem(key, t) : localStorage.removeItem(key); } catch {} };

export async function api(path, { method = 'GET', body, auth = 'am_token' } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const tok = auth && getToken(auth);
  if (tok) headers.Authorization = `Bearer ${tok}`;
  const r = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(data.error || 'Request failed'); e.status = r.status; throw e; }
  return data;
}

export async function downloadPdf(path, filename, auth = 'am_token') {
  const r = await fetch(API + path, { headers: { Authorization: `Bearer ${getToken(auth)}` } });
  if (!r.ok) { const d = await r.json().catch(() => ({})); throw new Error(d.error || 'Download failed'); }
  const url = URL.createObjectURL(await r.blob());
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = resolve; s.onerror = () => reject(new Error('Could not load payment gateway'));
    document.body.appendChild(s);
  });
}

// Opens Razorpay checkout and verifies on success
export async function payWithRazorpay({ orderId, razorpay, user, description }) {
  await loadRazorpay();
  return new Promise((resolve, reject) => {
    const rz = new window.Razorpay({
      key: razorpay.key, order_id: razorpay.orderId, amount: razorpay.amount, currency: razorpay.currency,
      name: 'AstrologyMitra', description, prefill: { name: user?.name, email: user?.email, contact: user?.phone },
      theme: { color: '#ee7d14' },
      handler: async (resp) => { try { await api(`/api/orders/${orderId}/verify`, { method: 'POST', body: resp }); resolve(); } catch (e) { reject(e); } },
      modal: { ondismiss: () => reject(new Error('Payment was cancelled. You can complete it anytime from your dashboard.')) },
    });
    rz.open();
  });
}
