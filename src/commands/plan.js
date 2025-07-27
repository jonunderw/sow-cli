const chalk = require('chalk');
const Table = require('cli-table3');
const { loadPlantData, loadCompanionMatrix } = require('../utils/dataLoader');
const { GardenPlanner } = require('../planner');

async function planGarden(options) {
  try {
    console.log(chalk.blue('🏡 Planning your garden...\n'));
    
    // Parse options
    const width = parseInt(options.width) || 10;
    const height = parseInt(options.height) || 10;
    const plantList = options.plants ? options.plants.split(',').map(p => p.trim()) : ['tomato', 'basil', 'lettuce'];
    
    // Parse size option if provided (e.g., "10x10")
    let finalWidth = width;
    let finalHeight = height;
    if (options.size) {
      const [w, h] = options.size.split('x').map(n => parseInt(n));
      if (w && h) {
        finalWidth = w;
        finalHeight = h;
      }
    }
    
    console.log(chalk.gray(`Garden size: ${finalWidth}x${finalHeight} feet (${finalWidth * finalHeight} sq ft)`));
    console.log(chalk.gray(`Plants requested: ${plantList.join(', ')}\n`));
    
    // Create planner and generate layout
    const planner = new GardenPlanner(finalWidth, finalHeight);
    const layout = await planner.planGarden(plantList);
    
    if (!layout.success) {
      console.log(chalk.red('❌ Unable to create garden plan:'));
      console.log(chalk.red(layout.error));
      return;
    }
    
    // Display results
    console.log(chalk.green('✅ Garden plan created successfully!\n'));
    
    // Show plant placement summary
    const table = new Table({
      head: ['Plant', 'Quantity', 'Space Used', 'Expected Yield'],
      style: { head: ['cyan'] }
    });
    
    layout.plantSummary.forEach(plant => {
      table.push([
        plant.name,
        plant.quantity,
        `${plant.spaceUsed} sq ft`,
        `${plant.expectedYield} ${plant.yieldUnit}`
      ]);
    });
    
    console.log(table.toString());
    console.log();
    
    // Show layout grid
    console.log(chalk.blue('📍 Garden Layout:\n'));
    displayGrid(layout.grid, finalWidth, finalHeight);
    
    // Show companion plant warnings
    if (layout.warnings && layout.warnings.length > 0) {
      console.log(chalk.yellow('\n⚠️  Companion Plant Warnings:'));
      layout.warnings.forEach(warning => {
        console.log(chalk.yellow(`  • ${warning}`));
      });
    }
    
    // Show space utilization
    const totalSpace = finalWidth * finalHeight;
    const usedSpace = layout.plantSummary.reduce((sum, plant) => sum + plant.spaceUsed, 0);
    const utilization = ((usedSpace / totalSpace) * 100).toFixed(1);
    
    console.log(chalk.gray(`\n📊 Space utilization: ${usedSpace}/${totalSpace} sq ft (${utilization}%)`));
    
  } catch (error) {
    console.error(chalk.red('Error planning garden:'), error.message);
  }
}

function displayGrid(grid, width, height) {
  const symbols = {
    'tomato': chalk.red('🍅'),
    'basil': chalk.green('🌿'),
    'lettuce': chalk.green('🥬'),
    'carrots': chalk.yellow('🥕'),
    'onion': chalk.yellow('🧅'),
    'beans': chalk.green('🫘'),
    'corn': chalk.yellow('🌽'),
    'squash': chalk.yellow('🎃'),
    'pepper': chalk.red('🌶️'),
    'broccoli': chalk.green('🥦'),
    'radish': chalk.magenta('🟣'),
    'spinach': chalk.green('🍃'),
    'cucumber': chalk.green('🥒'),
    'peas': chalk.green('🟢'),
    'kale': chalk.green('🥬'),
    'beets': chalk.red('🟤'),
    'empty': chalk.gray('⬜')
  };
  
  // Top border
  process.stdout.write('  ');
  for (let x = 0; x < width; x++) {
    process.stdout.write(`${x % 10} `);
  }
  console.log();
  
  // Grid rows
  for (let y = 0; y < height; y++) {
    process.stdout.write(`${y % 10} `);
    for (let x = 0; x < width; x++) {
      const cell = grid[y] && grid[y][x] ? grid[y][x] : 'empty';
      const symbol = symbols[cell] || symbols['empty'];
      process.stdout.write(`${symbol} `);
    }
    console.log();
  }
  
  // Legend
  console.log('\n🔧 Legend:');
  const usedPlants = new Set();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y] && grid[y][x]) {
        usedPlants.add(grid[y][x]);
      }
    }
  }
  
  const plantsData = loadPlantData();
  Array.from(usedPlants).forEach(plant => {
    if (symbols[plant] && plantsData[plant]) {
      console.log(`${symbols[plant]} ${plantsData[plant].name}`);
    }
  });
}

module.exports = { planGarden };
