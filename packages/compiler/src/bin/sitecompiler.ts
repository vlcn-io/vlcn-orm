#!/usr/bin/env node

import { build } from "../index.js";

await Promise.all([build(""), build("docs"), build("blog")]);
