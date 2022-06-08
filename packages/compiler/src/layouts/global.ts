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
    url: "https://aphrodite.sh/assets/gods/zeus.png",
    width: 266,
    height: 200,
    alt: "Zeus",
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
