const { loadPlantData, loadCompanionMatrix, getCompanionRelationship } = require('./utils/dataLoader');

class GardenPlanner {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = Array(height).fill().map(() => Array(width).fill(null));
    this.plantData = loadPlantData();
    this.companionMatrix = loadCompanionMatrix();
  }

  async planGarden(plantList) {
    try {
      // Validate and prepare plant requests
      const plantRequests = this.preparePlantRequests(plantList);
      
      if (plantRequests.length === 0) {
        return {
          success: false,
          error: 'No valid plants found in the request'
        };
      }

      // Calculate total space needed
      const totalSpaceNeeded = plantRequests.reduce((sum, req) => sum + req.totalSpace, 0);
      const availableSpace = this.width * this.height;

      if (totalSpaceNeeded > availableSpace) {
        return {
          success: false,
          error: `Not enough space. Need ${totalSpaceNeeded} sq ft, have ${availableSpace} sq ft`
        };
      }

      // Sort plants by space requirements (largest first)
      plantRequests.sort((a, b) => b.spacePerPlant - a.spacePerPlant);

      // Place plants using companion-aware algorithm
      const placementResult = this.placePlantsWithCompanions(plantRequests);
      
      if (!placementResult.success) {
        return placementResult;
      }

      // Generate summary
      const plantSummary = this.generatePlantSummary(plantRequests);
      const warnings = this.checkCompanionWarnings();

      return {
        success: true,
        grid: this.grid,
        plantSummary: plantSummary,
        warnings: warnings,
        spaceUtilization: (totalSpaceNeeded / availableSpace * 100).toFixed(1)
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  preparePlantRequests(plantList) {
    const requests = [];

    plantList.forEach(plantKey => {
      const key = plantKey.toLowerCase().trim();
      const plant = this.plantData[key];
      
      if (!plant) {
        console.warn(`Warning: Plant '${plantKey}' not found`);
        return;
      }

      // Default quantities based on plant type and space
      let defaultQuantity;
      if (plant.space_per_plant >= 4) {
        defaultQuantity = 2; // Large plants
      } else if (plant.space_per_plant >= 1) {
        defaultQuantity = 4; // Medium plants
      } else {
        defaultQuantity = 8; // Small plants
      }

      requests.push({
        key: key,
        plant: plant,
        quantity: defaultQuantity,
        spacePerPlant: plant.space_per_plant,
        totalSpace: plant.space_per_plant * defaultQuantity,
        placed: 0
      });
    });

    return requests;
  }

  placePlantsWithCompanions(plantRequests) {
    // Strategy: Place plants in zones, considering companions
    const zones = this.createGardenZones();
    
    for (const request of plantRequests) {
      let placed = 0;
      
      while (placed < request.quantity) {
        const position = this.findBestPosition(request, zones, placed);
        
        if (!position) {
          // Try to place remaining plants anywhere
          const fallbackPosition = this.findAnyPosition(request.spacePerPlant);
          if (!fallbackPosition) {
            console.warn(`Could only place ${placed}/${request.quantity} ${request.plant.name}`);
            break;
          }
          position = fallbackPosition;
        }

        // Place the plant
        this.placePlantAt(request.key, position, request.spacePerPlant);
        placed++;
      }
      
      request.placed = placed;
    }

    return { success: true };
  }

  createGardenZones() {
    // Divide garden into zones for better organization
    const zoneWidth = Math.ceil(this.width / 3);
    const zoneHeight = Math.ceil(this.height / 3);
    
    const zones = [];
    for (let zy = 0; zy < 3; zy++) {
      for (let zx = 0; zx < 3; zx++) {
        zones.push({
          startX: zx * zoneWidth,
          startY: zy * zoneHeight,
          endX: Math.min((zx + 1) * zoneWidth, this.width),
          endY: Math.min((zy + 1) * zoneHeight, this.height),
          plants: new Set()
        });
      }
    }
    
    return zones;
  }

  findBestPosition(request, zones, placedCount) {
    const plant = request.plant;
    const spaceNeeded = request.spacePerPlant;
    const gridSize = Math.ceil(Math.sqrt(spaceNeeded));

    // Score each possible position
    let bestPosition = null;
    let bestScore = -1;

    for (let y = 0; y <= this.height - gridSize; y++) {
      for (let x = 0; x <= this.width - gridSize; x++) {
        if (this.canPlaceAt(x, y, gridSize)) {
          const score = this.calculatePositionScore(x, y, gridSize, request.key);
          if (score > bestScore) {
            bestScore = score;
            bestPosition = { x, y, size: gridSize };
          }
        }
      }
    }

    return bestPosition;
  }

  calculatePositionScore(x, y, size, plantKey) {
    let score = 0;
    
    // Check surrounding plants for companion benefits/penalties
    for (let dy = -1; dy <= size; dy++) {
      for (let dx = -1; dx <= size; dx++) {
        const checkX = x + dx;
        const checkY = y + dy;
        
        if (checkX >= 0 && checkX < this.width && 
            checkY >= 0 && checkY < this.height &&
            this.grid[checkY][checkX]) {
          
          const neighborPlant = this.grid[checkY][checkX];
          const relationship = getCompanionRelationship(plantKey, neighborPlant);
          
          switch (relationship) {
            case 'excellent':
              score += 10;
              break;
            case 'good':
              score += 5;
              break;
            case 'neutral':
              score += 0;
              break;
            case 'avoid':
              score -= 5;
              break;
            case 'bad':
              score -= 15;
              break;
          }
        }
      }
    }
    
    // Prefer center positions slightly
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const distanceFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    score += Math.max(0, 5 - distanceFromCenter);
    
    return score;
  }

  findAnyPosition(spaceNeeded) {
    const gridSize = Math.ceil(Math.sqrt(spaceNeeded));
    
    for (let y = 0; y <= this.height - gridSize; y++) {
      for (let x = 0; x <= this.width - gridSize; x++) {
        if (this.canPlaceAt(x, y, gridSize)) {
          return { x, y, size: gridSize };
        }
      }
    }
    
    return null;
  }

  canPlaceAt(x, y, size) {
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        if (x + dx >= this.width || y + dy >= this.height ||
            this.grid[y + dy][x + dx] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  placePlantAt(plantKey, position, spaceNeeded) {
    const { x, y, size } = position;
    
    for (let dy = 0; dy < size; dy++) {
      for (let dx = 0; dx < size; dx++) {
        if (x + dx < this.width && y + dy < this.height) {
          this.grid[y + dy][x + dx] = plantKey;
        }
      }
    }
  }

  generatePlantSummary(plantRequests) {
    return plantRequests.map(request => ({
      name: request.plant.name,
      quantity: request.placed,
      spaceUsed: request.spacePerPlant * request.placed,
      expectedYield: (request.plant.yield_per_plant * request.placed).toFixed(1),
      yieldUnit: request.plant.yield_unit
    }));
  }

  checkCompanionWarnings() {
    const warnings = [];
    const plantPositions = new Map();
    
    // Map plant positions
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const plant = this.grid[y][x];
        if (plant) {
          if (!plantPositions.has(plant)) {
            plantPositions.set(plant, []);
          }
          plantPositions.get(plant).push({ x, y });
        }
      }
    }
    
    // Check for bad companion adjacencies
    const checkedPairs = new Set();
    
    for (const [plant1, positions1] of plantPositions) {
      for (const [plant2, positions2] of plantPositions) {
        if (plant1 !== plant2) {
          const pairKey = [plant1, plant2].sort().join('-');
          if (checkedPairs.has(pairKey)) continue;
          checkedPairs.add(pairKey);
          
          const relationship = getCompanionRelationship(plant1, plant2);
          if (relationship === 'bad' || relationship === 'avoid') {
            // Check if they're adjacent
            let areAdjacent = false;
            for (const pos1 of positions1) {
              for (const pos2 of positions2) {
                const distance = Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
                if (distance === 1) {
                  areAdjacent = true;
                  break;
                }
              }
              if (areAdjacent) break;
            }
            
            if (areAdjacent) {
              const plant1Name = this.plantData[plant1]?.name || plant1;
              const plant2Name = this.plantData[plant2]?.name || plant2;
              warnings.push(`${plant1Name} and ${plant2Name} should not be planted adjacent to each other`);
            }
          }
        }
      }
    }
    
    return warnings;
  }
}

module.exports = { GardenPlanner };
