// Receives Outrank marketplace articles and commits them to src/content/outrank/,
// which triggers the normal Vercel build so they are prerendered at /blog/guides/{slug}.

const REPO = 'stoffis-git/pourcanvas-website';
const BRANCH = 'main';
const DIR = 'src/content/outrank';

interface OutrankArticle {
  id: string;
  title: string;
  content_markdown?: string;
  content_html: string;
  meta_description: string;
  created_at?: string;
  image_url?: string;
  slug: string;
  tags?: string[];
}

const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const cleanSlug = (slug: string) =>
  slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);

const stripScripts = (html: string) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '');

async function commitArticle(a: OutrankArticle, githubToken: string) {
  const slug = cleanSlug(a.slug);
  if (!slug || !a.title || !a.content_html) throw new Error(`Incomplete article ${a.id}`);

  const path = `${DIR}/${slug}.json`;
  const url = `https://api.github.com/repos/${REPO}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const existing = await fetch(`${url}?ref=${BRANCH}`, { headers });
  const prev = existing.ok ? ((await existing.json()) as { sha: string; content: string }) : null;
  const prevData = prev ? JSON.parse(Buffer.from(prev.content, 'base64').toString('utf-8')) : null;

  const now = new Date().toISOString().split('T')[0];
  const record = {
    id: a.id,
    slug,
    title: a.title,
    metaDescription: a.meta_description ?? '',
    image: a.image_url ?? '',
    tags: a.tags ?? [],
    publishedAt: prevData?.publishedAt ?? (a.created_at ?? now).split('T')[0],
    updatedAt: prevData ? now : undefined,
    html: stripScripts(a.content_html),
  };

  const res = await fetch(url, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      message: `content(outrank): ${prev ? 'update' : 'publish'} ${slug}`,
      content: Buffer.from(JSON.stringify(record, null, 2) + '\n').toString('base64'),
      branch: BRANCH,
      ...(prev && { sha: prev.sha }),
    }),
  });
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
  return slug;
}

export async function POST(request: Request): Promise<Response> {
  const expected = process.env.OUTRANK_WEBHOOK_TOKEN;
  const githubToken = process.env.OUTRANK_GITHUB_TOKEN;
  if (!expected || !githubToken) return json({ error: 'Webhook not configured' }, 500);

  if (request.headers.get('authorization') !== `Bearer ${expected}`) {
    return json({ error: 'Invalid access token' }, 401);
  }

  let payload: { event_type?: string; data?: { articles?: OutrankArticle[]; article?: OutrankArticle } };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const articles =
    payload.event_type === 'publish_articles' ? payload.data?.articles ?? []
    : payload.event_type === 'update_article' && payload.data?.article ? [payload.data.article]
    : [];

  if (articles.length === 0) return json({ message: 'No articles to process' });

  try {
    const slugs = [];
    for (const a of articles) slugs.push(await commitArticle(a, githubToken));
    return json({ message: 'Articles received', urls: slugs.map((s) => `https://pourcanvas.com/blog/guides/${s}`) });
  } catch (e) {
    console.error('[outrank-webhook]', e);
    return json({ error: e instanceof Error ? e.message : 'Publish failed' }, 500);
  }
}
