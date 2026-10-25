import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllArticles, getArticle, getAdjacentArticles } from "@/lib/docs-data";
import DocContent from "@/components/doc-content";
import DocToc from "@/components/doc-toc";
import { SITE_NAME, SITE_OG_IMAGE } from "@/lib/site";

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticle(category, slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/docs/${category}/${slug}/` },
    openGraph: {
      title: `${article.title} | QManager`,
      description: article.description,
      type: "article",
      url: `/docs/${category}/${slug}/`,
      siteName: SITE_NAME,
      modifiedTime: article.updatedAt,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} | QManager`,
      description: article.description,
      images: [SITE_OG_IMAGE.url],
    },
  };
}

export default async function DocArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);

  if (!article) {
    notFound();
  }

  const { prev, next } = getAdjacentArticles(category, slug);

  return (
    <>
      <DocContent article={article} prev={prev} next={next} />
      <DocToc toc={article.toc} />
    </>
  );
}
