#!/usr/bin/env -S node

import { Command } from 'commander';
import chalk from 'chalk';
import { OpenApiDocsService } from './services/OpenApiDocsService.js';

(() => {
  console.log(chalk.green.bold('OpenAPI Docs'));
  const program = new Command();

  program.name('openapi-docs').usage('command [options]');

  program
    .command('merge', { isDefault: true })
    .option('-f, --files <files...>', 'input files')
    .action((options) => {
      if (!options.files || options.files.length < 1) {
        console.error(chalk.yellow.bold('\nMissing options: input files\n'));
        program.help();
      }

      OpenApiDocsService.combineFiles(options.files);
      OpenApiDocsService.createHtmlFile(options.files);
    });

  program.parse(process.argv);
})();
