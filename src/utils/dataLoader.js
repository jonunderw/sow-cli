const fs = require('fs');
const path = require('path');

function loadPlantData() {
  try {
    const dataPath = path.join(__dirname, '../../data/plants.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading plant data:', error.message);
    return {};
  }
}

function loadCompanionMatrix() {
  try {
    const dataPath = path.join(__dirname, '../../data/companion-matrix.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading companion matrix:', error.message);
    return { relationships: {}, legend: {}, general_principles: {} };
  }
}

function loadZoneData() {
  try {
    const dataPath = path.join(__dirname, '../../data/zones.json');
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading zone data:', error.message);
    return { zones: {}, planting_adjustments: {} };
  }
}

function getPlantsByCategory(category) {
  const plants = loadPlantData();
  return Object.entries(plants)
    .filter(([key, plant]) => plant.category === category)
    .map(([key, plant]) => ({ key, ...plant }));
}

function findPlantByName(name) {
  const plants = loadPlantData();
  const searchName = name.toLowerCase();
  
  // First try exact key match
  if (plants[searchName]) {
    return { key: searchName, ...plants[searchName] };
  }
  
  // Then try partial name match
  for (const [key, plant] of Object.entries(plants)) {
    if (plant.name.toLowerCase().includes(searchName) || 
        key.includes(searchName)) {
      return { key, ...plant };
    }
  }
  
  return null;
}

function getCompanionRelationship(plant1, plant2) {
  const matrix = loadCompanionMatrix();
  
  // Check both directions
  const relationship1 = matrix.relationships[plant1]?.[plant2];
  const relationship2 = matrix.relationships[plant2]?.[plant1];
  
  // Return the more specific relationship
  if (relationship1) return relationship1;
  if (relationship2) return relationship2;
  
  return 'neutral';
}

function isGoodCompanion(plant1, plant2) {
  const relationship = getCompanionRelationship(plant1, plant2);
  return relationship === 'excellent' || relationship === 'good';
}

function isBadCompanion(plant1, plant2) {
  const relationship = getCompanionRelationship(plant1, plant2);
  return relationship === 'bad' || relationship === 'avoid';
}

function getPlantSpaceRequirement(plantKey, quantity = 1) {
  const plants = loadPlantData();
  const plant = plants[plantKey];
  
  if (!plant) {
    return { error: `Plant '${plantKey}' not found` };
  }
  
  return {
    spacePerPlant: plant.space_per_plant,
    totalSpace: plant.space_per_plant * quantity,
    quantity: quantity
  };
}

function calculateOptimalSpacing(plants) {
  // Simple algorithm to suggest optimal spacing
  const suggestions = [];
  
  plants.forEach(plant => {
    const space = plant.space_per_plant;
    let gridSize;
    
    if (space <= 0.5) {
      gridSize = '4 inches apart';
    } else if (space <= 1) {
      gridSize = '12 inches apart';
    } else if (space <= 2) {
      gridSize = '18 inches apart';
    } else if (space <= 4) {
      gridSize = '2 feet apart';
    } else {
      gridSize = '3+ feet apart';
    }
    
    suggestions.push({
      plant: plant.name,
      spacing: gridSize,
      note: space > 4 ? 'Requires significant space' : null
    });
  });
  
  return suggestions;
}

module.exports = {
  loadPlantData,
  loadCompanionMatrix,
  loadZoneData,
  getPlantsByCategory,
  findPlantByName,
  getCompanionRelationship,
  isGoodCompanion,
  isBadCompanion,
  getPlantSpaceRequirement,
  calculateOptimalSpacing
};
