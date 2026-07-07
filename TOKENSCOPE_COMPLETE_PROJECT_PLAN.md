# TokenScope v9.0 - Complete Project Plan
**Technical Architecture & Implementation Specification**

---

## EXECUTIVE SUMMARY

TokenScope is a multi-provider AI cost and health monitoring dashboard that provides real-time visibility into API usage, billing, and model behavior across 7 AI providers (Claude, OpenAI, DeepSeek, Gemini, Mistral, Grok, Cohere). Core mission: transparent accountability for AI costs—no more mystery charges.

**Key Features:**
- Real-time cost tracking by model and provider
- 120-day local audit trail (gap-fill sync strategy)
- Health signals (I/O ratio, model shift detection, output growth)
- Dual-source rate cards (empirical + reference)
- Browser extension for Pro account interception
- Forensic audit reports with anomaly detection
- User-weighted ROI scoring
- Sycophancy/verbosity analysis

---

## ARCHITECTURE OVERVIEW

### Technology Stack
- **Frontend**: Vanilla JavaScript (no frameworks), HTML5, CSS3
- **Storage**: IndexedDB (local-first, 120-day retention)
- **Backend**: Python HTTP proxy (relay, no direct API exposure)
- **Browser Extension**: Chrome WebExtension API (Phase 1)
- **Communication**: HTTP REST + JSON

### Data Flow
```
User Browser
    ↓
[TokenScope HTML + JS]
    ↓
[Python Proxy Server (Port 8723)]
    ↓
[Provider APIs]
    ↓
Response → IndexedDB (local storage)
    ↓
[Dashboard rendering]
```

### Security Principles
- **API keys stored locally only** (browser vault, never sent to 3rd parties)
- **Proxy relay design** — keys never exposed to frontend
- **Local-first architecture** — data stays on user's machine
- **No external analytics or tracking**
- **Open-source inspection encouraged**

---

## DETAILED CARD SPECIFICATIONS

### CARD 1: COST OVERVIEW
**Purpose**: High-level cost summary and drill-down audit

#### Tab 1: Overview
- **Yesterday's cost**: Sum of all models, previous day (UTC midnight-midnight)
- **This month's cost**: YTD for current calendar month
- **Average/day**: This month total ÷ days elapsed
- **Top model**: Model with highest cost this month
- **Current model**: Model with highest usage today

**Data Source**: IndexedDB rows of kind:'model', filtered by date range

#### Tab 2: Documentation
- Placeholder for future feature documentation
- Will contain user guides, API setup instructions, etc.

#### Tab 3: Rate Card
- **Provider selector dropdown**: All 7 providers
- **Model table**: Model | Input $/MTok | Output $/MTok | Source (Confirmed/Reference)
- **Dual-source rates**:
  - **Confirmed**: Computed from user's actual billing (cost ÷ tokens)
  - **Reference**: Hand-entered from provider docs, labeled with verification date
- **Sort**: By model name, high-cost-first, or custom
- **Verified date footer**: Shows when reference rates were last confirmed

**Implementation**:
```javascript
function computeRateCard(records, provider) {
  // Group by (model, direction)
  // Sum tokens from 'usage-model-direction' rows
  // Sum costs from 'model-direction' rows
  // Calculate: effectiveRate = (costSum / tokenSum) * 1M
  // Return: [{model, inputRate, outputRate, confirmed: bool}]
  // Sort by model
}
```

#### Tab 4: Audit Report (NEW)
- **Date range picker**: Start date/time + end date/time (granular: hours/minutes)
- **Anomaly detection**:
  - Cost spike: Flag days where daily cost > 2× rolling 7-day average
  - Model mismatch: (Future) requested model ≠ delivered model
  - Token inflation: (Future) unusual token counts per request
- **Anomaly table**: Date | Model | Cost Delta | Tokens | % Over Baseline | Details
- **Export buttons**: [DOWNLOAD PDF] [DOWNLOAD CSV]
- **Forensic summary**:
  ```
  Anomalies detected: N
  Date range: YYYY-MM-DD to YYYY-MM-DD
  Total anomaly cost: $X.XX (CAD $Y.YY)
  Most expensive anomaly: [date] [model] $Z.ZZ
  Recommendation: [based on pattern]
  ```

