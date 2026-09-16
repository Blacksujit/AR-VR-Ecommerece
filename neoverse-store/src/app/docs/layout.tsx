import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider>
      <DocsLayout
        tree={source.getPageTree()}
        nav={{
          title: 'NeoVerse Docs',
          url: '/docs',
        }}
        links={[
          { text: 'Storefront', url: '/' },
          { text: 'GitHub', url: 'https://github.com/' },
        ]}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
