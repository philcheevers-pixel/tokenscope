# TokenScope Master Plan — 2026-07-10 — v3
## Done, To Do, Blocked

---

## ✅ DELIVERED (Actually Working)

### Phase 1: Foundation — COMPLETE
**UI & Architecture:**
- ✅ 3-column layout (LEFT=providers, CENTER=cards, RIGHT=nav)
- ✅ 6 card slots + Settings (card 0)
- ✅ Provider sidebar with 22 providers (name, logo, color, action buttons)
- ✅ Card navigation buttons (1-5, Settings)
- ✅ Responsive CSS layout

**Configuration:**
- ✅ All 22 providers configured (Anthropic, OpenAI, Google, DeepSeek, xAI, Mistral, Cohere, Moonshot, Alibaba, Zhipu, MiniMax, Together, Fireworks, Groq, Baseten, Cerebras)
- ✅ Complete rate cards for all providers ($/MTok pricing)
- ✅ API endpoint mapping per provider
- ✅ Key URL links to get API keys

**Backend API:**
- ✅ Flask server running on localhost:5000
- ✅ Real API integrations for 22 providers:
  - Claude → `https://api.anthropic.com/v1/admin/cost-report`
  - OpenAI → `https://api.openai.com/v1/dashboard/usage`
  - DeepSeek → `https://api.deepseek.com/v1/user/balance`
  - Mistral, Cohere, Kimi, Qwen, GLM, MiniMax, Together, Fireworks, Groq, Baseten, Cerebras (all wired)
- ✅ Fallback to mock data if key invalid or API fails
- ✅ CORS enabled for frontend communication

**Frontend:**
- ✅ API key settings panel (14 provider fields, grid layout)
- ✅ Key storage in browser vault (localStorage)
- ✅ `saveAllKeys()` batch save
- ✅ `loadWithRealKeys()` fetches all 22 providers
- ✅ Data flow: Frontend → backend with keys → real provider APIs → response → display

**Data Layer:**
- ✅ localStorage vault for API keys (client-side only)
- ✅ localStorage for cost cache (dataGet/dataSet)
- ✅ `fetchProviderCosts()` with key passing

**Cards Working:**
- ✅ Card 1 (Costs): Cost calculation logic tested with mock data
- ✅ Card 2 (Health): I/O ratio detection logic
- ✅ Card 0 (Settings): API key input and storage
- ⚠️ Card 3-5: UI skeletons only (no logic)

**Cost Math:**
- ✅ Token-to-cost calculator: `(input_tokens × rate.input/1M) + (output_tokens × rate.output/1M)`
- ✅ Tested with mock data

---

## 📋 TO DO (Known Work)

### 120-Day Backfill Pipeline (HIGH PRIORITY)
**What's needed:**
- [ ] Backfill endpoint: `POST /api/<provider>/backfill?key=KEY`
- [ ] Historical data fetching (last 120 days per provider)
- [ ] Date range parsing (start_date to end_date)
- [ ] Batch processing (stagger API calls to avoid rate limits)
- [ ] Progress tracking (tell frontend "45 of 120 days loaded")
- [ ] Database storage (IndexedDB schema for history)

**Effort estimate:** 3-4 hours

**Depends on:** IndexedDB schema (Phase 2B)

---

### IndexedDB Schema & Persistence (MEDIUM PRIORITY)
**What's needed:**
- [ ] Database schema design:
  - `costs` table: provider, date, input_tokens, output_tokens, cost, model
  - `health_signals` table: provider, date, io_ratio, model_shift_detected, sycophancy_score
  - `history` table: 120-day rolling window
- [ ] Migration strategy (handle schema updates)
- [ ] Query patterns (date range queries, provider filtering)
- [ ] Replace current localStorage with IndexedDB

**Effort estimate:** 2-3 hours

**Depends on:** Nothing (can design independently)

---

### Sycophancy Detection (MEDIUM PRIORITY)
**What's needed:**
- [ ] ~100-word marker dictionary (from RLHF research)
- [ ] Scoring logic (0-4 scale)
- [ ] Integration with response analyzer
- [ ] Testing with real responses
- [ ] Wire to Card 2 and Card 4

**Effort estimate:** 2-3 hours

**Depends on:** Real API responses

---

### Complete Card Features (LOW-MEDIUM PRIORITY)
**Card 3 (Trends - 7-day chart):**
- [ ] Chart rendering library (Chart.js or similar)
- [ ] Data aggregation (daily costs over 7 days)
- [ ] Visual graph (line chart showing cost trend)

**Card 4 (Config - sycophancy & brevity dials):**
- [ ] Slider input working (0-4 scales)
- [ ] Save settings to localStorage
- [ ] Apply settings to future responses

**Card 5 (Help):**
- [ ] Real documentation (how to use TokenScope)
- [ ] API key setup guide
- [ ] FAQ

