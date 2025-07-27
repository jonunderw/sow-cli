const inquirer = require('inquirer');
const chalk = require('chalk');
const { planGarden } = require('./commands/plan');
const { generateCalendar } = require('./commands/calendar');
const { showCompanions } = require('./commands/companions');
const { calculateYield } = require('./commands/yield');
const { visualizeGarden } = require('./commands/visualize');

async function interactive() {
  console.log(chalk.green('\n🌱 Welcome to Sow CLI Interactive Mode!\n'));
  
  const choices = [
    {
      name: '🏡 Plan Garden Layout',
      value: 'plan',
      short: 'Plan'
    },
    {
      name: '📅 Generate Planting Calendar',
      value: 'calendar',
      short: 'Calendar'
    },
    {
      name: '🤝 View Companion Plants',
      value: 'companions',
      short: 'Companions'
    },
    {
      name: '📊 Calculate Yield Estimates',
      value: 'yield',
      short: 'Yield'
    },
    {
      name: '🎨 Visualize Garden',
      value: 'visualize',
      short: 'Visualize'
    },
    {
      name: '❌ Exit',
      value: 'exit',
      short: 'Exit'
    }
  ];

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: choices,
        pageSize: 10
      }
    ]);

    console.log(''); // Add spacing

    switch (action) {
      case 'plan':
        await interactivePlan();
        break;
      case 'calendar':
        await interactiveCalendar();
        break;
      case 'companions':
        await interactiveCompanions();
        break;
      case 'yield':
        await interactiveYield();
        break;
      case 'visualize':
        await interactiveVisualize();
        break;
      case 'exit':
        console.log(chalk.green('🌱 Happy gardening! See you next season!'));
        process.exit(0);
    }

    console.log('\n' + '─'.repeat(50) + '\n');
  }
}

async function interactivePlan() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'width',
      message: 'Garden width (feet):',
      default: '10',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 ? true : 'Please enter a positive number';
      }
    },
    {
      type: 'input',
      name: 'height',
      message: 'Garden height (feet):',
      default: '10',
      validate: (input) => {
        const num = parseInt(input);
        return !isNaN(num) && num > 0 ? true : 'Please enter a positive number';
      }
    },
    {
      type: 'input',
      name: 'plants',
      message: 'Plants to include (comma-separated):',
      default: 'tomato,basil,lettuce,carrots'
    }
  ]);

  await planGarden(answers);
}

async function interactiveCalendar() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'zone',
      message: 'Select your USDA Hardiness Zone:',
      choices: [
        '3a', '3b', '4a', '4b', '5a', '5b',
        '6a', '6b', '7a', '7b', '8a', '8b',
        '9a', '9b', '10a', '10b'
      ],
      default: '6a'
    },
    {
      type: 'input',
      name: 'startDate',
      message: 'Start date (YYYY-MM-DD):',
      default: new Date().toISOString().split('T')[0]
    },
    {
      type: 'input',
      name: 'plants',
      message: 'Plants to include (comma-separated, or leave blank for all):',
      default: ''
    }
  ]);

  await generateCalendar({
    zone: answers.zone,
    'start-date': answers.startDate,
    plants: answers.plants || undefined
  });
}

async function interactiveCompanions() {
  const plantsData = require('../data/plants.json');
  const plantNames = Object.keys(plantsData);
  
  const { plant } = await inquirer.prompt([
    {
      type: 'list',
      name: 'plant',
      message: 'Select a plant to view companions:',
      choices: plantNames.map(name => ({
        name: plantsData[name].name,
        value: name
      })),
      pageSize: 15
    }
  ]);

  await showCompanions({ plant });
}

async function interactiveYield() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'plants',
      message: 'Plants with quantities (e.g., "tomato:4,lettuce:8"):',
      default: 'tomato:4,lettuce:8,carrots:16'
    },
    {
      type: 'input',
      name: 'area',
      message: 'Total garden area (square feet):',
      default: '100'
    }
  ]);

  await calculateYield({
    plants: answers.plants,
    area: answers.area
  });
}

async function interactiveVisualize() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'format',
      message: 'Output format:',
      choices: [
        { name: 'ASCII (terminal display)', value: 'ascii' },
        { name: 'HTML (web page)', value: 'html' },
        { name: 'PNG (image file)', value: 'png' }
      ],
      default: 'ascii'
    },
    {
      type: 'input',
      name: 'output',
      message: 'Output file (leave blank for stdout):',
      when: (answers) => answers.format !== 'ascii'
    }
  ]);

  await visualizeGarden({
    format: answers.format,
    output: answers.output
  });
}

module.exports = { interactive };
