const chalk = require('chalk');
const Table = require('cli-table3');
const { DateTime } = require('luxon');
const { loadPlantData, loadZoneData } = require('../utils/dataLoader');

async function generateCalendar(options) {
  try {
    console.log(chalk.blue('📅 Generating planting calendar...\n'));
    
    const zone = options.zone || '6a';
    const startDate = options['start-date'] || new Date().toISOString().split('T')[0];
    const plantList = options.plants ? options.plants.split(',').map(p => p.trim()) : null;
    
    const plantsData = loadPlantData();
    const zoneData = loadZoneData();
    
    if (!zoneData.zones[zone]) {
      console.log(chalk.red(`❌ Unknown hardiness zone: ${zone}`));
      return;
    }
    
    const zoneInfo = zoneData.zones[zone];
    console.log(chalk.gray(`Hardiness Zone: ${zone}`));
    console.log(chalk.gray(`Growing Season: ${zoneInfo.growing_season} days`));
    console.log(chalk.gray(`Last Frost: ${zoneInfo.last_frost}`));
    console.log(chalk.gray(`First Frost: ${zoneInfo.first_frost}\n`));
    
    // Filter plants if specified
    const targetPlants = plantList ? 
      Object.keys(plantsData).filter(key => plantList.includes(key)) : 
      Object.keys(plantsData);
    
    if (targetPlants.length === 0) {
      console.log(chalk.red('❌ No matching plants found'));
      return;
    }
    
    // Generate calendar entries
    const calendarEntries = [];
    const baseDate = DateTime.fromISO(startDate);
    const lastFrost = DateTime.fromISO(zoneInfo.last_frost);
    const firstFrost = DateTime.fromISO(zoneInfo.first_frost);
    
    targetPlants.forEach(plantKey => {
      const plant = plantsData[plantKey];
      const entry = generatePlantCalendar(plant, plantKey, baseDate, lastFrost, firstFrost, zoneData.planting_adjustments);
      if (entry) {
        calendarEntries.push(entry);
      }
    });
    
    // Sort by planting date
    calendarEntries.sort((a, b) => a.plantDate.toMillis() - b.plantDate.toMillis());
    
    // Display calendar table
    const table = new Table({
      head: ['Plant', 'Plant Date', 'Harvest Start', 'Harvest End', 'Notes'],
      style: { head: ['cyan'] },
      colWidths: [15, 12, 12, 12, 30]
    });
    
    calendarEntries.forEach(entry => {
      table.push([
        entry.name,
        entry.plantDate.toFormat('MMM dd'),
        entry.harvestStart.toFormat('MMM dd'),
        entry.harvestEnd.toFormat('MMM dd'),
        entry.notes || ''
      ]);
    });
    
    console.log(table.toString());
    
    // Monthly view
    console.log(chalk.blue('\n📆 Monthly Planting Schedule:\n'));
    generateMonthlyView(calendarEntries);
    
    // Succession planting suggestions
    console.log(chalk.blue('\n🔄 Succession Planting Suggestions:\n'));
    generateSuccessionSuggestions(calendarEntries, plantsData);
    
  } catch (error) {
    console.error(chalk.red('Error generating calendar:'), error.message);
  }
}

function generatePlantCalendar(plant, plantKey, baseDate, lastFrost, firstFrost, adjustments) {
  try {
    let plantDate;
    
    // Determine planting season
    const season = plant.plant_season || 'spring';
    
    if (season === 'early_spring') {
      plantDate = lastFrost.minus({ weeks: 2 });
    } else if (season === 'spring') {
      plantDate = lastFrost.plus({ weeks: 1 });
    } else if (season === 'late_spring') {
      plantDate = lastFrost.plus({ weeks: 2 });
    } else {
      plantDate = baseDate;
    }
    
    // Calculate harvest dates
    const harvestStart = plantDate.plus({ days: plant.days_to_maturity || 60 });
    const harvestEnd = harvestStart.plus({ days: plant.harvest_duration || 14 });
    
    // Check if harvest extends past first frost
    if (harvestEnd > firstFrost && firstFrost.year === harvestStart.year) {
      // Adjust planting date to finish before frost
      const adjustedPlantDate = firstFrost.minus({ 
        days: (plant.days_to_maturity || 60) + (plant.harvest_duration || 14) 
      });
      
      if (adjustedPlantDate > lastFrost) {
        plantDate = adjustedPlantDate;
      }
    }
    
    return {
      key: plantKey,
      name: plant.name,
      plantDate: plantDate,
      harvestStart: plantDate.plus({ days: plant.days_to_maturity || 60 }),
      harvestEnd: plantDate.plus({ days: (plant.days_to_maturity || 60) + (plant.harvest_duration || 14) }),
      notes: plant.notes
    };
  } catch (error) {
    console.warn(`Warning: Could not generate calendar for ${plant.name}`);
    return null;
  }
}

function generateMonthlyView(entries) {
  const monthlyData = {};
  
  entries.forEach(entry => {
    const month = entry.plantDate.toFormat('MMMM');
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(entry.name);
  });
  
  Object.keys(monthlyData).forEach(month => {
    console.log(chalk.green(`${month}:`));
    monthlyData[month].forEach(plant => {
      console.log(`  • ${plant}`);
    });
    console.log();
  });
}

function generateSuccessionSuggestions(entries, plantsData) {
  const successionCandidates = ['lettuce', 'radish', 'beans', 'carrots', 'spinach'];
  
  entries.forEach(entry => {
    if (successionCandidates.includes(entry.key)) {
      const plant = plantsData[entry.key];
      const nextPlanting = entry.plantDate.plus({ weeks: 2 });
      console.log(`${chalk.yellow('🔄')} ${entry.name}: Plant again on ${nextPlanting.toFormat('MMM dd')} for continuous harvest`);
    }
  });
}

module.exports = { generateCalendar };
