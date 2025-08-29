import DiagnosticDetailClient from './DiagnosticDetailClient';

type PageParams = { id: string };

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { id } = await params; // ✅
  return <DiagnosticDetailClient id={id} />;
}
