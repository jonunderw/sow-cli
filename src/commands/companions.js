const chalk = require('chalk');
const Table = require('cli-table3');
const { loadPlantData, loadCompanionMatrix } = require('../utils/dataLoader');

async function showCompanions(options) {
  try {
    const plantsData = loadPlantData();
    const companionMatrix = loadCompanionMatrix();
    
    if (options.plant) {
      // Show companions for specific plant
      await showCompanionsForPlant(options.plant, plantsData, companionMatrix);
    } else {
      // Show general companion planting principles
      await showCompanionPrinciples(companionMatrix);
    }
    
  } catch (error) {
    console.error(chalk.red('Error showing companions:'), error.message);
  }
}

async function showCompanionsForPlant(plantKey, plantsData, companionMatrix) {
  const plant = plantsData[plantKey];
  if (!plant) {
    console.log(chalk.red(`❌ Plant '${plantKey}' not found`));
    return;
  }
  
  console.log(chalk.blue(`🤝 Companion Plants for ${plant.name}\n`));
  
  const relationships = companionMatrix.relationships[plantKey];
  if (!relationships) {
    console.log(chalk.yellow('No companion data available for this plant.'));
    return;
  }
  
  // Categorize companions
  const excellent = [];
  const good = [];
  const neutral = [];
  const avoid = [];
  const bad = [];
  
  Object.entries(relationships).forEach(([companionKey, relationship]) => {
    const companionPlant = plantsData[companionKey];
    const name = companionPlant ? companionPlant.name : companionKey;
    
    switch (relationship) {
      case 'excellent':
        excellent.push(name);
        break;
      case 'good':
        good.push(name);
        break;
      case 'neutral':
        neutral.push(name);
        break;
      case 'avoid':
        avoid.push(name);
        break;
      case 'bad':
        bad.push(name);
        break;
    }
  });
  
  // Display results
  if (excellent.length > 0) {
    console.log(chalk.green('✨ Excellent Companions (plant together):'));
    excellent.forEach(name => console.log(`  ${chalk.green('●')} ${name}`));
    console.log();
  }
  
  if (good.length > 0) {
    console.log(chalk.blue('👍 Good Companions:'));
    good.forEach(name => console.log(`  ${chalk.blue('●')} ${name}`));
    console.log();
  }
  
  if (avoid.length > 0) {
    console.log(chalk.yellow('⚠️  Avoid Planting Near:'));
    avoid.forEach(name => console.log(`  ${chalk.yellow('●')} ${name}`));
    console.log();
  }
  
  if (bad.length > 0) {
    console.log(chalk.red('🚫 Never Plant With:'));
    bad.forEach(name => console.log(`  ${chalk.red('●')} ${name}`));
    console.log();
  }
  
  // Show plant-specific preferences
  console.log(chalk.gray('📝 Plant Information:'));
  console.log(chalk.gray(`  Category: ${plant.category}`));
  console.log(chalk.gray(`  Space needed: ${plant.space_per_plant} sq ft per plant`));
  console.log(chalk.gray(`  Days to maturity: ${plant.days_to_maturity} days`));
  if (plant.notes) {
    console.log(chalk.gray(`  Notes: ${plant.notes}`));
  }
}

async function showCompanionPrinciples(companionMatrix) {
  console.log(chalk.blue('🤝 Companion Planting Principles\n'));
  
  // Show legend
  console.log(chalk.cyan('Legend:'));
  Object.entries(companionMatrix.legend).forEach(([level, description]) => {
    const color = getRelationshipColor(level);
    console.log(`  ${color(level.toUpperCase())}: ${description}`);
  });
  console.log();
  
  // Show general principles
  console.log(chalk.cyan('General Principles:'));
  Object.entries(companionMatrix.general_principles).forEach(([family, info]) => {
    console.log(chalk.green(`\n${family.toUpperCase()}:`));
    console.log(`  ${info.description}`);
    console.log(`  ${chalk.blue('Works well with:')} ${info.good_with.join(', ')}`);
    console.log(`  ${chalk.yellow('Avoid with:')} ${info.avoid_with.join(', ')}`);
  });
  
  // Show plant families table
  console.log(chalk.blue('\n🏷️  Plant Family Categories:\n'));
  
  const plantsData = loadPlantData();
  const families = {};
  
  Object.entries(plantsData).forEach(([key, plant]) => {
    const category = plant.category;
    if (!families[category]) {
      families[category] = [];
    }
    families[category].push(plant.name);
  });
  
  const table = new Table({
    head: ['Family', 'Plants'],
    style: { head: ['cyan'] },
    colWidths: [20, 50]
  });
  
  Object.entries(families).forEach(([family, plants]) => {
    table.push([
      family.replace('_', ' ').toUpperCase(),
      plants.slice(0, 6).join(', ') + (plants.length > 6 ? '...' : '')
    ]);
  });
  
  console.log(table.toString());
  
  // Quick reference matrix for common plants
  console.log(chalk.blue('\n📊 Quick Reference Matrix:\n'));
  showQuickMatrix(companionMatrix, plantsData);
}

function showQuickMatrix(companionMatrix, plantsData) {
  const commonPlants = ['tomato', 'basil', 'lettuce', 'carrots', 'onion', 'beans'];
  
  // Header
  process.stdout.write('        ');
  commonPlants.forEach(plant => {
    const name = plantsData[plant]?.name || plant;
    process.stdout.write(name.substring(0, 6).padEnd(8));
  });
  console.log();
  
  // Matrix rows
  commonPlants.forEach(plantA => {
    const nameA = plantsData[plantA]?.name || plantA;
    process.stdout.write(nameA.substring(0, 6).padEnd(8));
    
    commonPlants.forEach(plantB => {
      if (plantA === plantB) {
        process.stdout.write('   -    ');
      } else {
        const relationship = companionMatrix.relationships[plantA]?.[plantB] || 'neutral';
        const symbol = getRelationshipSymbol(relationship);
        const color = getRelationshipColor(relationship);
        process.stdout.write(color(`   ${symbol}    `));
      }
    });
    console.log();
  });
  
  console.log('\nSymbols: ✨ Excellent, ✅ Good, ➖ Neutral, ⚠️  Avoid, ❌ Bad');
}

function getRelationshipColor(relationship) {
  switch (relationship) {
    case 'excellent': return chalk.green.bold;
    case 'good': return chalk.blue;
    case 'neutral': return chalk.gray;
    case 'avoid': return chalk.yellow;
    case 'bad': return chalk.red;
    default: return chalk.gray;
  }
}

function getRelationshipSymbol(relationship) {
  switch (relationship) {
    case 'excellent': return '✨';
    case 'good': return '✅';
    case 'neutral': return '➖';
    case 'avoid': return '⚠️';
    case 'bad': return '❌';
    default: return '?';
  }
}

module.exports = { showCompanions };