**Data Structure** (IndexedDB):
```javascript
{
  id: 'provider_date_kind_model_direction',
  provider: 'claude',
  date: '2026-07-05',
  kind: 'model',           // or 'direction', 'model-direction', 'usage-model-direction'
  model: 'claude-opus-4-8',
  direction: 'input',      // or 'output'
  cost: 23.45,             // USD
  tokens: 50000,           // For usage rows
  timestamp: '2026-07-05T14:32:00Z'
}
```

---

### CARD 2: HEALTH SIGNALS
**Purpose**: Early warning system for unusual AI usage patterns

#### Signals to Display
1. **Input/Output Ratio** (30-day window)
   - Calculate: Sum(input costs) ÷ Sum(output costs)
   - Warn if >2:1, Flag if >4:1
   - Detail: "Input:Output cost ratio N:1 over last 30 days"

2. **Model Shift Detection** (3-day recent vs. 30-day prior)
   - Track which models appear in recent window vs. prior
   - Flag if new expensive model appears suddenly
   - Flag if primary model disappears
   - Detail: "New model [name] introduced in last 3 days"

3. **Output Growth** (week-over-week)
   - Compare output cost: this week vs. last week
   - Flag if >40% growth, Warn if >20% growth
   - Detail: "Output cost up 30% vs. prior week"

#### Status Indicators
- **OK** (green): Within normal range
- **WATCH** (yellow): Elevated but not critical
- **FLAG** (red): Critical anomaly

**Implementation**:
```javascript
function computeCard2Signals(records) {
  // Filter records by date range
  // Calculate ratios
  // Compare week-over-week
  // Return: [{id, label, status, detail}]
}
```

---

### CARD 3: TREND ANALYSIS
**Purpose**: Visual cost and token consumption trends

#### Elements
1. **7-day trend chart** (stacked bar or line)
   - X-axis: Day (Mon-Sun or last 7 days)
   - Y-axis: Cost in USD
   - Series: One line/bar per model used in period
   - Color-coded by provider (Claude=orange, OpenAI=blue, etc.)

2. **Spike detection**
   - Mark any day >2× rolling 7-day average with a flag icon
   - Hoverable tooltip shows: "Cost spike: $X.XX (YY% above baseline)"

3. **Interactive elements**
   - Hover to see exact cost + tokens for that day
   - Click to drill into that day (opens Card 1 Tab 4 with that date selected)

#### Data Aggregation
- Group by day + model
- Sum all costs and tokens for each combination
- Render as stacked bars (one bar per day, segments per model)

---

### CARD 4: MODEL PREFERENCES
**Purpose**: User-controlled AI response tuning

#### Tab 1: Response Dials (Existing)
- **Sycophancy dial** (0-4 scale, visual representation)
  - 0: "Be absolutely clinical. If I say something false, say 'false'"
  - 1: "Be direct. Don't soften it"
  - 2: "Default style"
  - 3: "Be warm and encouraging"
  - 4: "Generous with enthusiasm and warmth"
  
- **Brevity dial** (0-4 scale)
  - 0: "Compress to absolute minimum"
  - 1: "Concise, high information density"
  - 2: "Balanced"
  - 3: "Detailed, explain thoroughly"
  - 4: "Expansive, comprehensive context"

- **Output**: Live preview of the combined prompt instruction

#### Tab 2: Preferences (NEW - 1-5 sliders)
- **Speed Weight** (1-5): How much to prioritize fast response time vs. accuracy
- **Cost Weight** (1-5): How much to prioritize cheaper models
- **Sycophancy** (1-5): Desired tone (1=clinical, 3=neutral, 5=encouraging)
- **Brevity** (1-5): Output length preference (1=minimal, 3=balanced, 5=detailed)
- **Temperature** (1-5): Creativity/randomness (1=deterministic, 5=creative)

