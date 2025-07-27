const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

async function visualizeGarden(options) {
  try {
    console.log(chalk.blue('🎨 Generating garden visualization...\n'));
    
    const format = options.format || 'ascii';
    const outputFile = options.output;
    
    // For now, create a sample garden layout
    // In a real implementation, this would use data from the planner
    const sampleGarden = createSampleGarden();
    
    let output;
    
    switch (format) {
      case 'ascii':
        output = generateAsciiVisualization(sampleGarden);
        break;
      case 'html':
        output = generateHtmlVisualization(sampleGarden);
        break;
      case 'png':
        output = await generatePngVisualization(sampleGarden);
        break;
      default:
        console.log(chalk.red(`❌ Unsupported format: ${format}`));
        return;
    }
    
    if (outputFile) {
      // Save to file
      if (format === 'png') {
        // PNG output is binary
        fs.writeFileSync(outputFile, output);
      } else {
        fs.writeFileSync(outputFile, output, 'utf8');
      }
      console.log(chalk.green(`✅ Visualization saved to ${outputFile}`));
    } else {
      // Display to console (ASCII only)
      if (format === 'ascii') {
        console.log(output);
      } else {
        console.log(chalk.yellow('⚠️  Non-ASCII output requires a file path (-o option)'));
      }
    }
    
  } catch (error) {
    console.error(chalk.red('Error generating visualization:'), error.message);
  }
}

function createSampleGarden() {
  // Create a 10x10 sample garden
  const garden = {
    width: 10,
    height: 10,
    plants: [
      { x: 1, y: 1, width: 2, height: 2, type: 'tomato', name: 'Tomatoes' },
      { x: 4, y: 1, width: 1, height: 1, type: 'basil', name: 'Basil' },
      { x: 6, y: 1, width: 3, height: 1, type: 'lettuce', name: 'Lettuce' },
      { x: 1, y: 4, width: 1, height: 4, type: 'carrots', name: 'Carrots' },
      { x: 3, y: 4, width: 2, height: 2, type: 'onion', name: 'Onions' },
      { x: 6, y: 3, width: 2, height: 3, type: 'beans', name: 'Green Beans' },
      { x: 1, y: 9, width: 3, height: 1, type: 'radish', name: 'Radishes' },
      { x: 5, y: 7, width: 4, height: 2, type: 'squash', name: 'Summer Squash' }
    ]
  };
  
  return garden;
}

function generateAsciiVisualization(garden) {
  const { width, height, plants } = garden;
  
  // Create empty grid
  const grid = Array(height).fill().map(() => Array(width).fill('⬜'));
  
  // Plant symbols
  const symbols = {
    'tomato': '🍅',
    'basil': '🌿',
    'lettuce': '🥬',
    'carrots': '🥕',
    'onion': '🧅',
    'beans': '🫘',
    'corn': '🌽',
    'squash': '🎃',
    'pepper': '🌶️',
    'broccoli': '🥦',
    'radish': '🟣',
    'spinach': '🍃',
    'cucumber': '🥒',
    'peas': '🟢',
    'kale': '🥬',
    'beets': '🟤'
  };
  
  // Place plants on grid
  plants.forEach(plant => {
    const symbol = symbols[plant.type] || '🌱';
    for (let y = plant.y; y < plant.y + plant.height; y++) {
      for (let x = plant.x; x < plant.x + plant.width; x++) {
        if (y < height && x < width) {
          grid[y][x] = symbol;
        }
      }
    }
  });
  
  let output = chalk.blue('🏡 Garden Layout Visualization\n\n');
  
  // Top border with coordinates
  output += '  ';
  for (let x = 0; x < width; x++) {
    output += `${x % 10} `;
  }
  output += '\n';
  
  // Grid rows
  for (let y = 0; y < height; y++) {
    output += `${y % 10} `;
    for (let x = 0; x < width; x++) {
      output += `${grid[y][x]} `;
    }
    output += '\n';
  }
  
  // Legend
  output += '\n' + chalk.cyan('🔧 Legend:\n');
  const usedTypes = new Set(plants.map(p => p.type));
  usedTypes.forEach(type => {
    const symbol = symbols[type] || '🌱';
    const plant = plants.find(p => p.type === type);
    output += `${symbol} ${plant.name}\n`;
  });
  
  // Statistics
  output += '\n' + chalk.gray('📊 Garden Statistics:\n');
  output += chalk.gray(`Size: ${width}x${height} feet (${width * height} sq ft)\n`);
  output += chalk.gray(`Plants: ${plants.length} different types\n`);
  
  const totalPlantArea = plants.reduce((sum, plant) => sum + (plant.width * plant.height), 0);
  const utilization = ((totalPlantArea / (width * height)) * 100).toFixed(1);
  output += chalk.gray(`Space utilization: ${utilization}%\n`);
  
  return output;
}

