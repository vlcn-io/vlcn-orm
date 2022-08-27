// SIGNED-SOURCE: <3a32b4413eb3e3585ae349a11a1558d0>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */

// @ts-ignore
import * as path from "path";
// @ts-ignore
import * as fs from "fs";

// @ts-ignore
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [User, Deck, Slide, Component, Foo, DeckToEditorsEdge] =
  await Promise.all([
    fs.promises.readFile(path.join(__dirname, "User.sqlite.sql"), {
      encoding: "utf8",
    }),
    fs.promises.readFile(path.join(__dirname, "Deck.sqlite.sql"), {
      encoding: "utf8",
    }),
    fs.promises.readFile(path.join(__dirname, "Slide.sqlite.sql"), {
      encoding: "utf8",
    }),
    fs.promises.readFile(path.join(__dirname, "Component.sqlite.sql"), {
      encoding: "utf8",
    }),
    fs.promises.readFile(path.join(__dirname, "Foo.sqlite.sql"), {
      encoding: "utf8",
    }),
    fs.promises.readFile(path.join(__dirname, "DeckToEditorsEdge.sqlite.sql"), {
      encoding: "utf8",
    }),
  ]);

export default {
  sqlite: {
    example: {
      User,
      Deck,
      Slide,
      Component,
      Foo,
      DeckToEditorsEdge,
    },
  },
};
