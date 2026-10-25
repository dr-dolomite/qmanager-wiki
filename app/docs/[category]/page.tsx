import { redirect, notFound } from "next/navigation";
import { DOC_CATEGORIES } from "@/lib/docs-data";

export function generateStaticParams() {
  return DOC_CATEGORIES.map((category) => ({
    category: category.id,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = DOC_CATEGORIES.find((c) => c.id === category);

  if (!cat || cat.articles.length === 0) {
    notFound();
  }

  redirect(`/docs/${category}/${cat.articles[0].slug}/`);
}
