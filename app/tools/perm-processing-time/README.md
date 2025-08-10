# PERM Processing Time Tracker

A comprehensive tool for tracking PERM (Program Electronic Review Management) application processing times with real-time DOL data integration.

## Features

### 🔄 Real-time Processing Data

- **Current Processing Times**: Get the latest PERM processing times directly from DOL data
- **Priority Date Tracking**: Monitor which submission dates are currently being processed
- **Queue Length Analysis**: View total cases pending review by month
- **Automatic Data Updates**: Fetches latest data from the DOL website

### 👤 Personal Case Tracking

- **Multi-Case Management**: Track multiple PERM applications simultaneously
- **OEWS Classification**: Distinguish between OEWS and Non-OEWS applications
- **Processing Estimates**: Get personalized completion time estimates
- **Queue Position**: Calculate your position in the processing queue
- **Case Types**: Support for Analyst Review, Audit Review, and Reconsideration cases

### 📊 Historical Trend Analysis

- **Interactive Charts**: Visualize processing time trends over months and years
- **Trend Direction**: Identify if processing times are improving or worsening
- **Pattern Recognition**: Understand seasonal and cyclical processing patterns
- **Future Predictions**: Get insights into projected processing time changes

### 🔒 Privacy & Security

- **Local Storage**: All case data is stored locally in your browser
- **No Server Storage**: Your immigration information never leaves your device
- **Privacy First**: Complete control over your personal data

## Architecture

### File Structure

```
app/tools/perm-processing-time/
├── types/
│   └── index.ts                 # TypeScript type definitions
├── utils/
│   └── permDataParser.ts        # Data parsing and calculation utilities
├── hooks/
│   └── usePERMTracker.ts        # Main state management hook
├── components/
│   ├── CurrentDataPanel.tsx     # Real-time DOL data display
│   ├── CaseTracker.tsx          # Personal case management
│   └── HistoricalChart.tsx      # Trend visualization
├── layout.tsx                   # SEO metadata and structured data
├── page.tsx                     # Main application component
└── README.md                    # This documentation
```

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **Data Storage**: Browser localStorage
- **Charts**: Custom SVG-based visualizations
- **Styling**: Tailwind CSS with custom gradients and animations

## Usage

### Getting Started

1. **View Current Data**: Check the latest PERM processing times and queue information
2. **Add Your Cases**: Enter your PERM submission details to get personalized estimates
3. **Monitor Trends**: Analyze historical processing time patterns

### Adding a Case

1. Click "Add Case" button
2. Enter submission date
3. Select case type (Analyst Review, Audit Review, or Reconsideration)
4. Specify OEWS classification
5. Get instant processing estimates and queue position

### Understanding Estimates

- **Optimistic**: Best-case scenario based on recent improvements
- **Realistic**: Most likely timeline based on current data
- **Pessimistic**: Conservative estimate accounting for potential delays

## Data Sources & Technical Implementation

The tool uses official data from the Department of Labor's Foreign Labor Certification office:

- **Primary Source**: https://flag.dol.gov/processingtimes
- **Update Frequency**: Monthly (first work week of each month)
- **Data Points**: Processing times, priority dates, queue lengths, case counts
- **Real-time Integration**: Custom API endpoint with automated HTML parsing
- **Fallback System**: Local mock data for reliability during DOL website issues
- **Data Validation**: Comprehensive error handling and data structure validation
- **Auto-refresh**: Automatic updates when data becomes stale (6+ hours old)

### API Integration Details

- **Endpoint**: `/api/perm-data` (Next.js API route)
- **Method**: Server-side scraping using Cheerio for HTML parsing
- **Caching**: Client-side local storage with intelligent refresh logic
- **Error Handling**: Graceful degradation with fallback data
- **Data Freshness**: Visual indicators showing data age and status

## Key Metrics Explained

### Processing Time Categories

- **Analyst Review**: Standard PERM application review process
- **Audit Review**: Additional review for selected applications
- **Reconsideration**: Appeals and re-evaluation requests

### Queue Position Calculation

- Based on submission date relative to current priority date
- Accounts for total cases ahead in the queue
- Provides percentile ranking among all pending cases

### OEWS vs Non-OEWS

- **OEWS**: Uses Occupational Employment Wage Statistics (typically faster)
- **Non-OEWS**: Requires custom wage surveys (typically slower)
- **Processing Difference**: OEWS cases average 60 days faster

## Performance Optimizations

- **Lazy Loading**: Components load only when needed
- **Memoization**: Expensive calculations are cached
- **Local Storage**: Reduces API calls and improves responsiveness
- **Efficient Re-renders**: Optimized React hook dependencies

## Future Enhancements

### Planned Features

- [ ] Email notification system
- [ ] Export case data to PDF/CSV
- [ ] Advanced filtering and search
- [ ] Comparison with historical averages
- [ ] Mobile app version
- [ ] API integration for automatic updates

### Technical Improvements

- [ ] Progressive Web App (PWA) support
- [ ] Offline functionality
- [ ] Advanced caching strategies
- [ ] Real-time websocket updates
- [ ] Enhanced data visualization

## SEO Optimization

The tool is optimized for search engines with:

- **Structured Data**: JSON-LD markup for rich snippets
- **Meta Tags**: Comprehensive OpenGraph and Twitter Card data
- **Keywords**: Targeted immigration and PERM-related terms
- **Content**: Educational and helpful content for users
- **Performance**: Fast loading times and mobile optimization

## Contributing

To contribute to this tool:

1. Follow the existing code structure and patterns
2. Maintain TypeScript strict mode compliance
3. Use Tailwind CSS for styling consistency
4. Add comprehensive JSDoc comments
5. Test with real-world PERM data scenarios

## License

This tool is part of the GeeksKai toolbox and follows the same licensing terms as the main project.
