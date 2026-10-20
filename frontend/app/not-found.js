import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="prose center" style={{ padding: '100px 20px' }}>
      <h1>Page not found</h1>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link href="/" className="btn">Go to Home</Link>
    </div>
  );
}
