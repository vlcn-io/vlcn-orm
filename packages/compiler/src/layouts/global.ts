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
    url: "https://aphrodite.sh/assets/gods/aphrodite.svg",
    width: 130.75,
    height: 354.05,
    alt: "Aphrodite",
  },
};

export const doc = {
  css: ["/tufte.css", "/main.css"],
  js: [
    {
      src: "https://www.googletagmanager.com/gtag/js?id=G-QT6QH0ZJQ4",
      async: true,
    },
    {
      src: "/ga.js",
    },
  ],
};
