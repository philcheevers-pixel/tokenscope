# PROJECT STATE - July 5, 2026 (End of Day)

## Active Projects

### 1. ANTHROPIC FORENSIC CASE (Priority 1 - Active)
**Objective:** Build forensic consulting report proving unauthorized model substitution on June 5, 2026.

**Evidence Collected:**
- Config file snippet: `coworkModelAutoFallbackByAccount` (LOCATION UNKNOWN - needs verification)
- Console screenshots (week view, day view, hourly views showing June 5 spike)
- Token counts from screenshots: Opus 4.7 (8.9M), Opus 4.8 (2.66M), Opus 4.6 (1.49M), Sonnet 4.5 (10.5M)
- API data pulled (usage_report + cost_report) - FLAGGED AS POTENTIALLY INCORRECT
- Billing calculations - FLAGGED AS WRONG, needs rebuild

**Smoking Gun:** Auto-fallback feature enabled on user's account without consent, causing cascading model substitution and CAD $3,746 unauthorized Opus charges.

**Current State:** Data integrity broken. Need to verify API data against Console screenshots before proceeding to report writing.

**Data Files Created (SUSPECT):**
- june5_usage_by_model.csv
- june5_billing_by_model.csv
- june5_usage_report.json (raw API)
- june5_cost_report.json (raw API)
- june5_forensic_analysis.md

---

### 2. TOKENSCOPE (Priority 2 - Active, Parallel)
**Objective:** Build comprehensive AI cost/health monitoring dashboard (Claude + 6 other providers).

**Current State:**
- HTML frontend: TokenScope-v9.0.html (~1351 lines, 80% feature-complete)
- Python proxy: server.py (relay working, threading fixed)
- Cards 1-4: Partially built (Tabs 1-3 functional, Tab 4 outlined)
- Card 5: Placeholder

**Completion Status:**
- Card 1 Tab 1 (Overview): ✅ Done
- Card 1 Tab 3 (Rate Card): ✅ Done
- Card 1 Tab 4 (Audit Report): ⚠️ Outlined, not built
- Card 2 (Health): ⚠️ Partial
- Card 3 (Trend): ⚠️ Placeholder only
- Card 4 (Dials): ⚠️ Partial
- Card 5 (Help): ❌ Placeholder
- Multi-provider sync: ❌ Not started
- Browser extension: ❌ Deferred

---

## Key Discoveries (This Session)

1. **Auto-fallback feature identified** - Config shows Anthropic deliberately built model substitution logic
2. **Cascading Opus pattern confirmed** - 6 different Opus models charged on June 5, suggests automated retry logic
3. **Data integrity issue** - Billing CSV flagged as incorrect; need to rebuild from verified API data
4. **Context window health** - Conversation substantial; recommend fresh chat for intensive work ahead

---

## Technical Debt / Known Issues

1. Billing data needs verification against Console screenshots
2. Config file location unknown - needs user input
3. API data correctness unconfirmed
4. ChatGPT comparative research incomplete

---

## User Preferences

- **Communication style:** Zero sycophancy ("compadres mode") - direct, no flattery, call out problems
- **Data integrity:** Raw data only, no aggregation/modification without re-query
- **Evidence:** Verified sources or clearly marked as unconfirmed
- **Keyboard issue:** F and V keys broken (watch for dropped letters in transcription)

---

## Files in Working Directory

`C:\Users\philc\CLAUDE BULLSHIT\`

- TokenScope-v9.0.html (main frontend)
- server.py (Python proxy)
- june5_usage_by_model.csv (suspect)
- june5_billing_by_model.csv (suspect)
- june5_usage_report.json (raw API)
- june5_cost_report.json (raw API)
- june5_forensic_analysis.md (analysis summary)
- This file: PROJECT_STATE.md
