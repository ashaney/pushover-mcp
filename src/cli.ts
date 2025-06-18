#!/usr/bin/env node
import { Command } from 'commander';
import { PushoverMCP } from './index.js';

const program = new Command();

program
  .name('pushover-mcp')
  .description('MCP for Pushover.net notifications')
  .version('1.0.0');

program
  .command('start')
  .description('Start the Pushover MCP server')
  .requiredOption('--token <token>', 'Pushover application token')
  .requiredOption('--user <user>', 'Pushover user key')
  .action(async (options) => {
    let mcp: PushoverMCP | undefined;

    try {
      mcp = new PushoverMCP();
      await mcp.init({
        token: options.token,
        user: options.user,
      });

      // Handle process signals
      const cleanup = async () => {
        if (mcp) {
          await mcp.close();
          process.exit(0);
        }
      };

      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      
      // Keep the process running
      await new Promise(() => {});
    } catch (error) {
      process.exit(1);
    }
  });

program.parse(); 
