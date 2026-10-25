import { getAllArticles } from "@/lib/docs-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// llms-full.txt: every documentation article as Markdown in one file, so a
// crawler can ingest the docs without parsing the site's HTML.
export function GET() {
  const articles = getAllArticles().map((a) =>
    [
      `<!-- source: ${SITE_URL}/docs/${a.category}/${a.slug}/ | edition: ${a.edition} | updated: ${a.updatedAt} -->`,
      a.content.trim(),
    ].join("\n\n"),
  );

  const body = [`# ${SITE_NAME}\n\n> ${SITE_DESCRIPTION}`, ...articles].join("\n\n---\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
