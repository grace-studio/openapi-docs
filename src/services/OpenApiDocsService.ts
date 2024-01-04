import chalk from 'chalk';
import deepmerge from 'deepmerge';
import { FileUtil } from '../utils/FileUtil.js';
import yaml from 'yaml';

const readFile = (src: string) => {
  const fileName = src.split('/').at(-1);
  const type = fileName?.split('.').at(-1);
  const data = FileUtil.readFile(src);

  if (type === 'json') {
    return data ? JSON.parse(data) : data;
  }

  if (type === 'yaml' || type === 'yml') {
    return data ? yaml.parse(data) : data;
  }

  return null;
};

const combineFiles = (inputFiles: string[]) => {
  const fileData = inputFiles.map(readFile);
  const combinedFileData = deepmerge.all(fileData);
  const output = yaml.stringify(combinedFileData);

  FileUtil.writeFile('./docs', 'openapi.yaml', output);

  console.log(chalk.green('\nSuccessfully combined files!'));
};

const createHtmlFile = (inputFiles: string[]) => {
  const fileData = inputFiles.map(readFile);
  const combinedFileData = deepmerge.all(fileData) as any;

  const output = `<!DOCTYPE html>
<html>
  <head>
    <title>${combinedFileData?.info?.title ?? 'OpenAPI Docs'}</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <redoc spec-url="/openapi.yaml"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>`;

  FileUtil.writeFile('./docs', 'index.html', output);

  console.log(chalk.green('\nSuccessfully created html file!'));
};

export const OpenApiDocsService = {
  combineFiles,
  createHtmlFile,
};
