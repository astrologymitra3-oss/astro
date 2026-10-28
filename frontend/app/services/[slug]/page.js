import { notFound } from 'next/navigation';
import { SERVICES, findService } from '../../../lib/services';
import ServiceView from '../../../components/ServiceView';

export const generateStaticParams = () => SERVICES.map((s) => ({ slug: s.slug }));
export async function generateMetadata({ params }) {
  const s = findService((await params).slug);
  return s ? { title: `${s.title} Report`, description: `${s.tagline}. ${s.short}` } : {};
}

export default async function ServicePage({ params }) {
  const { slug } = await params;
  if (!findService(slug)) notFound();
  return <ServiceView slug={slug} />;
}