- **Help balloons**:
  - Speed: Click icon → 300-char explanation
  - Cost: Click icon → 300-char explanation
  - Sycophancy: Hover → brief tooltip
  - Brevity: Hover → brief tooltip
  - Temperature: Hover → brief tooltip

- **[Reset]** button: Restore defaults (3, 3, 3, 3, 3)

- **[Save]** button: Store to browser vault

**Data Storage**:
```javascript
vaultSet('dial_sycophancy', '2');
vaultSet('dial_brevity', '3');
vaultSet('pref_speed', '3');
vaultSet('pref_cost', '3');
vaultSet('pref_temperature', '3');
```

---

### CARD 5: HELP & DOCUMENTATION
**Purpose**: Contextual, discoverable user guidance

#### Structure
- **Level 1 (this card)**: 5 main help topics (one per card)
- **Level 2 (drilldown)**: Detailed guides (3 tabs each, up to 15 topics total)

#### Help Topics
1. **Cost Overview** → How to read rate cards, understand dual-source rates, use date picker
2. **Health Signals** → What each signal means, thresholds, how to respond
3. **Trends** → How to read the chart, what spikes mean, how to investigate
4. **Preferences** → What each dial does, how they affect your prompts
5. **Getting Started** → API key setup (all 7 providers), first sync, data retention

#### Help Balloon System
- **Click balloons** (Speed, Cost): Show 300-char explanation, auto-hide after 4 seconds
- **Hover balloons** (Sycophancy, Brevity, Temperature): Show on hover, hide on mouse-out
- **Indexed repository**: All help text in a centralized HELP_CONTENT object, searchable

```javascript
var HELP_CONTENT = {
  'speed-weight': {
    title: 'Speed Weight',
    text: 'Prioritize fast response times. Higher values choose faster models (Haiku, Flash) over slower (Opus). Balance with accuracy needs.',
    level: 'preferences'
  },
  // ... all topics
};
```

---

## MULTI-PROVIDER API INTEGRATION

### Provider List & Endpoints

#### 1. Claude (Anthropic)
- **Admin API only** (requires org admin key)
- **Endpoints**:
  - Cost Report: `/v1/organizations/cost_report` (group_by=description, bucket_width=1d)
  - Usage Report: `/v1/organizations/usage_report/messages` (group_by=model, bucket_width=1d)
- **Auth**: Header `x-api-key: sk-ant-admin01-...`
- **Rate Card**: Hand-entered from platform.claude.com/docs (Opus, Sonnet, Haiku families)
- **Implementation**: ✓ (existing)

#### 2. OpenAI (ChatGPT)
- **Endpoint**: https://api.openai.com/v1/billing/usage (if available) or dashboard scrape
- **Auth**: Header `Authorization: Bearer sk-...`
- **Models**: gpt-4o, gpt-4-turbo, gpt-4o-mini, gpt-3.5-turbo, gpt-4-vision
- **Rate Card**: gpt-4o ($15/$60 per 1M tokens), gpt-4o-mini ($0.15/$0.60), gpt-3.5-turbo ($0.50/$1.50)
- **Challenge**: No granular usage API exposed; may require dashboard scraping or monthly invoice parsing
- **Fallback**: Reference rate card only until API found

#### 3. DeepSeek
- **Endpoint**: https://api.deepseek.com/user/balance (balance-only, no granular usage)
- **Auth**: Header `Authorization: Bearer sk-...`
- **Models**: deepseek-v4-pro, deepseek-v4-flash (note: deprecated deepseek-chat, deepseek-reasoner)
- **Rate Card**: V4-pro ($0.435/$0.87), V4-flash ($0.14/$0.28)
- **Peak/off-peak**: Pricing 2× during 9-12, 14-18 Beijing time (effective mid-July 2026)
- **Challenge**: Balance endpoint only; no granular usage API. May need manual logging or rate card estimation

