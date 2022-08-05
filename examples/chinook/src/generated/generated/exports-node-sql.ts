// SIGNED-SOURCE: <8380f930afff5ecd44ec28fa9f6a939e>
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

const [
  Album,
  Artist,
  Customer,
  Employee,
  Genre,
  Invoice,
  InvoiceLine,
  MediaType,
  Playlist,
  Track,
  PlaylistTrack,
] = await Promise.all([
  fs.promises.readFile(path.join(__dirname, "Album.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Artist.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Customer.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Employee.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Genre.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Invoice.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "InvoiceLine.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "MediaType.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Playlist.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "Track.sqlite.sql"), {
    encoding: "utf8",
  }),
  fs.promises.readFile(path.join(__dirname, "PlaylistTrack.sqlite.sql"), {
    encoding: "utf8",
  }),
]);

export default {
  sqlite: {
    chinook: {
      Album,
      Artist,
      Customer,
      Employee,
      Genre,
      Invoice,
      InvoiceLine,
      MediaType,
      Playlist,
      Track,
      PlaylistTrack,
    },
  },
};
