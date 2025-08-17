import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

const config: Config = {
  title: "INTMAX Network",
  tagline: "Efficient, Private, and Scalable Digital Asset Transactions",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://docs.intmax.io",
  baseUrl: "/",

  organizationName: "InternetMaximalism",
  projectName: "intmax-docs ",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  onBrokenAnchors: "throw",

  presets: [
    [
      "classic",
      {
        docs: {
          path: "user-guides",
          routeBasePath: "user-guides",
          sidebarPath: require.resolve("./sidebars.ts"),
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      "@docusaurus/plugin-content-docs",
      {
        id: "developers-hub",
        path: "developers-hub",
        routeBasePath: "developers-hub",
        sidebarPath: require.resolve("./sidebars-developers-hub.ts"),
      },
    ],
  ],

  themes: [
    "@docusaurus/theme-mermaid",
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en"],
        indexDocs: false,
        indexBlog: false,
        indexPages: true,
      },
    ],
  ],
  markdown: {
    mermaid: true,
  },

  themeConfig: {
    image: "img/social-card.jpg",
    navbar: {
      title: "",
      logo: {
        alt: "INTMAX Logo",
        src: "img/logo.svg",
        srcDark: "img/logo-dark.svg",
      },
      items: [
        {
          href: "/",
          label: "Documentation",
          position: "left",
        },
        { to: "/user-guides", label: "User Guides", position: "left" },
        { to: "/developers-hub", label: "Developers Hub", position: "left" },
        { to: "/community", label: "Community", position: "left" },
        {
          href: "https://app.intmax.io",
          label: "Launch App",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Product",
          items: [
            {
              label: "INTMAX Website",
              href: "https://intmax.io",
            },
            {
              label: "INTMAX App",
              href: "https://app.intmax.io",
            },
            {
              label: "INTMAX Wallet",
              href: "https://wallet.intmax.io",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/InternetMaximalism",
            },
            {
              label: "Discord",
              href: "https://discord.gg/TGMctchPR6",
            },
            {
              label: "X",
              href: "https://x.com/Intmaxio",
            },
            {
              label: "Medium",
              href: "https://medium.com/intmax",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              label: "Terms of Use",
              href: "https://intmax.io/legal/terms-of-service",
            },
            {
              label: "Privacy Policy",
              href: "https://intmax.io/legal/privacy-policy",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} INTMAX. All rights reserved.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
