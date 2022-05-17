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
    url: "https://tantaman.com/img/avatar-icon.png",
    width: 312,
    height: 369,
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
