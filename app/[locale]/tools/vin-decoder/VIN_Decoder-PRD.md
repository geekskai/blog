````markdown
## VIN Decoder Tool – Product Requirements Document (PRD)

### 1) Product Overview

- **Product name**: VIN Decoder (Vehicle Identification Number Decoder)
- **Owner**: GeeksKai Tools
- **Version**: 2.0 (Enhanced with Official NHTSA API Wrapper)
- **Goal**: Provide a fast, accurate, and SEO-optimized VIN decoding tool that extracts comprehensive vehicle details by VIN, supports popular brands (BMW, Chevrolet, Ford, Toyota, Honda, etc.), and ranks for "{brand} VIN decoder" queries.
- **Primary API**: NHTSA VPIC (via `@shaggytools/nhtsa-api-wrapper` v3.0.4) — Official TypeScript wrapper
- **Documentation**: [NHTSA API wrapper guide](https://vpic.shaggytech.com/api/)
- **Enhanced Features**: Batch processing, advanced manufacturer data, Canadian specifications, and comprehensive vehicle variables

### 2) Why Now

- Search demand for brand-specific VIN decoding is high (e.g., "bmw vin decoder", "chevrolet vin decoder", etc.). Capturing this intent with authoritative, fast pages will drive organic traffic and tool usage.
- Official NHTSA API wrapper provides enhanced reliability, TypeScript support, and access to advanced features like batch processing and Canadian specifications.
- Competitive advantage through comprehensive data coverage and professional-grade API integration.

---

### 3) Objectives and Success Metrics

- **Primary objectives**

  - Launch a production-grade VIN decoder with brand-focused SEO landing pages.
  - Provide best-in-class UX: instant validation, rich results, copy/share/export.
  - Establish internal foundation for future automotive tools (recalls, equipment, market value, insurance).

- **KPIs (90 days)**
  - Organic clicks to VIN decoder hub: 10k+
  - Avg. page load (LCP) < 2.5s; CLS < 0.1
  - Tool conversion (decode attempts / sessions) > 30%
  - Brand pages indexed: 25+; top-10 ranking for 10+ “{brand} vin decoder” keywords

---

### 4) Target Users & JTBD

- **Car buyers & owners**: Verify vehicle specs before buying/selling.
- **Dealers / marketplaces**: Quick decode to enrich listings.
- **Mechanics / parts**: Confirm trim, engine, body class for part fitment.
- **Researchers / enthusiasts**: Decode WMIs and manufacturing details.

**Jobs-to-be-done**

- “When I enter a vehicle’s VIN, I want accurate specs immediately so I can make a decision.”
- “When I search ‘{brand} VIN decoder’, I want a trustworthy page tailored to that brand.”

---

### 5) Scope

#### In-Scope (MVP)

**Core Features**:

- VIN input with real-time validation using official `isValidVin` function and helpful error states.
- Enhanced decode via VPIC using official wrapper:
  - `DecodeVinValuesExtended` (primary - richest data set)
  - `DecodeVinValues` (fallback - standard format)
  - `DecodeWMI` for comprehensive manufacturer details
  - `GetModelsForMakeYear` for model validation
- Result mapping into comprehensive sections:
  - Summary (Year, Make, Model, Trim, BodyClass, VehicleType)
  - Engine (Cylinders, Displacement CC/L, FuelType, Power, Configuration)
  - Transmission (Style, Speeds)
  - Dimensions/Chassis (DriveType, Doors, GVWR, BodyClass)
  - Manufacturing (WMI, Plant Country/City/State, Manufacturer Details)
  - Safety Features (Airbags, ABS, ESC, TPMS, SeatBelts)
- Copy/share result, export as JSON/CSV/TXT with raw VPIC data option.
- Local history (last 10 decodes; client-only) with enhanced metadata.
- Brand landing pages with dynamic content and model suggestions.
- SEO-optimized metadata, structured data (WebApplication + FAQ + BreadcrumbList), and internal linking.

**Enhanced Features (Phase 1)**:

- Batch VIN processing (up to 50 VINs simultaneously)
- Advanced manufacturer lookup with `GetAllManufacturers`
- Model year validation and suggestions
- Canadian vehicle specifications support
- Comprehensive vehicle variable explorer

#### Out of Scope (Phase 1)

- Official recall data integration.
- Photo/OCR VIN scanning.
- Auth or saved accounts.
- Paid APIs for market value.
- Equipment plant codes and parts information.
- Advanced Canadian regulatory compliance features.

---

### 6) Competitive Landscape (brief)

- Many VIN decoders exist with weak UX, slow pages, or poor SEO. Our advantages:
  - Performance-first Next.js + caching.
  - Beautiful, modern UI per our design system.
  - Brand-targeted SEO page network.
  - Clear copy/share/export and history features.

---

### 7) User Stories & Acceptance Criteria

1. As a user, I can paste a 17-character VIN and get results under 1.5s (cached) or under 3s (cold).

- Given a valid VIN, when I press Decode, I see:
  - Summary fields (Make, Model, Year, Trim, BodyClass).
  - Engine section (cylinders, displacement, fuel type).
  - Manufacturing section (WMI, plant, country).
  - Unknown/missing values are clearly labeled “Not available”.

2. As a user, I can see validation feedback while typing.

- Invalid length or forbidden characters show inline errors.
- A disabled Decode button until a valid VIN is present.

3. As a user, I can copy, share, or export results.

- “Copy summary” copies readable text.
- “Export JSON/CSV” downloads a file.
- “Copy share link” uses /tools/vin-decoder?vin=… pre-filled.

4. As a user, I can view my recent decodes.

- A “History (x)” panel lists last 10 VINs with Make/Model/Year; clicking re-runs decode.

5. As a user, I can browse brand pages.

- /tools/vin-decoder/bmw shows brand intro, a pre-focused input, FAQs for BMW VINs, and internal links to other brands.

---

### 8) Information Architecture

- `app/tools/vin-decoder/`
  - `page.tsx` — main hub page (VIN input + results)
  - `layout.tsx` — SEO metadata + JSON-LD + shared UI
  - `components/`
    - `VinInput.tsx` — input with validation, examples, keyboard paste
    - `ResultSummary.tsx` — top card with key fields
    - `ResultSections.tsx` — tabs/accordions: Engine, Body, Manufacturing
    - `HistoryPanel.tsx` — local history
    - `ShareExportBar.tsx` — copy/share/export actions
    - `BrandHero.tsx` — brand-specific hero (reused on brand pages)
  - `lib/`
    - `api.ts` — thin client calling VPIC (BYOF fetch)
    - `mapping.ts` — normalize VPIC fields into typed model
    - `validation.ts` — `isValidVin`, VIN hints
    - `cache.ts` — client-side cache (and optional server revalidate)
  - `[brand]/page.tsx` — brand landing (e.g., bmw, chevrolet, ford, toyota, honda…)

---

### 9) API Design & NHTSA API Wrapper Integration

#### 9.1) Library Overview

**Primary Library**: `@shaggytools/nhtsa-api-wrapper` v3.0.4

- **License**: MIT
- **TypeScript Support**: ✅ Full support with complete type definitions
- **Node.js Support**: Native fetch (Node 18+), BYOF for older versions
- **Documentation**: [Official API Guide](https://vpic.shaggytech.com/api/)

#### 9.2) Core VIN Decoding Functions

**Primary Endpoints** (Recommended Usage Order):

1. **`DecodeVinValuesExtended(vin: string)`** ⭐⭐ **RECOMMENDED**

   - **Purpose**: Most comprehensive VIN decoding with extended vehicle specifications
   - **Returns**: Flat key-value format (easiest to process)
   - **Use Case**: Primary decoding method for detailed vehicle information
   - **Data Coverage**: Maximum available fields including advanced specifications

2. **`DecodeVinValues(vin: string)`** ⭐ **FALLBACK**

   - **Purpose**: Standard VIN decoding with essential vehicle information
   - **Returns**: Flat key-value format
   - **Use Case**: Fallback when extended version fails or for basic requirements

3. **`DecodeVin(vin: string)`**

   - **Purpose**: Basic VIN decoding returning variable-value pairs
   - **Returns**: Array of {Variable, Value} objects
   - **Use Case**: Legacy support or when raw variable format needed

4. **`DecodeWMI(wmi: string)`**
   - **Purpose**: World Manufacturer Identifier decoding (first 3 VIN characters)
   - **Returns**: Manufacturer details, plant information, vehicle types
   - **Use Case**: Parallel execution with VIN decoding for comprehensive data

#### 9.3) Enhanced Features Functions

**Batch Processing**:

- **`DecodeVinValuesBatch(vins: string[])`**
  - **Limit**: Maximum 50 VINs per request
  - **Use Case**: Fleet management, bulk processing
  - **Performance**: Single API call for multiple VINs

**Manufacturer & Model Functions**:

- **`GetAllMakes()`** - Complete list of vehicle makes
- **`GetAllManufacturers()`** - Comprehensive manufacturer database
- **`GetModelsForMake(make: string)`** - All models for a specific make
- **`GetModelsForMakeYear(make: string, year: string)`** - Year-specific models
- **`GetMakeForManufacturer(manufacturer: string)`** - Make from manufacturer name

**Vehicle Type & Classification**:

- **`GetVehicleTypesForMake(make: string)`** - Vehicle categories per make
- **`GetVehicleVariableList()`** - All available VPIC variables
- **`GetVehicleVariableValuesList(variableName: string)`** - Possible values for variables

**Specialized Functions**:

- **`GetCanadianVehicleSpecifications(year, make, model)`** - Canadian market data
- **`GetEquipmentPlantCodes()`** - Manufacturing plant information
- **`GetWMIsForManufacturer(manufacturer: string)`** - WMI codes per manufacturer

#### 9.4) Utility Functions

**Validation**:

- **`isValidVin(vin: string)`** ⭐⭐⭐ **ESSENTIAL**

  - **Purpose**: Offline VIN format validation
  - **Performance**: No network request required
  - **Use Case**: Pre-validation before API calls to prevent unnecessary requests

#### 9.5) Implementation Strategy

**Request Flow**:

1. **Pre-validation**: Use `isValidVin(vin)` for immediate feedback
2. **Primary Decode**: Execute `DecodeVinValuesExtended(vin)` for comprehensive data
3. **Parallel WMI**: Simultaneously call `DecodeWMI(vin.slice(0, 3))` for manufacturer details
4. **Fallback Logic**: If extended decode fails, fallback to `DecodeVinValues(vin)`
5. **Data Merging**: Combine VIN and WMI results into unified `DecodedVehicle` model
6. **Enhancement**: Optionally call `GetModelsForMakeYear()` for model validation

**Performance Optimization**:

- Parallel API calls for VIN + WMI data
- Client-side caching with LRU eviction
- Request deduplication for concurrent identical VINs
- Graceful degradation when API endpoints are unavailable

#### 9.6) Enhanced TypeScript Interfaces

```typescript
// Enhanced DecodedVehicle interface with comprehensive VPIC data
export interface DecodedVehicle {
  vin: string

  // Basic Information
  year?: string
  make?: string
  model?: string
  trim?: string
  trim2?: string
  bodyClass?: string
  vehicleType?: string
  driveType?: string
  doors?: string
  gvwr?: string

  // Engine Specifications
  engine?: {
    cylinders?: string
    displacementCc?: string
    displacementL?: string
    fuelType?: string
    fuelTypeSecondary?: string
    powerHp?: string
    powerKw?: string
    configuration?: string
    manufacturer?: string
    model?: string
    cycles?: string
  }

  // Transmission
  transmission?: {
    type?: string
    style?: string
    speeds?: string
  }

  // Manufacturing Details
  manufacturing?: {
    wmi: string
    plantCity?: string
    plantCountry?: string
    plantState?: string
    manufacturerName?: string
    manufacturerId?: string
    commonName?: string
    parentCompanyName?: string
  }

  // Safety Features
  safety?: {
    airbags?: string
    airBagLocations?: string[]
    seatBelts?: string
    abs?: string
    esc?: string
    tpms?: string
    daytimeRunningLight?: string
    blindSpotMonitoring?: string
  }

  // Additional Specifications
  dimensions?: {
    wheelBase?: string
    trackWidth?: string
    curbWeight?: string
    bedLength?: string
    bedType?: string
  }

  // Canadian Specifications (if available)
  canadianSpecs?: {
    available: boolean
    specifications?: Record<string, string>
  }

  // Raw VPIC data for advanced users
  raw?: Record<string, string>

  // API Metadata
  metadata?: {
    apiVersion: string
    decodedAt: string
    dataSource: "extended" | "standard" | "basic"
    wmiDecoded: boolean
  }
}

// Batch processing interface
export interface BatchDecodeResult {
  results: DecodedVehicle[]
  errors: Array<{
    vin: string
    error: string
  }>
  summary: {
    total: number
    successful: number
    failed: number
  }
}

// Enhanced API response types
export interface VPICResponse<T = any> {
  Count: number
  Message: string
  SearchCriteria: string
  Results: T[]
}

// Manufacturer information from WMI decode
export interface ManufacturerInfo {
  CommonName?: string
  ManufacturerName?: string
  Make?: string
  ParentCompanyName?: string
  VehicleType?: string
  Country?: string
  CreatedOn?: string
  UpdatedOn?: string
}
```
````

- Error Handling

  - Network errors: show retry + friendly message.
  - Empty/unknown data: map to “Not available”.
  - Invalid VIN: block request, show hint (length 17, exclude I/O/Q).

- Caching
  - Client: in-memory and history cache by VIN (LRU of 50).
  - Server (optional): Next.js route `app/api/vin/route.ts` with `s-maxage=86400` for CDN caching; returns normalized payload.

---

### 10) UX / UI Specification

- Visual Style

  - Follow “Design System Standards (顶级产品设计标准)”:
    - Gradient layers, glassmorphism, animated shine effects.
    - Clear hierarchy: bold H1, clean section headers.
    - Interaction: hover glows, subtle ring focus, duration-300/500 transitions.

- Layout (Main page)

  - Hero: Title “VIN Decoder”, subtitle, trust badges.
  - Input Card:
    - VIN text field (auto uppercase), paste detection, clear button.
    - Validate in real time; show character-count and hints.
    - Primary Decode CTA (disabled until valid).
  - Results:
    - Summary Card with top attributes.
    - Tabs or accordions:
      - Engine
      - Body & Chassis
      - Manufacturing (with WMI details)
      - “Raw Variables” (advanced users)
  - Actions Bar:
    - Copy Summary, Export JSON, Export CSV, Share Link.
  - History dropdown/panel (top-right of input or results header).

- Brand Pages (e.g., `/tools/vin-decoder/bmw`)

  - Brand hero (logo/emoji-substitute), short paragraph about typical BMW VIN patterns (no trademark usage beyond nominative fair use).
  - Same input component but with brand-specific SEO text blocks and FAQs.
  - Internal links to other brand pages.

- Empty / Error States

  - Invalid VIN entered: compact error message with inline tips.
  - No data: show graceful message and encourage cross-check.

- Accessibility
  - Labels, descriptions, and live regions for validation.
  - Keyboard navigation; visible focus states.
  - Color contrast compliant (WCAG 2.1 AA).

---

### 11) SEO Requirements

- Pages

  - `/tools/vin-decoder/` — hub page
  - `/tools/vin-decoder/[brand]` — brand-focused pages (bmw, chevrolet, ford, toyota, honda, nissan, hyundai, kia, mercedes, audi, vw, volvo, subaru, mazda, porsche, jeep, ram, gmc, cadillac, lexus, acura, infiniti, tesla, jaguar, land-rover)

- Metadata

  - Title: “{Brand} VIN Decoder – Free Vehicle Identification Number Lookup | GeeksKai”
  - Description: Brand-intent copy, value props (free, no signup, instant).
  - Keywords: “{brand} vin decoder, {brand} vin lookup, {brand} vin check”
  - Canonical: set for hub and each brand page.
  - OpenGraph/Twitter cards.

- Structured Data

  - WebApplication schema (+ Feature list)
  - FAQ schema per brand page (answer common decoding questions)
  - BreadcrumbList schema
  - Use `generateMetadata` in App Router for dynamic brand pages.

- Internal Linking

  - Brand directory on hub page.
  - “Related brands” at bottom of brand pages.

- Content Blocks
  - “How VINs work” explanation.
  - Brand-specific patterns (WMI examples, common trims) where appropriate.

---

### 12) Performance & Reliability

- Performance

  - Lazy-load results sections.
  - Dynamic import for heavy components.
  - Next/Image for assets; responsive sizes.
  - Cache API responses; dedupe concurrent requests (VIN-keyed).

- Resilience

  - Parallelize `DecodeVinValuesExtended` and `DecodeWMI`.
  - Graceful fallback to `DecodeVinValues` on low data coverage.
  - Retry policy with exponential backoff (max 2 retries).

- Metrics
  - Track decode latency (client timing).
  - Track API failure rate.
  - Segment by brand landing page vs. hub.

---

### 13) Privacy & Legal

- No PII stored. VINs are not sensitive personal data; treat as anonymous tool input.
- Local storage: decode history only on device; user can clear at any time.
- API terms: comply with VPIC/NHTSA usage guidelines and attribution if required.

---

### 14) Internationalization

- English default. Architecture ready for future language packs (copy blocks externalized).
- Number/date formatting localized when i18n is enabled.

---

### 15) Non-Functional Requirements

- Availability: 99.9% for the tool UI. API dependency may fluctuate; show graceful errors.
- Accessibility: WCAG 2.1 AA.
- Browser support: Evergreen (latest Chrome, Safari, Firefox, Edge); mobile-first.

---

### 16) Engineering Plan (Next.js App Router)

- Files (initial)

  - `app/tools/vin-decoder/layout.tsx` — metadata + JSON-LD
  - `app/tools/vin-decoder/page.tsx` — hub
  - `app/tools/vin-decoder/[brand]/page.tsx` — brand pages
  - `app/tools/vin-decoder/components/*`
  - `app/tools/vin-decoder/lib/api.ts`
    - Wrapper around `@shaggytools/nhtsa-api-wrapper` with BYOF
  - `app/tools/vin-decoder/lib/mapping.ts`
  - `app/tools/vin-decoder/lib/validation.ts`
  - `app/tools/vin-decoder/lib/cache.ts` (simple LRU)
  - Optional server proxy: `app/api/vin/route.ts` (normalize + cache headers)

- Data Flow

  1. User types VIN → `isValidVin` feedback.
  2. Submit → call API wrapper:
     - `DecodeVinValuesExtended(vin)`
     - `DecodeWMI(vin.slice(0,3))` in parallel
     - Fallback: `DecodeVinValues`
  3. Map variables → `DecodedVehicle` model.
  4. Render sections; populate history; expose export/copy/share.

- State & Types

  - Strict TypeScript models for decoded variables and UI state.
  - Narrowed discriminated unions for known variable names.

- Error Mapping Examples

```typescript
type DecodeStatus = "success" | "invalid_vin" | "no_data" | "network_error"

interface DecodeResult {
  status: DecodeStatus
  vehicle?: DecodedVehicle
  message?: string
}
```

---

### 17) Security

- No secrets in client; if server proxy is used, secure environment variables (if any).
- Prevent XSS in rendered “raw variables” by safely rendering text (no HTML injection).

---

### 18) Analytics

- Track events:
  - `vin_decode_attempt` (vin_prefix, brand_guess from WMI, source page)
  - `vin_decode_success` (duration_ms)
  - `vin_decode_error` (error_type)
  - `export_json`, `export_csv`, `copy_summary`, `share_link`
- Use anonymized VIN prefix only (e.g., first 5 chars) for telemetry.

---

### 19) Enhanced Roadmap & Phases

#### Phase 1: Core Implementation (2-3 weeks)

**Week 1-2: Foundation**

- ✅ Official `@shaggytools/nhtsa-api-wrapper` integration
- ✅ Enhanced `DecodeVinValuesExtended` + `DecodeWMI` parallel processing
- ✅ Comprehensive TypeScript interfaces and error handling
- ✅ Hub page with advanced UX and comprehensive decoding
- ✅ Brand pages for top 10 brands with enhanced content

**Week 3: Enhancement**

- Advanced result sections (Engine, Transmission, Safety, Dimensions)
- Enhanced history with metadata tracking
- Copy/share/export with multiple formats (JSON/CSV/TXT)
- SEO metadata + structured data (WebApplication + FAQ + BreadcrumbList)
- Basic analytics with VIN prefix tracking

#### Phase 2: Advanced Features (3-4 weeks)

**Week 4-5: Scale & Performance**

- Batch VIN processing interface (up to 50 VINs)
- Expand brand pages to 25+ with dynamic content
- Server API proxy with intelligent caching
- Advanced manufacturer data integration
- Model year validation and suggestions

**Week 6-7: Data Enhancement**

- Canadian vehicle specifications support
- Vehicle variable explorer with `GetVehicleVariableList`
- Advanced WMI lookup with `GetWMIsForManufacturer`
- Enhanced error handling and retry mechanisms
- Performance monitoring and optimization

#### Phase 3: Professional Features (4-6 weeks)

**Week 8-10: Enterprise Features**

- Bulk processing dashboard for fleet management
- Advanced analytics and usage tracking
- Equipment plant codes integration
- Parts fitment suggestions via manufacturer data
- API rate limiting and usage optimization

**Week 11-13: Advanced Integrations**

- Recalls integration (via NHTSA public endpoints)
- Market value estimation (third-party API integration)
- OCR-based VIN capture from images
- Mobile app companion features
- Advanced export formats and reporting

#### Phase 4: Future Enhancements

**Advanced Features**:

- Real-time VIN validation with manufacturer databases
- Historical vehicle data tracking
- Predictive maintenance suggestions
- Insurance quote integrations
- Marketplace listing optimization

---

### 20) Risks & Mitigations

- VPIC coverage variability → Fallback endpoints, clear “Not available” states.
- SEO competition → Deep brand coverage, fast CWV, authoritative content.
- API rate/perf issues → Response caching, dedupe, backoff, user messaging.

---

### 21) QA Checklist (Acceptance)

- Input validation blocks invalid VINs (length != 17, characters I/O/Q).
- Valid VIN returns mapped fields; unknown values labeled appropriately.
- Copy/export/share work on mobile and desktop.
- History persists across reloads; “Clear” works.
- Brand pages render correct metadata, canonical, and FAQ schema.
- Lighthouse (mobile): Performance ≥ 85, Accessibility ≥ 95, SEO ≥ 95.

---

### 22) Example Mapping (VPIC → Model)

- Common variables (examples; map defensively):
  - `Make` → `make`
  - `Model` → `model`
  - `ModelYear` → `year`
  - `Trim` → `trim`
  - `BodyClass` → `bodyClass`
  - `Doors` → `doors`
  - `DriveType` or `DriveTypePrimary` → `driveType`
  - `DisplacementL` → `engine.displacementL`
  - `DisplacementCC` → `engine.displacementCc`
  - `EngineCylinders` → `engine.cylinders`
  - `FuelTypePrimary` → `engine.fuelType`
  - `PlantCity`/`PlantCountry` → `manufacturing`
  - `WMI` (derived from VIN[0..2]) → enrich via `DecodeWMI`

---

### 23) Content Templates (SEO)

- Hub H1: “Free VIN Decoder – Vehicle Identification Number Lookup”
- Brand H1: “{Brand} VIN Decoder – Decode Your {Brand} VIN Instantly”
- FAQ (per brand):
  - “Where can I find my {Brand} VIN?”
  - “What do the first 3 characters (WMI) mean for {Brand}?”
  - “Which specs can I decode for {Brand}?”

---

### 24) References & API Documentation

- API wrapper docs: [@shaggytools/nhtsa-api-wrapper guide](https://vpic.shaggytech.com/api/)
- NHTSA VPIC API: [Official NHTSA Documentation](https://vpic.nhtsa.dot.gov/api/)

---

## 附录：@shaggytools/nhtsa-api-wrapper 详细使用手册

### A1) 库概述

`@shaggytools/nhtsa-api-wrapper` 是与美国国家公路交通安全管理局（NHTSA）车辆信息（VPIC）API 交互的官方 TypeScript 封装库。

**关键特性**：

- ✅ 完整 TypeScript 支持
- ✅ 原生 fetch API（Node.js 18+）
- ✅ BYOF（Bring Your Own Fetch）支持
- ✅ MIT 许可证
- ✅ 活跃维护和更新

### A2) 核心功能分类

#### VIN 解码功能 🔍

| 函数                           | 用途                 | 推荐度 | 返回格式      |
| ------------------------------ | -------------------- | ------ | ------------- |
| `DecodeVinValuesExtended(vin)` | 最全面的VIN解码      | ⭐⭐⭐ | 扁平键值对    |
| `DecodeVinValues(vin)`         | 标准VIN解码          | ⭐⭐   | 扁平键值对    |
| `DecodeVin(vin)`               | 基础VIN解码          | ⭐     | 变量-值对数组 |
| `DecodeVinValuesBatch(vins[])` | 批量解码（最多50个） | ⭐⭐   | 批量结果      |

#### WMI 解码功能 🏭

| 函数             | 用途             | 数据内容                   |
| ---------------- | ---------------- | -------------------------- |
| `DecodeWMI(wmi)` | 制造商标识符解码 | 制造商名称、国家、车辆类型 |

#### 制造商查询功能 🏢

| 函数                           | 用途           | 适用场景     |
| ------------------------------ | -------------- | ------------ |
| `GetAllMakes()`                | 获取所有品牌   | 品牌下拉列表 |
| `GetAllManufacturers()`        | 获取所有制造商 | 制造商数据库 |
| `GetMakeForManufacturer(name)` | 制造商对应品牌 | 数据关联     |
| `GetManufacturerDetails(name)` | 制造商详情     | 详细信息页   |

#### 车型查询功能 🚗

| 函数                                   | 用途         | 常用程度 |
| -------------------------------------- | ------------ | -------- |
| `GetModelsForMake(make)`               | 品牌所有车型 | ⭐⭐     |
| `GetModelsForMakeYear(make, year)`     | 品牌年份车型 | ⭐⭐⭐   |
| `GetModelsForMakeId(makeId)`           | ID对应车型   | ⭐       |
| `GetModelsForMakeIdYear(makeId, year)` | ID年份车型   | ⭐       |

#### 实用工具功能 🛠️

| 函数                                | 用途         | 重要性      |
| ----------------------------------- | ------------ | ----------- |
| `isValidVin(vin)`                   | 离线VIN验证  | ⭐⭐⭐ 必备 |
| `GetVehicleVariableList()`          | 可用变量列表 | ⭐⭐        |
| `GetVehicleVariableValuesList(var)` | 变量可选值   | ⭐⭐        |

#### 特殊功能 🇨🇦

| 函数                                 | 用途         | 地区       |
| ------------------------------------ | ------------ | ---------- |
| `GetCanadianVehicleSpecifications()` | 加拿大规格   | 加拿大市场 |
| `GetEquipmentPlantCodes()`           | 设备工厂代码 | 制造业应用 |

### A3) 实际应用示例

#### 基础VIN解码

```typescript
import { isValidVin, DecodeVinValuesExtended } from "@shaggytools/nhtsa-api-wrapper"

async function decodeVIN(vin: string) {
  // 1. 离线验证
  if (!isValidVin(vin)) {
    throw new Error("Invalid VIN format")
  }

  // 2. 解码VIN
  const result = await DecodeVinValuesExtended(vin)
  const vehicle = result.Results[0]

  return {
    make: vehicle.Make,
    model: vehicle.Model,
    year: vehicle.ModelYear,
    bodyClass: vehicle.BodyClass,
    // ... 更多字段
  }
}
```

#### 批量处理

```typescript
import { DecodeVinValuesBatch } from "@shaggytools/nhtsa-api-wrapper"

async function batchDecode(vins: string[]) {
  // 最多50个VIN
  const batches = []
  for (let i = 0; i < vins.length; i += 50) {
    batches.push(vins.slice(i, i + 50))
  }

  const results = []
  for (const batch of batches) {
    const result = await DecodeVinValuesBatch(batch)
    results.push(...result.Results)
  }

  return results
}
```

#### 制造商信息增强

```typescript
import { DecodeVinValuesExtended, DecodeWMI } from "@shaggytools/nhtsa-api-wrapper"

async function enhancedDecode(vin: string) {
  const wmi = vin.substring(0, 3)

  // 并行请求
  const [vinResult, wmiResult] = await Promise.all([DecodeVinValuesExtended(vin), DecodeWMI(wmi)])

  const vehicle = vinResult.Results[0]
  const manufacturer = wmiResult.Results[0]

  return {
    ...vehicle,
    manufacturerDetails: {
      name: manufacturer.ManufacturerName,
      commonName: manufacturer.CommonName,
      parentCompany: manufacturer.ParentCompanyName,
    },
  }
}
```

### A4) 错误处理最佳实践

```typescript
import { DecodeVinValuesExtended } from "@shaggytools/nhtsa-api-wrapper"

async function safeDecodeVIN(vin: string) {
  try {
    const result = await DecodeVinValuesExtended(vin)

    // 检查API响应
    if (result.Count === 0) {
      throw new Error("No data found for this VIN")
    }

    const vehicle = result.Results[0]

    // 检查关键字段
    if (!vehicle.Make && !vehicle.Model && !vehicle.ModelYear) {
      throw new Error("Insufficient vehicle data available")
    }

    return vehicle
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout - please try again")
    }

    if (error.message.includes("fetch")) {
      throw new Error("Network error - please check your connection")
    }

    throw error
  }
}
```

### A5) 性能优化建议

1. **缓存策略**：缓存VIN解码结果（24小时TTL）
2. **并行请求**：同时请求VIN和WMI数据
3. **请求去重**：避免重复请求相同VIN
4. **批量处理**：使用批量API减少请求次数
5. **错误重试**：实现指数退避重试机制

### A6) API响应格式

所有API函数返回统一格式：

```typescript
{
  Count: number // 结果数量
  Message: string // API响应消息
  SearchCriteria: string // 搜索条件
  Results: Array<any> // 实际数据数组
}
```

### A7) 生产环境配置

```typescript
// 推荐配置
const config = {
  timeout: 10000, // 10秒超时
  retries: 3, // 最多重试3次
  retryDelay: 1000, // 1秒重试间隔
  cacheTimeout: 86400000, // 24小时缓存
}
```

这个增强版PRD现在包含了完整的API功能说明和最佳实践指导。
