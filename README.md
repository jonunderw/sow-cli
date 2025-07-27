# Sow CLI - Garden Planning Tool 🌱

A comprehensive Node.js CLI application for garden planning that helps you optimize your garden layout with companion planting, yield estimation, and planting calendars.

## Features

- 🌿 **Garden Layout Planning** - Visual grid-based garden plotting
- 🤝 **Companion Planting** - Smart plant pairing based on companion planting principles
- 📊 **Yield Estimation** - Calculate expected harvest yields
- 📅 **Planting Calendar** - Generate planting and harvesting schedules
- 🎨 **Visual Output** - ASCII grid visualization and optional image export
- 📋 **Multiple Output Formats** - CLI tables, ASCII art, and exportable formats

## Installation

```bash
npm install -g sow-cli
```

Or run locally:

```bash
git clone <repository-url>
cd sow-cli
npm install
npm start
```

## Quick Start

```bash
git clone <repository-url>
cd sow-cli
npm install
npm start
```

## Usage Examples

### Interactive Mode
```bash
npm start
# or
node index.js
```

### Plan a Garden
```bash
# Basic garden planning
node index.js plan --plants "tomato,basil,lettuce"

# Specify garden size
node index.js plan --plants "tomato,basil,lettuce,carrots" --width 8 --height 8

# Quick demo
npm run demo
```

### Generate Planting Calendar
```bash
# For your hardiness zone
node index.js calendar --zone 6a

# Specific plants and date
node index.js calendar --zone 6a --plants "tomato,lettuce" --start-date 2025-03-01
```

### View Companion Plants
```bash
# For a specific plant
node index.js companions --plant tomato

# General companion principles
node index.js companions
```

### Calculate Yields
```bash
# With plant quantities
node index.js yield --plants "tomato:4,lettuce:8,basil:2" --area 100
```

### Create Visualizations
```bash
# ASCII output
node index.js visualize --format ascii

# HTML file
node index.js visualize --format html --output my-garden.html

# PNG image (requires canvas setup)
node index.js visualize --format png --output my-garden.png
```

## Commands

- `sow plan` - Interactive garden planning
- `sow calendar` - Generate planting calendar
- `sow companions` - View companion planting information
- `sow yield` - Calculate yield estimates
- `sow visualize` - Generate garden layout visualization

## Garden Data

The application includes comprehensive data on:
- 50+ common garden plants
- Companion planting relationships
- Yield estimates per square foot
- Planting and harvesting timeframes
- Space requirements

## Configuration

Create a `garden.config.json` file in your project directory to save your garden preferences:

```json
{
  "gardenSize": { "width": 10, "height": 10 },
  "hardinessZone": "6a",
  "preferredPlants": ["tomato", "basil", "lettuce"],
  "constraints": []
}
```

## Examples

### Plan a 10x10 garden with tomatoes, basil, and lettuce:
```bash
sow plan --plants "tomato,basil,lettuce" --size 10x10
```

### Generate a calendar for zone 6a:
```bash
sow calendar --zone 6a --start-date 2025-03-01
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Companion planting data sourced from agricultural research
- Plant yield data from USDA and agricultural extension services
- Hardiness zone information from USDA Plant Hardiness Zone Map