#### 4. Gemini (Google AI)
- **Endpoint**: https://generativelanguage.googleapis.com/v1beta/... (if exposed)
- **Auth**: API key via query param `key=...` or Bearer token
- **Models**: gemini-2.5-pro, gemini-2.5-flash, gemini-1.5-pro, gemini-1.5-flash
- **Rate Card**: Pro ($0.075-$1.25 input, $0.30-$5.00 output), Flash (cheaper)
- **Challenge**: No public cost API; requires GCP billing integration or Firebase console scrape
- **Fallback**: Reference rate card only

#### 5. Mistral
- **Endpoint**: https://api.mistral.ai/v1/... (no cost API exposed)
- **Auth**: Header `Authorization: Bearer sk-...`
- **Models**: mistral-large-latest ($2/$6), mistral-medium-latest ($0.81/$2.43), mistral-small-latest ($0.14/$0.42)
- **Challenge**: Dashboard-only billing; no API endpoint
- **Fallback**: Reference rate card + manual token counting

#### 6. Grok (xAI)
- **Endpoint**: https://api.x.ai/v1 (no cost API)
- **Auth**: Header `Authorization: Bearer ...` (no prefix)
- **Models**: grok-4.3 ($1.25/$2.50), grok-build-0.1 ($1.00/$2.00)
- **Challenge**: Rate limits scale with spend tiers; no published cost API
- **Fallback**: Reference rate card

#### 7. Cohere
- **Endpoint**: https://api.cohere.ai/v1 (no cost API)
- **Auth**: Header `Authorization: Bearer ...`
- **Endpoints**: /generate, /embed, /classify, /summarize, /converse, /rerank, /tokenize, /detokenize
- **Pricing**: Per-token (generation, embedding) + per-request (classify, summarize, rerank)
- **Models**: Command ($2.50/M), Command-Light ($0.80/M), Embed-English-v3.0 ($0.10/M)
- **Challenge**: Per-request pricing requires per-call logging
- **Fallback**: Reference rate card

### Server.py Routes

**Base: http://localhost:8723**

```python
POST /api/claude/cost-report
  Request: {apiKey, startingAt, endingAt, page?}
  Response: {data: [{starting_at, ending_at, results: [...]}]}

POST /api/claude/usage-report
  Request: {apiKey, startingAt, endingAt, page?}
  Response: {data: [{starting_at, ending_at, results: [...]}]}

POST /api/openai/usage
  Request: {apiKey, startDate, endDate}
  Response: {usage: [{date, tokens, cost}]}

POST /api/deepseek/balance
  Request: {apiKey}
  Response: {balance_remaining: 123.45}

POST /api/gemini/usage
  Request: {apiKey, startDate, endDate}
  Response: {usage: [...]}

POST /api/mistral/usage
  Request: {apiKey, startDate, endDate}
  Response: {usage: [...]} (or 501 if API unavailable)

POST /api/grok/usage
  Request: {apiKey, startDate, endDate}
  Response: {usage: [...]}

POST /api/cohere/usage
  Request: {apiKey, startDate, endDate}
  Response: {usage: [...]}
```

### Implementation Strategy
1. **Phase 1** (immediate): Claude (existing) + OpenAI (research availability first)
2. **Phase 2**: DeepSeek, Gemini (if APIs exist)
3. **Phase 3**: Mistral, Grok, Cohere (reference rates + manual logging)
4. **Fallback for all**: Reference rate card for models not yet auto-discovered

---

## BROWSER EXTENSION: PHASE 1 (CHROME)

### Purpose
Intercept Claude API calls in the browser (Pro account support) and capture token/cost data locally without requiring an API key.

### Architecture

#### Files
```
claude-tokenscope-extension/
├── manifest.json
├── content-script.js
├── background.js
├── popup.html
├── popup.js
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    ├── icon-128.png
```

