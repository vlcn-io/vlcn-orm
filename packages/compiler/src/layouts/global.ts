export const meta = {
  og: true,
  twitter: true,
  copyright: true,
  type: "article",
  name: "Aphrodite",
  siteTags: ["software", "schemas", "data"],
  siteAuthor: "Matt Wonlaw",
  siteTwitter: "@tantaman",
  image: {
    url: "https://tantaman.com/aphrodite/logos/0-a-left/Aphrodite-logos_transparent.png",
    width: 1200,
    height: 1200,
    alt: "Aphrodite",
  },
};

export const doc = {
  css: ["index.css"],
  js: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=UA-177900110-1",
      async: true,
    },
    {
      src: "/ga.js",
    },
  ],
};