**Card 6 (Forensic Lab):**
- [ ] Anomaly detection (unusual usage patterns)
- [ ] Hypothesis testing (compare two models)
- [ ] Cost analysis (breakdown by provider/model/date)

**Effort estimate:** 6-8 hours total

**Depends on:** Phase 2B (real data)

---

### Testing & Validation (HIGH PRIORITY)
**What's needed:**
- [ ] Test with real Claude API key
- [ ] Test with real OpenAI API key
- [ ] Test with real DeepSeek API key
- [ ] Verify cost calculations match provider invoices
- [ ] Test fallback behavior (invalid keys, offline backend)
- [ ] Performance test (loading 22 providers simultaneously)

**Effort estimate:** 2-3 hours (depends on user having valid API keys)

**Blocks:** Everything else (if core doesn't work, features are useless)

---

### Gemini/Google Cloud Integration (SPECIAL CASE)
**Problem:** Google Cloud uses OAuth 2.0, not simple API key auth

**What's needed:**
- [ ] OAuth 2.0 setup (client ID, secret, redirect URI)
- [ ] Token exchange flow
- [ ] BigQuery billing export query (for cost data)
- [ ] Mock implementation for now, real OAuth later

**Effort estimate:** 4-6 hours

**Current status:** Stubbed out in backend, not implemented

---

## 🚫 BLOCKED (Waiting For)

### Blocker 1: Real API Keys (User Action)
**Impact:** Cannot test real data flow

**What's blocking it:**
- User must provide actual API keys for providers they use
- Can't test without keys (fallback to mock data)

**How to unblock:**
- User gets Claude, OpenAI, DeepSeek (etc.) API keys
- Pastes into Settings panel
- Clicks "Reload with Real Data"

**Status:** Ready to accept keys, waiting for user

---

### Blocker 2: IndexedDB Design (Architecture Decision)
**Impact:** BLOCKS backfill, card features, data persistence

**What's blocking it:**
- Haven't finalized database schema
- Need to decide: rolling 120-day window or full history?
- Need to handle schema migrations

**How to unblock:**
- Decide schema structure
- Implement IndexedDB wrapper functions
- Add migration strategy

**Status:** Can start now (independent of other work)

---

### Blocker 3: Backend API Testing (Real Data Validation)
**Impact:** Don't know if provider API calls actually work

**What's blocking it:**
- No real API keys to test with
- Some provider endpoints might be wrong or deprecated
- Rate limits unknown
- Error handling untested

**How to unblock:**
- Get user to test with real keys
- Debug any API endpoint failures
- Add retry logic and rate limiting

**Status:** Ready to test, waiting for user feedback

---

## 📊 SUMMARY

| Phase | Component | Status | ETA |
|-------|-----------|--------|-----|
| 1 | UI Layout | ✅ Done | — |
| 1 | 22 Providers Config | ✅ Done | — |
| 1 | Backend API | ✅ Done (22 providers) | — |
| 1 | Frontend Settings | ✅ Done | — |
| 1 | Key Storage | ✅ Done | — |
| 1 | Cost Math | ✅ Done | — |
| 2A | 120-Day Backfill | ⏳ To Do | 3-4 hrs |
| 2B | IndexedDB Schema | ⏳ To Do | 2-3 hrs |
| 2C | Sycophancy Detection | ⏳ To Do | 2-3 hrs |
| 2D | Complete Cards (3-6) | ⏳ To Do | 6-8 hrs |
| 3 | Testing (Real Keys) | 🚫 Blocked | Waiting for user |
| 3 | Gemini/OAuth | ⏳ To Do | 4-6 hrs |

---

## 🎯 CRITICAL PATH TO MVP

1. **User provides API keys** (can start now)
2. **Test real data flow** (2-3 hours, validates architecture)
3. **Build IndexedDB schema** (2-3 hours, enables persistence)
4. **Implement 120-day backfill** (3-4 hours, core feature)
5. **Add sycophancy detection** (2-3 hours, health signal)
6. **Complete remaining cards** (6-8 hours, polish)

**Total effort remaining:** 18-25 hours

**Recommended approach:** 
- Start with user API key testing TODAY
- Build IndexedDB in parallel (doesn't block testing)
- Prioritize backfill over card features (data > UI)

---

## 🔥 IMMEDIATE NEXT STEPS

1. **User tests with real API keys** (today)
   - Settings panel is ready
   - Report: Does real data load? Any errors?

2. **Build IndexedDB schema** (can start now)
   - Independent of testing
   - Blocks backfill and features

3. **Implement 120-day backfill** (after IndexedDB)
   - Core feature for MVP
   - Enables history tracking

---

**Status as of 2026-07-10, 22:30 UTC:**
- Foundation complete and wired
- Real data pipeline ready to test
- Blocking on user feedback + design decisions
- Clear path to MVP

**Version:** v3 (added actual status breakdown)
