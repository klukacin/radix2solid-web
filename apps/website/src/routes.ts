import type { Component } from 'solid-js';

export type DocumentModule = { default: Component<{ components: Record<string, unknown> }>; frontmatter: { metaTitle: string; metaDescription?: string; [key: string]: unknown } };
const documents = import.meta.glob<DocumentModule>('../data/**/*.mdx');
const metadata = import.meta.glob<DocumentModule['frontmatter']>('../data/**/*.mdx', { eager: true, query: '?frontmatter', import: 'default' });
const pageModules = import.meta.glob<DocumentModule>('./pages/*.tsx');
const pages = {
  '/': { file: './pages/home.tsx', metaTitle: 'Themes', metaDescription: 'Original Radix Themes design and examples, implemented natively in Solid 2.' },
  '/themes/playground': { file: './pages/playground.tsx', metaTitle: 'Playground', metaDescription: 'Explore native Solid Themes components, appearance and theme settings.' },
  '/themes/docs/components': { file: './pages/components.tsx', metaTitle: 'Components', metaDescription: 'Explore native Solid Themes components.' },
  '/primitives/docs/components': { file: './pages/components.tsx', metaTitle: 'Components', metaDescription: 'Explore accessible native Solid Primitives components.' },
  '/themes/example-dashboard': { file: './pages/example-dashboard.tsx', metaTitle: 'Dashboard Example Layout', metaDescription: 'The original Radix Themes dashboard layout, implemented natively in Solid 2.' },
  '/themes/example-ecommerce': { file: './pages/example-ecommerce.tsx', metaTitle: 'Ecommerce Example Layout', metaDescription: 'The original Radix Themes ecommerce layout, implemented natively in Solid 2.' },
  '/themes/example-music-app': { file: './pages/example-music-app.tsx', metaTitle: 'Music App Example Layout', metaDescription: 'The original Radix Themes music layout, implemented natively in Solid 2.' },
  '/icons': { file: './pages/icons.tsx', metaTitle: 'Icons', metaDescription: '332 original 15×15 WorkOS icons plus two separate optional 24×24 Extra icons, with native Solid 2 components and licensed SVG downloads.' },
  '/charts': { file: './pages/charts.tsx', metaTitle: 'Charts', metaDescription: 'Composable SVG charts for native Solid 2, derived from solid-recharts and Recharts. Colors take any CSS value, including Themes tokens.' },
  '/blog': { file: './pages/blog.tsx', metaTitle: 'Blog', metaDescription: 'Historical news from the original Radix team, preserved with attribution by this independent native Solid fork.' },
  '/primitives/case-studies': { file: './pages/case-studies.tsx', metaTitle: 'Case studies', metaDescription: 'Historical case studies about the original Radix React project; not endorsements of this native Solid fork.' },
  '/primitives': { file: './pages/primitives.tsx', metaTitle: 'Primitives', metaDescription: 'The complete original Radix Primitives landing design, with interactive native Solid 2 demonstrations and attributed historical case studies.' },
  '/colors': { file: './pages/colors.tsx', metaTitle: 'Colors', metaDescription: 'The original Radix Colors design and accessible color scales, with native Solid 2 controls.' },
  '/colors/progressions': { file: './pages/colors-progressions.tsx', metaTitle: 'Color progressions', metaDescription: 'Original Radix palette progression visualizations and easing calculations.' },
  '/colors/custom': { file: './pages/colors-custom.tsx', metaTitle: 'Create a custom palette', metaDescription: 'Generate, share, copy and download custom light and dark Radix palettes with native Solid 2 previews.' },
};
export const routes = Object.fromEntries([
  ...Object.entries(documents).map(([file, load]) => [`/${file.slice('../data/'.length).replace(/\.mdx$/, '')}`, { frontmatter: metadata[file], manifestKey: file.slice(3), load }] as const),
  ...Object.entries(pages).map(([path, page]) => {
    const frontmatter = { metaTitle: page.metaTitle, metaDescription: page.metaDescription, kind: 'page' };
    return [path, { frontmatter, manifestKey: `src/${page.file.slice(2)}`, load: async () => ({ ...await pageModules[page.file](), frontmatter }) }] as const;
  }),
]);
