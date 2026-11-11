import fs from 'node:fs';
import { styleText } from 'node:util';
import yaml from 'yaml';
import { deepMerge } from '../utils/deepMerge.js';

/** Pinned to the major version: `latest` broke every page when Redoc 3 shipped as an ES module. */
const REDOC_SCRIPT_URL =
  'https://cdn.redoc.ly/redoc/v3.x/bundles/redoc.standalone.js';

const OUTPUT_DIRECTORY = 'docs';

/** The merged OpenAPI document. Only `info.title` is read here. */
export type OpenApiDocument = { info?: { title?: string } };

/**
 * Prints the message in red and exits the process with code 1.
 *
 * @param message - The error to show.
 * @returns Never; the process exits.
 */
export const exitWithError = (message: string): never => {
  console.error(styleText(['red', 'bold'], `\n${message}\n`));
  process.exit(1);
};

const readText = (src: string) => {
  try {
    return fs.readFileSync(src, 'utf-8');
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return exitWithError(`File not found: ${src}`);
    }

    throw error;
  }
};

const parseFile = (src: string, data: string): unknown => {
  const type = src.split('.').at(-1);

  switch (type) {
    case 'json':
      return JSON.parse(data);
    case 'yaml':
    case 'yml':
      return yaml.parse(data);
    default:
      return exitWithError(
        `Unsupported file type: ${src} (use .json, .yaml or .yml)`,
      );
  }
};

const writeOutputFile = (fileName: string, content: string) => {
  fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
  fs.writeFileSync(`${OUTPUT_DIRECTORY}/${fileName}`, content);
};

const escapeHtml = (text: string) =>
  text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

/**
 * Reads and parses each JSON or YAML file, then merges them from left to right.
 *
 * @param files - Paths relative to the working directory.
 * @returns The merged document.
 */
export const readDocuments = (files: string[]) =>
  files
    .map((src) => parseFile(src, readText(src)))
    .reduce<unknown>(deepMerge, {}) as OpenApiDocument;

/**
 * Writes the merged document to `docs/openapi.yaml`.
 *
 * @param document - The merged document.
 */
export const writeSpec = (document: OpenApiDocument) => {
  writeOutputFile('openapi.yaml', yaml.stringify(document));

  console.log(styleText('green', '\nSuccessfully combined files!'));
};

/**
 * Writes `docs/index.html`, which renders `/openapi.yaml` with Redoc.
 *
 * @param document - The merged document. Its `info.title` becomes the page title.
 */
export const writeHtml = (document: OpenApiDocument) => {
  const title = escapeHtml(document.info?.title ?? 'OpenAPI Docs');

  writeOutputFile(
    'index.html',
    `<!DOCTYPE html>
<html>
  <head>
    <title>${title}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url="/openapi.yaml"></redoc>
    <script type="module" src="${REDOC_SCRIPT_URL}"></script>
  </body>
</html>`,
  );

  console.log(styleText('green', '\nSuccessfully created html file!'));
};
