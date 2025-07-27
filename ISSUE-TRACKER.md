# Issue Tracker & Todo List

## 🐛 Known Issues

### High Priority
- [ ] **Canvas dependency fails on some systems** - PNG visualization requires system dependencies (pkg-config, pixman) that aren't always available
- [ ] **Garden size parameter ignored** - The `--width` and `--height` parameters don't properly override the default 10x10 grid in plan command
- [ ] **Plant placement algorithm could be improved** - Sometimes creates suboptimal layouts, especially with larger plants

### Medium Priority
- [ ] **Hardcoded sample garden in visualize** - Currently uses a fixed sample layout instead of using actual planned garden data
- [ ] **Limited error handling for invalid plant names** - Should provide suggestions for misspelled plant names
- [ ] **No validation for garden dimensions** - Should check for reasonable garden sizes (min/max limits)

### Low Priority
- [ ] **ASCII visualization spacing issues** - Some terminal emulators may not display the grid properly
- [ ] **Date calculations assume current year** - Calendar generation doesn't handle multi-year planning
- [ ] **No persistence** - Garden plans aren't saved between sessions

## 🚀 Feature Requests & Enhancements

### Garden Planning
- [ ] **Import/Export garden plans** - Save and load garden configurations as JSON/YAML files
- [ ] **Multi-season planning** - Plan crop rotations and succession planting automatically
- [ ] **Companion planting scoring** - Show numeric scores for plant compatibility
- [ ] **Path and walkway planning** - Add support for garden paths and access routes
- [ ] **Raised bed support** - Plan multiple separate garden beds
- [ ] **3D visualization** - Add height dimension for trellises and vertical growing

### Plant Database
- [ ] **Add more plants** - Expand from 16 to 50+ plants (herbs, flowers, perennials)
- [ ] **Regional variety support** - Different cultivars for different climate zones
- [ ] **Pest and disease information** - Add common problems and organic solutions
- [ ] **Nutritional information** - Include vitamin/mineral content for harvest planning
- [ ] **Water requirements** - Add irrigation planning features

### Calendar & Timing
- [ ] **Frost date API integration** - Auto-lookup last/first frost dates by ZIP code
- [ ] **Moon phase planting** - Optional biodynamic planting calendar
- [ ] **Harvest window optimization** - Stagger plantings for continuous harvest
- [ ] **Regional planting guides** - State/province specific recommendations

### Visualization & Output
- [ ] **PDF export** - Generate printable garden plans
- [ ] **SVG output** - Vector graphics for scalable prints
- [ ] **Smartphone-friendly HTML** - Mobile-responsive garden plans
- [ ] **QR codes** - Link to plant care instructions
- [ ] **Photo integration** - Add plant photos to visualizations

### User Experience
- [ ] **Configuration wizard** - First-time setup for location, preferences
- [ ] **Garden templates** - Pre-made plans for common garden types
- [ ] **Interactive web interface** - Drag-and-drop garden designer
- [ ] **Progress tracking** - Mark plants as planted, harvested, etc.
- [ ] **Reminder system** - Notifications for planting and harvest times

### Technical Improvements
- [ ] **Unit tests** - Add comprehensive test coverage
- [ ] **Input validation** - Better error messages and input sanitization
- [ ] **Performance optimization** - Handle very large gardens efficiently
- [ ] **Plugin system** - Allow third-party plant data and algorithms
- [ ] **Docker support** - Containerized deployment option

## 🔧 Code Quality Issues

### Architecture
- [ ] **Separate data from logic** - Move plant algorithms to separate modules
- [ ] **Config file support** - Use cosmiconfig for flexible configuration
- [ ] **Better error classes** - Custom error types for different failure modes
- [ ] **Logging system** - Add debug/verbose output options

### Dependencies
- [ ] **Reduce bundle size** - Consider lighter alternatives to some packages
- [ ] **Update to ESM** - Migrate from CommonJS to ES modules
- [ ] **Optional canvas** - Make PNG generation truly optional without warnings

### Documentation
- [ ] **API documentation** - Document internal functions for contributors
- [ ] **Video tutorials** - Create walkthrough videos for complex features
- [ ] **FAQ section** - Common questions and troubleshooting

## 🐛 Bug Reports

### Visualization Issues
- **Issue**: HTML visualization grid placement - Some plants may overlap in edge cases
- **Steps to reproduce**: Create garden with plants that extend beyond boundaries
- **Expected**: Plants should be clipped or repositioned
- **Actual**: Plants may render outside grid bounds

### Calendar Issues  
- **Issue**: Zone data uses hardcoded 2025 dates
- **Impact**: Calendar will be incorrect in 2026+
- **Fix needed**: Calculate relative to current year

### Planning Algorithm Issues
- **Issue**: Large plants (squash) don't respect companion plant distances
- **Impact**: Poor companion plant optimization
- **Fix needed**: Improve spatial relationship scoring

## 💡 User Feedback

### Requested Features (add your own!)
- [ ] **Greenhouse mode** - Indoor growing calculations
- [ ] **Hydroponics support** - Soil-less growing options
- [ ] **Economic analysis** - Cost vs. value calculations
- [ ] **Seed starting calendar** - When to start seeds indoors

### Usability Improvements
- [ ] **Better help text** - More detailed command explanations
- [ ] **Example library** - Pre-built garden examples for inspiration
- [ ] **Seasonal reminders** - What to do each month in the garden

## 📝 Contributing Notes

If you want to contribute:
1. Pick an issue from this list
2. Create a branch: `git checkout -b fix/issue-description`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Easy First Issues (good for beginners)
- [ ] Add more plants to the database
- [ ] Improve error messages
- [ ] Add more plant varieties
- [ ] Fix typos in documentation
- [ ] Add more example configurations

### Advanced Issues (for experienced developers)
- [ ] Implement PNG generation with proper canvas setup
- [ ] Optimize the garden planning algorithm
- [ ] Add web interface
- [ ] Create plugin system

---

**Last Updated**: July 27, 2025
**Contributors**: Add your name when you work on issues!
