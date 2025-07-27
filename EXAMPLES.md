# Sow CLI Examples

## Basic Commands

### 1. Interactive Mode
```bash
npm start
```
This starts the interactive menu where you can explore all features.

### 2. Plan a Small Herb Garden (4x4 feet)
```bash
node index.js plan --plants "basil,oregano,parsley,thyme" --width 4 --height 4
```

### 3. Plan a Salad Garden (6x6 feet)  
```bash
node index.js plan --plants "lettuce,spinach,radish,carrots" --width 6 --height 6
```

### 4. Plan a Family Vegetable Garden (10x10 feet)
```bash
node index.js plan --plants "tomato,pepper,onion,beans,squash,lettuce" --width 10 --height 10
```

### 5. Three Sisters Garden (traditional Native American companion planting)
```bash
node index.js plan --plants "corn,beans,squash" --width 8 --height 8
```

## Calendar Examples

### Generate Spring Planting Schedule for Zone 6a
```bash
node index.js calendar --zone 6a --start-date 2025-03-01
```

### Summer Planting Schedule for Zone 7b
```bash
node index.js calendar --zone 7b --plants "lettuce,spinach,radish" --start-date 2025-08-01
```

## Companion Plant Research

### Find Good Companions for Tomatoes
```bash
node index.js companions --plant tomato
```

### Research Companion Plants for Peppers
```bash
node index.js companions --plant pepper
```

### View General Companion Planting Principles
```bash
node index.js companions
```

## Yield Planning

### Calculate Yields for a Small Garden
```bash
node index.js yield --plants "tomato:2,lettuce:4,basil:1" --area 50
```

### Plan Production for a Large Garden
```bash
node index.js yield --plants "tomato:8,pepper:4,beans:12,lettuce:16" --area 200
```

## Advanced Usage

### Create Visual Garden Plan
```bash
# Generate ASCII layout
node index.js visualize --format ascii

# Create HTML webpage
node index.js visualize --format html --output my-garden-plan.html

# Generate printable PNG (requires canvas setup)
node index.js visualize --format png --output garden-layout.png
```

### Chain Commands for Complete Planning
```bash
# Plan the garden
node index.js plan --plants "tomato,basil,lettuce,carrots" --width 8 --height 8

# Check companion relationships
node index.js companions --plant tomato

# Generate planting calendar
node index.js calendar --zone 6a --plants "tomato,basil,lettuce,carrots"

# Calculate expected yields
node index.js yield --plants "tomato:2,basil:4,lettuce:4,carrots:8" --area 64

# Create visual output
node index.js visualize --format html --output my-complete-garden-plan.html
```

## Tips

1. **Start Small**: Begin with a 4x4 or 6x6 garden if you're new to gardening
2. **Check Your Zone**: Use [USDA Hardiness Zone Map](https://planthardiness.ars.usda.gov/) to find your zone
3. **Consider Succession Planting**: The calendar command suggests when to replant crops like lettuce
4. **Use Companion Planting**: Check companion relationships before finalizing your plan
5. **Plan for Continuous Harvest**: Mix quick-growing crops (radish, lettuce) with longer-season crops (tomato, peppers)
