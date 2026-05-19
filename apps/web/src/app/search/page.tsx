import { redirect } from 'next/navigation';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim().toLowerCase();
  
  if (query) {
    // If they typed "@username", remove the @
    const username = query.startsWith('@') ? query.slice(1) : query;
    redirect(`/${username}`);
  }

  // Fallback if empty search
  redirect('/');
}
