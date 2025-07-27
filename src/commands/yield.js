const chalk = require('chalk');
const Table = require('cli-table3');
const { loadPlantData } = require('../utils/dataLoader');

async function calculateYield(options) {
  try {
    console.log(chalk.blue('📊 Calculating yield estimates...\n'));
    
    if (!options.plants) {
      console.log(chalk.red('❌ Please specify plants with quantities (e.g., "tomato:4,lettuce:8")'));
      return;
    }
    
    const plantsData = loadPlantData();
    const totalArea = parseInt(options.area) || 100;
    
    // Parse plant quantities
    const plantRequests = [];
    const plantSpecs = options.plants.split(',');
    
    for (const spec of plantSpecs) {
      const [plantKey, quantityStr] = spec.trim().split(':');
      const quantity = parseInt(quantityStr) || 1;
      
      const plant = plantsData[plantKey.trim()];
      if (!plant) {
        console.log(chalk.yellow(`⚠️  Unknown plant: ${plantKey}, skipping...`));
        continue;
      }
      
      plantRequests.push({
        key: plantKey.trim(),
        plant: plant,
        quantity: quantity
      });
    }
    
    if (plantRequests.length === 0) {
      console.log(chalk.red('❌ No valid plants found'));
      return;
    }
    
    // Calculate yields and space requirements
    const results = [];
    let totalSpaceUsed = 0;
    let totalYieldValue = 0;
    
    plantRequests.forEach(request => {
      const spaceNeeded = request.quantity * request.plant.space_per_plant;
      const totalYield = request.quantity * request.plant.yield_per_plant;
      const yieldPerSqFt = totalYield / spaceNeeded;
      
      // Estimate value (rough market prices)
      const estimatedValue = estimateValue(request.key, totalYield, request.plant.yield_unit);
      
      totalSpaceUsed += spaceNeeded;
      totalYieldValue += estimatedValue;
      
      results.push({
        name: request.plant.name,
        quantity: request.quantity,
        spaceNeeded: spaceNeeded,
        totalYield: totalYield,
        yieldUnit: request.plant.yield_unit,
        yieldPerSqFt: yieldPerSqFt.toFixed(2),
        estimatedValue: estimatedValue,
        daysToMaturity: request.plant.days_to_maturity
      });
    });
    
    // Display results table
    const table = new Table({
      head: ['Plant', 'Qty', 'Space', 'Total Yield', 'Yield/sq ft', 'Est. Value', 'Days'],
      style: { head: ['cyan'] }
    });
    
    results.forEach(result => {
      table.push([
        result.name,
        result.quantity,
        `${result.spaceNeeded} sq ft`,
        `${result.totalYield} ${result.yieldUnit}`,
        `${result.yieldPerSqFt} ${result.yieldUnit}/sq ft`,
        `$${result.estimatedValue.toFixed(2)}`,
        result.daysToMaturity
      ]);
    });
    
    console.log(table.toString());
    
    // Summary
    console.log(chalk.blue('\n📈 Summary:\n'));
    console.log(`${chalk.gray('Total space required:')} ${totalSpaceUsed} sq ft`);
    console.log(`${chalk.gray('Available space:')} ${totalArea} sq ft`);
    console.log(`${chalk.gray('Space utilization:')} ${((totalSpaceUsed / totalArea) * 100).toFixed(1)}%`);
    console.log(`${chalk.gray('Estimated total value:')} $${totalYieldValue.toFixed(2)}`);
    console.log(`${chalk.gray('Value per square foot:')} $${(totalYieldValue / totalSpaceUsed).toFixed(2)}`);
    
    // Space analysis
    if (totalSpaceUsed > totalArea) {
      console.log(chalk.red('\n⚠️  Warning: Requested plants require more space than available!'));
      console.log(chalk.red(`Consider reducing quantities or expanding garden size.`));
      
      // Suggest reductions
      console.log(chalk.yellow('\n💡 Suggested adjustments:'));
      const scaleFactor = totalArea / totalSpaceUsed;
      results.forEach(result => {
        const adjustedQty = Math.floor(result.quantity * scaleFactor);
        if (adjustedQty < result.quantity) {
          console.log(`  • ${result.name}: ${result.quantity} → ${adjustedQty} plants`);
        }
      });
    } else {
      const extraSpace = totalArea - totalSpaceUsed;
      console.log(chalk.green(`\n✅ You have ${extraSpace} sq ft of extra space!`));
      
      // Suggest additional plants
      if (extraSpace >= 4) {
        console.log(chalk.green('\n💡 You could add:'));
        suggestAdditionalPlants(extraSpace, plantsData);
      }
    }
    
    // Harvest timeline
    console.log(chalk.blue('\n🗓️  Harvest Timeline:\n'));
    showHarvestTimeline(results);
    
  } catch (error) {
    console.error(chalk.red('Error calculating yield:'), error.message);
  }
}

function estimateValue(plantKey, yield, unit) {
  // Rough market price estimates (USD per unit)
  const prices = {
    'tomato': { 'lbs': 3.50 },
    'lettuce': { 'heads': 2.00 },
    'carrots': { 'lbs': 1.50 },
    'onion': { 'lbs': 2.00 },
    'beans': { 'lbs': 4.00 },
    'corn': { 'ears': 0.50 },
    'squash': { 'lbs': 2.50 },
    'pepper': { 'peppers': 1.50 },
    'broccoli': { 'heads': 2.50 },
    'radish': { 'lbs': 3.00 },
    'spinach': { 'lbs': 5.00 },
    'cucumber': { 'cucumbers': 1.00 },
    'peas': { 'lbs': 6.00 },
    'kale': { 'lbs': 4.00 },
    'beets': { 'lbs': 2.50 },
    'basil': { 'lbs': 15.00 }
  };
  
  const pricePerUnit = prices[plantKey]?.[unit] || 2.00;
  return yield * pricePerUnit;
}

function suggestAdditionalPlants(extraSpace, plantsData) {
  const suggestions = [
    { key: 'radish', space: 0.25, benefit: 'Quick harvest (25 days)' },
    { key: 'lettuce', space: 1, benefit: 'Continuous harvest' },
    { key: 'basil', space: 1, benefit: 'High value herb' },
    { key: 'spinach', space: 0.5, benefit: 'Nutrient dense' },
    { key: 'carrots', space: 0.25, benefit: 'Good storage crop' }
  ];
  
  suggestions.forEach(suggestion => {
    const maxPlants = Math.floor(extraSpace / suggestion.space);
    if (maxPlants > 0) {
      const plant = plantsData[suggestion.key];
      console.log(`  • ${maxPlants}x ${plant.name} (${suggestion.benefit})`);
    }
  });
}

function showHarvestTimeline(results) {
  // Sort by days to maturity
  const timeline = results.slice().sort((a, b) => a.daysToMaturity - b.daysToMaturity);
  
  const table = new Table({
    head: ['Harvest Order', 'Plant', 'Days to Maturity', 'Peak Harvest'],
    style: { head: ['cyan'] }
  });
  
  timeline.forEach((result, index) => {
    // Estimate peak harvest period (assuming planting starts now)
    const harvestStart = new Date();
    harvestStart.setDate(harvestStart.getDate() + result.daysToMaturity);
    
    const harvestMonth = harvestStart.toLocaleDateString('en-US', { month: 'short' });
    const harvestDay = harvestStart.getDate();
    
    table.push([
      index + 1,
      result.name,
      result.daysToMaturity,
      `${harvestMonth} ${harvestDay}`
    ]);
  });
  
  console.log(table.toString());
}

module.exports = { calculateYield };
