'use client';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { SERVICES, SITE } from '../lib/services';

let cache = null, pending = null;
const fallback = { contact: { email: SITE.email, address: SITE.address, phone: '', whatsapp: '' }, payment: { bypass: false }, services: SERVICES.map((s) => ({ slug: s.slug, price: s.price, active: true })) };

export function useConfig() {
  const [cfg, setCfg] = useState(cache || fallback);
  useEffect(() => {
    if (cache) return;
    pending = pending || api('/api/config', { auth: null }).then((c) => (cache = c)).catch(() => fallback);
    pending.then(setCfg);
  }, []);
  return cfg;
}
export const priceOf = (cfg, slug) => cfg.services.find((s) => s.slug === slug)?.price ?? SERVICES.find((s) => s.slug === slug)?.price;
