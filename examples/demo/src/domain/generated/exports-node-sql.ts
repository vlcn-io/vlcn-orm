// SIGNED-SOURCE: <e7cb79b9d903b464f44bc57b708063c5>
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

const [User] = await Promise.all([
  fs.promises.readFile(path.join(__dirname, "User.sqlite.sql"), {
    encoding: "utf8",
  }),
]);

export default {
  sqlite: {
    demo: {
      User,
    },
  },
};
