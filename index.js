#!/usr/bin/env node

import { Command } from "commander";
import auth from './commands/auth.js';
import publish from "./commands/publish.js";
import sync from "./commands/sync.js";

const program = new Command();

if (process.env.NODE_ENV === 'dev') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

program
  .name('zh-cli')
  .description('CLI to ZH functions')
  .version('1.0.0');

program
  .command('auth <token>')
  .description('Authenticate user')
  .action(auth)

program
  .command('publish <set-id>')
  .description('Publish token set')
  .action(publish)

program
  .command('sync <set-id>')
  .description('Sync token set')
  .action(sync)

program.parse();
