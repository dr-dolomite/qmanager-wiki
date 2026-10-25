import { DOC_CATEGORIES } from "@/lib/docs-data";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

// llms.txt: a plain-Markdown index of the documentation for LLM crawlers and
// agents. Docs only, no site chrome. Full text is in /llms-full.txt.
export function GET() {
  const sections = DOC_CATEGORIES.map((category) => {
    const links = category.articles
      .map(
        (a) =>
          `- [${a.title}](${SITE_URL}/docs/${a.category}/${a.slug}/): ${a.description}`,
      )
      .join("\n");
    return `## ${category.title}\n\n${links}`;
  });

  const body = [
    `# ${SITE_NAME}`,
    `> ${SITE_DESCRIPTION}`,
    `Full documentation as one Markdown file: ${SITE_URL}/llms-full.txt`,
    ...sections,
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