function generateHtmlVisualization(garden) {
  const { width, height, plants } = garden;
  
  const colors = {
    'tomato': '#ff6b6b',
    'basil': '#51cf66',
    'lettuce': '#69db7c',
    'carrots': '#ff8787',
    'onion': '#ffd43b',
    'beans': '#8ce99a',
    'corn': '#ffe066',
    'squash': '#ffb366',
    'pepper': '#ff6b6b',
    'broccoli': '#51cf66',
    'radish': '#d670d6',
    'spinach': '#69db7c',
    'cucumber': '#8ce99a',
    'peas': '#8ce99a',
    'kale': '#51cf66',
    'beets': '#9775fa'
  };
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Garden Layout Visualization</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            background-color: #f0f8f0;
        }
        .garden-container { 
            display: grid; 
            grid-template-columns: repeat(${width}, 40px);
            grid-template-rows: repeat(${height}, 40px);
            gap: 2px; 
            border: 3px solid #8B4513;
            padding: 10px;
            background-color: #D2B48C;
            margin: 20px 0;
        }
        .garden-cell { 
            width: 40px; 
            height: 40px; 
            background-color: #8FBC8F;
            border: 1px solid #556B2F;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        .legend { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 15px; 
            margin: 20px 0;
        }
        .legend-item { 
            display: flex; 
            align-items: center; 
            gap: 8px;
            padding: 5px 10px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .legend-color { 
            width: 20px; 
            height: 20px; 
            border-radius: 3px;
        }
        .title { 
            color: #2d5016; 
            text-align: center; 
            margin-bottom: 20px;
        }
        .stats {
            background-color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <h1 class="title">🌱 Garden Layout Visualization</h1>
    
    <div class="garden-container">`;
  
  // Create grid
  const grid = Array(height).fill().map(() => Array(width).fill(null));
  
  // Place plants
  plants.forEach(plant => {
    for (let y = plant.y; y < plant.y + plant.height; y++) {
      for (let x = plant.x; x < plant.x + plant.width; x++) {
        if (y < height && x < width) {
          grid[y][x] = plant;
        }
      }
    }
  });
  
  // Generate grid HTML
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const plant = grid[y][x];
      const backgroundColor = plant ? colors[plant.type] || '#8FBC8F' : '#8FBC8F';
      const content = plant ? plant.name.substring(0, 2) : '';
      
      html += `
        <div class="garden-cell" style="background-color: ${backgroundColor};" title="${plant ? plant.name : 'Empty'}">
          ${content}
        </div>`;
    }
  }
  
  html += `
    </div>
    
    <div class="legend">
        <h3>Legend:</h3>`;
  
  const usedTypes = new Set(plants.map(p => p.type));
  usedTypes.forEach(type => {
    const plant = plants.find(p => p.type === type);
    const color = colors[type] || '#8FBC8F';
    html += `
        <div class="legend-item">
            <div class="legend-color" style="background-color: ${color};"></div>
            <span>${plant.name}</span>
        </div>`;
  });
  
  const totalPlantArea = plants.reduce((sum, plant) => sum + (plant.width * plant.height), 0);
  const utilization = ((totalPlantArea / (width * height)) * 100).toFixed(1);
  
  html += `
    </div>
    
    <div class="stats">
        <h3>📊 Garden Statistics</h3>
        <p><strong>Size:</strong> ${width}×${height} feet (${width * height} sq ft)</p>
        <p><strong>Plant varieties:</strong> ${plants.length}</p>
        <p><strong>Space utilization:</strong> ${utilization}%</p>
    </div>
    
</body>
</html>`;
  
  return html;
}

async function generatePngVisualization(garden) {
  // This would require the canvas library
  // For now, return a placeholder
  console.log(chalk.yellow('🔧 PNG generation requires canvas library setup'));
  console.log(chalk.gray('Run: npm install canvas'));
  console.log(chalk.gray('Note: Canvas may require additional system dependencies'));
  
  return Buffer.from('PNG generation not implemented yet', 'utf8');
}

module.exports = { visualizeGarden };
