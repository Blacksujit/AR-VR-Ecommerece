import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsPage, DocsBody } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';

export default async function DocsPageRoute({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full} tableOfContent={{ style: 'clerk' }}>
      <h1>{page.data.title}</h1>
      {page.data.description && <p className="text-fd-muted-foreground text-lg">{page.data.description}</p>}
      <DocsBody>
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  const page = source.getPage(slug);

  return {
    title: page ? `${page.data.title} · NeoVerse Docs` : 'NeoVerse Docs',
    description: page?.data.description,
  };
}
