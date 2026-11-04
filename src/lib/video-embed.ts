/**
 * Turns a YouTube or Vimeo page link into a privacy-friendly embed URL.
 * Returns null for any other host; those are shown as a plain link instead.
 */
export function videoEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:') return null;
  const host = u.hostname.replace(/^www\.|^m\./, '');

  let youtubeId: string | null = null;
  if (host === 'youtu.be') youtubeId = u.pathname.slice(1).split('/')[0];
  else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    if (u.pathname === '/watch') youtubeId = u.searchParams.get('v');
    else {
      const m = u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
      if (m) youtubeId = m[1];
    }
  }
  if (youtubeId && /^[\w-]{6,20}$/.test(youtubeId)) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`;
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const m = u.pathname.match(/(?:^|\/)(\d{5,12})(?:\/([\da-f]+))?/);
    if (m) {
      const hash = m[2] || u.searchParams.get('h');
      return `https://player.vimeo.com/video/${m[1]}?dnt=1${hash ? `&h=${hash}` : ''}`;
    }
  }
  return null;
}