#### manifest.json (v3)
```json
{
  "manifest_version": 3,
  "name": "TokenScope — Claude Cost Tracker",
  "version": "1.0.0",
  "description": "Real-time token/cost tracking for Claude (Pro & API)",
  "permissions": [
    "webRequest",
    "storage"
  ],
  "host_permissions": [
    "*://api.anthropic.com/*",
    "*://platform.claude.com/*"
  ],
  "content_scripts": [
    {
      "matches": ["*://api.anthropic.com/*"],
      "js": ["content-script.js"]
    }
  ],
  "background": {
    "service_worker": "background.js"
  },
  "popup": {
    "default_popup": "popup.html",
    "default_title": "TokenScope"
  },
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  }
}
```

#### content-script.js
Intercepts fetch/XMLHttpRequest to Claude API endpoints:

```javascript
// Hook fetch
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const [resource, config] = args;
  
  // Capture Claude API calls
  if (typeof resource === 'string' && resource.includes('api.anthropic.com')) {
    const response = await originalFetch.apply(this, args);
    
    // Clone response so we can read it
    const cloned = response.clone();
    const json = await cloned.json();
    
    // Extract model, tokens from request/response
    const requestBody = config?.body ? JSON.parse(config.body) : {};
    const model = requestBody.model || 'unknown';
    const inputTokens = json.usage?.input_tokens || 0;
    const outputTokens = json.usage?.output_tokens || 0;
    
    // Store to IndexedDB or browser vault
    await storeTokenData({
      timestamp: new Date().toISOString(),
      model,
      inputTokens,
      outputTokens,
      cost: null  // Computed later
    });
    
    return response;
  }
  
  return originalFetch.apply(this, args);
};
```

#### Data Storage
Uses browser vault (same as TokenScope frontend):
```javascript
function storeTokenData(data) {
  const key = `tokenscope_${Date.now()}`;
  chrome.storage.local.set({[key]: data});
}
```

#### Popup UI
```html
<div id="popup">
  <h3>TokenScope</h3>
  <div id="stats">
    <p>Today's tokens: <span id="today-tokens">—</span></p>
    <p>Today's cost (estimated): <span id="today-cost">—</span></p>
    <p>Models used: <span id="models-used">—</span></p>
  </div>
  <button id="open-dashboard">Open TokenScope Dashboard</button>
  <button id="export-data">Export Data</button>
</div>
```

#### background.js
```javascript
// Listen for messages from content script
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'log-token-usage') {
    storeTokenData(msg.data);
    sendResponse({ok: true});
  }
});

// Periodic sync to TokenScope main app (if available)
chrome.alarms.create('syncTokenScope', {periodInMinutes: 5});
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncTokenScope') {
    syncToTokenScopeApp();
  }
});
```

