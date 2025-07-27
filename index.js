#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const { interactive } = require('./src/cli');
const { planGarden } = require('./src/commands/plan');
const { generateCalendar } = require('./src/commands/calendar');
const { showCompanions } = require('./src/commands/companions');
const { calculateYield } = require('./src/commands/yield');
const { visualizeGarden } = require('./src/commands/visualize');

const program = new Command();

// Display banner
console.log(
  chalk.green(
    figlet.textSync('SOW CLI', {
      font: 'Small',
      horizontalLayout: 'fitted'
    })
  )
);
console.log(chalk.gray('🌱 Garden Planning Made Simple\n'));

program
  .name('sow')
  .description('CLI tool for garden planning with companion planting and yield estimation')
  .version('1.0.0');

// Interactive mode (default)
program
  .command('interactive', { isDefault: true })
  .description('Start interactive garden planning session')
  .action(interactive);

// Plan command
program
  .command('plan')
  .description('Plan your garden layout')
  .option('-w, --width <width>', 'Garden width in feet', '10')
  .option('-h, --height <height>', 'Garden height in feet', '10')
  .option('-p, --plants <plants>', 'Comma-separated list of plants')
  .option('-s, --size <size>', 'Garden size (e.g., 10x10)', '10x10')
  .action(planGarden);

// Calendar command
program
  .command('calendar')
  .description('Generate planting and harvesting calendar')
  .option('-z, --zone <zone>', 'USDA Hardiness Zone', '6a')
  .option('-s, --start-date <date>', 'Start date (YYYY-MM-DD)', new Date().toISOString().split('T')[0])
  .option('-p, --plants <plants>', 'Comma-separated list of plants')
  .action(generateCalendar);

// Companions command
program
  .command('companions')
  .description('View companion planting information')
  .option('-p, --plant <plant>', 'Plant name to show companions for')
  .action(showCompanions);

// Yield command
program
  .command('yield')
  .description('Calculate yield estimates')
  .option('-p, --plants <plants>', 'Comma-separated list of plants with quantities')
  .option('-a, --area <area>', 'Garden area in square feet')
  .action(calculateYield);

// Visualize command
program
  .command('visualize')
  .description('Generate garden layout visualization')
  .option('-f, --format <format>', 'Output format (ascii, html, png)', 'ascii')
  .option('-o, --output <file>', 'Output file path')
  .action(visualizeGarden);

program.parse();
