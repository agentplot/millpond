// millpond's site, built by Astro with Starlight and published to GitHub
// Pages at https://agentplot.github.io/millpond by .github/workflows/pages.yml.
// The diagrams are drawn at build time by src/diagrams/*.ts and inlined, so
// they follow the theme toggle and need no script.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';

export default defineConfig({
  site: 'https://agentplot.github.io',
  base: '/millpond',
  integrations: [
    starlight({
      title: 'millpond',
      description: 'The inbox for events that should change a repository’s work.',
      logo: {
        light: './src/assets/mark-light.svg',
        dark: './src/assets/mark-dark.svg',
        alt: 'millpond',
      },
      favicon: '/favicon.svg',
      // The family's header (its bar above Starlight's), footer and status
      // banner, from @agentplot/site-theme; the start page's hero, with the
      // animated diagram, is millpond's own.
      components: {
        Header: '@agentplot/site-theme/starlight/Header.astro',
        Footer: '@agentplot/site-theme/starlight/Footer.astro',
        Banner: '@agentplot/site-theme/starlight/Banner.astro',
        Hero: './src/components/Hero.astro',
      },
      // The family's type, ink and accent, then the diagrams' palette.
      customCss: ['@agentplot/site-theme/starlight.css', './src/styles/brand.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/agentplot/millpond' }],
      editLink: {
        baseUrl: 'https://github.com/agentplot/millpond/edit/main/site/',
      },
      plugins: [starlightLinksValidator()],
      sidebar: [
        { label: 'Start', link: '/' },
        { label: 'How it works', link: '/how-it-works/' },
        { label: 'How it fits', link: '/how-it-fits/' },
        { label: 'Design', link: '/design/' },
        { label: 'Roadmap', link: '/roadmap/' },
      ],
    }),
  ],
});
