# GBP ↔ NOK Currency Converter

A professional real-time currency converter for British Pounds (GBP) and Norwegian Krone (NOK) with live exchange rates.

## Features

- **Real-time Exchange Rates**: Live rates from Open Exchange Rates API
- **Bidirectional Conversion**: Convert GBP to NOK or NOK to GBP
- **Professional UI**: Modern glassmorphism design with animations
- **Quick Reference**: Common conversion amounts table
- **Educational Content**: Currency information and market factors
- **Mobile Responsive**: Optimized for all devices
- **SEO Optimized**: Comprehensive metadata and structured data

## API Integration

This converter uses the [Open Exchange Rates API](https://openexchangerates.org/) for accurate, real-time currency conversion.

### API Configuration

1. **Get API Key**: Sign up at [Open Exchange Rates](https://openexchangerates.org/signup/free)

   - Free plan: 1,000 requests/month
   - Paid plans available for higher usage

2. **Environment Setup**:

   ```bash
   # Add to your .env.local file
   OPEN_EXCHANGE_RATES_API_KEY=your_api_key_here
   ```

3. **API Endpoint Used** (Free Plan):

   ```
   # Open Exchange Rates Free Plan (USD base only)
   GET https://openexchangerates.org/api/latest.json?app_id={api_key}
   ```

4. **Rate Calculation Method**:
   - **USD Cross-Rate**: Uses USD as base currency to calculate GBP ↔ NOK rates
   - **Formula**: GBP/NOK = (USD/NOK) ÷ (USD/GBP)
   - **Example**: 10.04675 ÷ 0.740302 = 13.5717 NOK per GBP
   - **Fallback APIs**: Uses exchangerate.host and static rates as backups

### Intelligent Fallback Strategy

The converter uses a multi-tier fallback approach for maximum reliability:

1. **USD Cross-Rate**: Primary method using Open Exchange Rates free plan
2. **exchangerate.host**: Free, reliable alternative API
3. **Static Cached Rates**: Approximate values for basic functionality

## Technical Implementation

### API Route: `/api/exchange-rate`

```typescript
// Example request
GET /api/exchange-rate?base=GBP&target=NOK&amount=100

// Example response (USD Cross-Rate - Free Plan)
{
  "success": true,
  "base": "GBP",
  "target": "NOK",
  "rate": 13.5717,
  "convertedAmount": 1357.17,
  "originalAmount": 100,
  "lastUpdated": "2024-01-24",
  "timestamp": 1757210427000,
  "source": "openexchangerates.org",
  "method": "usd-cross-rate",
  "apiBase": "USD",
  "usdRates": {
    "GBP": 0.740302,
    "NOK": 10.04675
  }
}
```

### Key Components

1. **ConverterCard**: Main conversion interface with real-time updates
2. **QuickReference**: Common conversion amounts table
3. **EducationalContent**: Currency information and market factors

### USD Cross-Rate Calculation Method (Free Plan)

The converter uses USD as the base currency to calculate GBP ↔ NOK rates:

```javascript
// Open Exchange Rates Free Plan - USD base only
const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${apiKey}`)
const data = await response.json()

// Extract USD rates for both currencies
const usdToGbp = data.rates.GBP // 1 USD = 0.740302 GBP
const usdToNok = data.rates.NOK // 1 USD = 10.04675 NOK

// Calculate cross rate: GBP/NOK = (USD/NOK) ÷ (USD/GBP)
const gbpToNokRate = usdToNok / usdToGbp // 10.04675 ÷ 0.740302 = 13.5717

// Convert amount
const nokAmount = gbpAmount * gbpToNokRate
```

**Real Example with Current Rates**:

- 1 USD = 0.740302 GBP
- 1 USD = 10.04675 NOK
- 1 GBP = 10.04675 ÷ 0.740302 = **13.5717 NOK**

### Performance Features

- **USD Cross-Rate Calculation**: Accurate rates using Open Exchange Rates free plan
- **Intelligent Fallbacks**: Multi-tier fallback strategy for 99.9% uptime
- **Caching**: API responses cached for 1 hour
- **Debouncing**: Input changes debounced by 1 second
- **Error Handling**: Graceful degradation through multiple APIs
- **Loading States**: Visual feedback during API calls
- **Method Transparency**: Shows "USD Cross-Rate" calculation method
- **Real-time USD Rates**: Displays underlying USD rates for transparency

## SEO Optimization

- **Metadata**: Comprehensive title, description, and keywords
- **Structured Data**: JSON-LD schemas for WebApplication and FAQ
- **Content**: 2000+ words of SEO-optimized content
- **Keywords**: Targeting "GBP to NOK", "pund til NOK", "currency converter"

## Usage Examples

### Basic Conversion

```javascript
// Convert 100 GBP to NOK
const response = await fetch("/api/exchange-rate?base=GBP&target=NOK&amount=100")
const data = await response.json()
console.log(`100 GBP = ${data.convertedAmount} NOK`)
```

### React Component Usage

```jsx
import ConverterCard from "./components/ConverterCard"

function App() {
  return (
    <div>
      <ConverterCard />
    </div>
  )
}
```

## Development

### Prerequisites

- Node.js 18+
- Next.js 14+
- TypeScript
- Tailwind CSS

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see API Configuration)
4. Run development server: `npm run dev`

### File Structure

```
app/tools/pund-til-nok-kalkulator/
├── components/
│   ├── ConverterCard.tsx      # Main converter interface
│   ├── QuickReference.tsx     # Reference table
│   └── EducationalContent.tsx # Educational sections
├── types/
│   └── index.ts              # TypeScript definitions
├── utils/
│   ├── currency.ts           # Currency utilities
│   └── clipboard.ts          # Copy functionality
├── layout.tsx                # SEO metadata
└── page.tsx                  # Main page component
```

## Production Deployment

1. **Environment Variables**: Set `OPEN_EXCHANGE_RATES_API_KEY` in production
2. **Caching**: API responses cached for optimal performance
3. **Error Monitoring**: Monitor API failures and fallback usage
4. **Rate Limiting**: Consider API usage limits for high-traffic sites

## License

This project is part of the GeeksKai tools collection.