### Phase 1 Limitations (by design)
- Chrome only (Firefox/Edge deferred)
- No account linking (local data only)
- No OAuth flow (no auth required—user's own browser)
- No remote sync (data stays local)
- Requires user to use Claude in same browser

### Phase 2 (Future)
- Account authentication via OAuth
- Cloud sync to TokenScope server
- Multi-device access
- Historical data aggregation
- Firefox/Edge support

---

## DATA SCHEMAS

### IndexedDB: 'tokenscope_v9' Database

#### Object Store: 'runs'
```javascript
{
  keyPath: 'id',
  indexes: {
    'provider': {keyPath: 'provider', unique: false},
    'date': {keyPath: 'date', unique: false}
  }
}
```

#### Row kinds
```javascript
// Daily cost by model
{
  id: 'claude_2026-07-05_model',
  provider: 'claude',
  date: '2026-07-05',
  kind: 'model',
  model: 'claude-opus-4-8',
  cost: 45.67,  // USD
  direction: null
}

// Daily cost by direction (input/output)
{
  id: 'claude_2026-07-05_direction',
  provider: 'claude',
  date: '2026-07-05',
  kind: 'direction',
  model: null,
  direction: 'input',
  cost: 23.45
}

// Daily cost by model + direction
{
  id: 'claude_2026-07-05_model_direction',
  provider: 'claude',
  date: '2026-07-05',
  kind: 'model-direction',
  model: 'claude-opus-4-8',
  direction: 'input',
  cost: 15.23
}

// Daily token usage by model + direction (from usage_report)
{
  id: 'claude_2026-07-05_usage_model_direction',
  provider: 'claude',
  date: '2026-07-05',
  kind: 'usage-model-direction',
  model: 'claude-opus-4-8',
  direction: 'input',
  tokens: 250000
}

// Sync state tracker
{
  id: 'claude_sync_state',
  provider: 'claude',
  lastSyncedDate: '2026-07-04',
  status: 'completed'
}
```

---

## IMPLEMENTATION TIMELINE

### Phase 1 (Weeks 1-2): Core Dashboard
- [ ] Finalize Card 1 Tab 1 (Overview)
- [ ] Implement Card 1 Tab 3 (Rate Card with dual-source)
- [ ] Implement Card 1 Tab 4 (Audit Report with date picker + anomaly detection)
- [ ] Implement Card 2 (Health Signals)
- [ ] Implement Card 3 (Trend Chart)
- [ ] Implement Card 4 Tabs 1-2 (Dials + Preferences)
- [ ] Implement Card 5 (Help System)
- [ ] Deploy to local + DigitalOcean

### Phase 2 (Weeks 3-4): Multi-Provider
- [ ] OpenAI API integration (research + build)
- [ ] DeepSeek integration
- [ ] Gemini integration
- [ ] Mistral integration
- [ ] Grok integration
- [ ] Cohere integration

### Phase 3 (Weeks 5-6): Browser Extension
- [ ] Chrome extension manifest + content script
- [ ] Token interception + storage
- [ ] Popup UI
- [ ] Background sync
- [ ] Testing on Pro account

### Phase 4 (Week 7+): Polish
- [ ] Multi-provider testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation
- [ ] Release v1.0

---

## DEPLOYMENT & OPERATIONS

### Local Development
```bash
# Start Python proxy
python server.py 8723

# Serve HTML locally
# (Use VS Code Live Server or python -m http.server)

# Access: http://localhost:8000/TokenScope-v9.0.html
```

### Production (DigitalOcean)
```
URL: pinkhouse.tech/tokenscope/
Server: /var/www/html/tokenscope/
HTML: index.html (TokenScope-v9.0.html)
Server: server.py (port 8723, systemd service)
Logs: /var/log/tokenscope/
```

### Backup & Recovery
- IndexedDB: Browser-managed (user controls via browser settings)
- Server logs: Daily rotation
- Rate card data: Versioned in code (git history)

---

## SUCCESS METRICS

1. **Cost Transparency**: Users can identify and dispute mystery charges within 24 hours of occurrence
2. **Multi-Provider Coverage**: Support 4+ providers by month 2
3. **Health Alerts**: Catch 90%+ of anomalies >2× baseline
4. **Audit Compliance**: 100% of billing data recoverable for 120 days
5. **User Adoption**: 50+ users within 3 months (target: enterprise + independent developers)

---

## RISKS & MITIGATIONS

| Risk | Mitigation |
|------|-----------|
| API changes (provider-side) | Version routes, maintain fallback (reference rates) |
| Data volume (120 days × 7 providers) | IndexedDB can handle 50MB+ per user; compress if needed |
| Performance (large datasets) | Lazy-load, pagination, query optimization |
| Browser compatibility | Chrome Phase 1; Firefox/Edge Phase 2+ |
| User privacy | Local-only data; no external tracking; open-source code |
| Provider auth changes | Monitor API docs; quick patch cycle |

---

## TECHNICAL DEBT & FUTURE WORK

- [ ] OAuth flow for browser extension (Phase 2)
- [ ] Cloud sync backend (Phase 3)
- [ ] Mobile app (iOS/Android)
- [ ] LLM-powered cost forecasting
- [ ] Multi-currency support (CAD, EUR, GBP, etc.)
- [ ] Alert system (email, Slack, SMS)
- [ ] API for third-party integrations
- [ ] Compliance export (audit trail for finance teams)

---

**Document Version**: 1.0  
**Last Updated**: 2026-07-05  
**Status**: Complete Specification, Ready for Implementation
