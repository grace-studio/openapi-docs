#!/usr/bin/env -S node

import { parseArgs, styleText } from 'node:util';
import {
  exitWithError,
  readDocuments,
  writeHtml,
  writeSpec,
} from './services/OpenApiDocsService.js';

const USAGE = 'Usage: openapi-docs -f <files...>';

const parseCommandLine = () => {
  try {
    return parseArgs({
      options: {
        files: { type: 'string', short: 'f', multiple: true },
        help: { type: 'boolean', short: 'h' },
      },
      allowPositionals: true,
    });
  } catch (error) {
    return exitWithError(`${(error as Error).message}\n\n${USAGE}`);
  }
};

console.log(styleText(['green', 'bold'], 'OpenAPI Docs'));

const { values, positionals } = parseCommandLine();

if (values.help) {
  console.log(USAGE);
  process.exit(0);
}

// `-f a b c` puts `b` and `c` in positionals. `merge` was the old default command name.
const files = [...(values.files ?? []), ...positionals].filter(
  (file) => file !== 'merge',
);

if (files.length < 1) {
  exitWithError(`Missing options: input files\n\n${USAGE}`);
}

const document = readDocuments(files);

writeSpec(document);
writeHtml(document);
