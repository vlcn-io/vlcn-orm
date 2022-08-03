// SIGNED-SOURCE: <7bab218345674721193965a357cd9007>
/**
 * AUTO-GENERATED FILE
 * Do not modify. Update your schema and re-generate for changes.
 */

import * as path from "path";
import * as fs from "fs";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const [User, Deck, Slide, Component, DeckToEditorsEdge] = await Promise.all([
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
      DeckToEditorsEdge,
    },
  },
};
