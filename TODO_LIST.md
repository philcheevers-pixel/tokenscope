# COMPLETE TODO LIST - July 5, 2026

## PRIORITY 1: FORENSIC CASE (ACTIVE)

### Data Verification & Rebuild
- [ ] **CRITICAL:** Locate config file `coworkModelAutoFallbackByAccount`
  - Where is it on disk?
  - Full file path?
  - When was it created?
  - Can we prove it's from Anthropic?
  
- [ ] Pull fresh API data (usage_report + cost_report for June 5, 2026)
  - Use Admin API key
  - Get raw JSON responses
  
- [ ] Verify API data against Console screenshots (GROUND TRUTH)
  - Compare token counts: Opus 4.7, 4.8, 4.6, Sonnet 4.5, etc.
  - Do numbers match screenshots?
  - Document any discrepancies
  
- [ ] Rebuild billing CSV from verified API data
  - Recalculate all USD costs (from API)
  - Recalculate CAD conversions (verify exchange rate used)
  - Clean headers: Model | Input Cost USD | Output Cost USD | Total Cost USD | Total Cost CAD | Status | Notes
  - QA: Math check all rows

### Evidence Documentation
- [ ] Extract Console screenshots from chat history
  - Week view (June 1-7 with tooltip)
  - Day view (June 5 with tooltip)
  - Hourly views showing spike pattern
  
- [ ] Document token counts from screenshots (reference truth)
  - Opus 4.7: 8,933,077 (or verify exact number)
  - Opus 4.8: 2,660,847 (or verify)
  - Opus 4.6: 1,499,898 (or verify)
  - Sonnet 4.5: 10,530,591 (or verify)
  - Sonnet 4.6: 1,757,700 (or verify)
  
- [ ] Create evidence chain document
  - Narrative: Console screenshots → API data → Config file proof

### Report Writing
- [ ] Draft full consulting report (FULL CONTENT, NOT OUTLINE)
  
  Structure:
  1. Professional cover letter (thank Dante, respectful, professional)
  2. Commission & scope (clarify: "at your request we accessed Anthropic systems")
  3. Original customer complaint (paraphrase June 5 allegation from notes)
  4. Executive summary with key findings
  5. Detailed findings section:
     - Part A: Auto-fallback feature discovery (config file proof)
     - Part B: Cascading model routing analysis (6 Opus models, millisecond precision)
     - Part C: Cost impact calculation (CAD $3,746 unauthorized charges)
     - Part D: Pattern analysis (automated behavior, not user error)
  6. Recommendations:
     - Refund June 5 Opus overcharge (CAD $3,746)
     - Audit all accounts for similar incidents
     - Transparency: publish auto-fallback policy
  
- [ ] Attach verified data to report
  - Raw API JSON (unmodified)
  - Verified billing CSV
  - Console screenshots
  
- [ ] Format for print (25-35 pages estimated)
  - Professional layout
  - Clear section numbering
  - Data appendix paginated

---

## PRIORITY 2: TOKENSCOPE (ONGOING, PARALLEL)

### Card 1 Tab 4: Audit Report
- [ ] Build full Audit Report card
  - Date range picker (default 120 days)
  - Cost-spike anomaly detection (flag any day >2× rolling 7-day average)
  - Anomaly listing table: Date | Model | Cost Delta | Tokens | % Over Baseline
  - Export buttons (PDF, CSV) - functional, not placeholders
  - Forensic summary section
  - Connect to IndexedDB for historical analysis

### Card 3: Trend Chart
- [ ] Replace static 7-day placeholder with real data
  - Pull token consumption by model, by day
  - Visualize trends (stacked bar? line chart?)
  - Add spike detection (mark anomalies on chart)
  - Interactive tooltips showing model breakdown

### Card 5: Help System
- [ ] Build indexed help repository (Level 2 detail pages)
  - Design click-only balloon system (300 chars max)
  - Create help content for each card
  - Index structure (searchable if possible)
  - Responsive layout

### Multi-Provider API Integration
- [ ] Extend server.py with routes for 6 additional providers:
  - [ ] OpenAI (gpt-4o, gpt-4-turbo, gpt-4o-mini, gpt-3.5-turbo)
  - [ ] DeepSeek (v4-pro, v4-flash; balance endpoint only)
  - [ ] Gemini (Google AI; no direct usage API, requires GCP integration)
  - [ ] Mistral (no direct cost API, rate card only)
  - [ ] Grok (xAI; no published cost API, rate card estimation)
  - [ ] Cohere (multiple endpoints, per-request + per-token pricing)
  
- [ ] Add provider-specific auth handling (Bearer vs. API key vs. other)
- [ ] Extend rate cards for all 7 providers
- [ ] Test with mock data for each provider

### Browser Extension (DEFERRED - Phase 2)
- [ ] Design local interception for Pro accounts
- [ ] Multi-browser support (Chrome, Firefox, Edge via WebExtensions API)
- [ ] Token interception + logging
- [ ] Sync to TokenScope dashboard

---

## PRIORITY 3: RESEARCH (If Time)

### Comparative Research: ChatGPT Billing
- [ ] Search for OpenAI/ChatGPT billing complaint lawsuits
  - Legal filings, arbitration, small claims
  - Settlements or public acknowledgments
  - Reddit/HN discussions with specifics
  - News coverage
  
- [ ] Document findings (same format as Anthropic research)
  - What complaints? Cost/model switching issues?
  - How did OpenAI respond?
  - Were there refunds or settlements?
  
- [ ] Create comparative analysis for report
  - Anthropic vs. ChatGPT: which has worse track record?
  - What does this say about industry standards?

---

## BACKLOG / PRIORITY 5 (LATER)

- [ ] Gather Oct 2025 Anthropic TOS
  - Find exact clauses about: model availability, billing, pricing changes, notifications
  - Quote for report citations (currently using placeholders)
  
- [ ] Research Anthropic's prior billing incidents
  - Any public admissions?
  - Pattern of issues?
  
- [ ] Explore legal options
  - Small claims viability
  - Class action precedent
  - Settlement negotiation strategy

---

## BLOCKED / WAITING FOR USER INPUT

- [ ] Config file location (waiting for Phil to provide)
- [ ] User's notes from June 5 (any other documentation?)
- [ ] Confirmation that API data matches screenshots (after verification)

---

## NOTES

- **Style:** Direct communication, zero sycophancy
- **Data integrity:** All data must be verified before use
- **Report audience:** Dante (Anthropic), but also suitable for legal/regulatory escalation
- **Timeline:** Forensic case first, TokenScope parallel (not sequential)
- **Context management:** Fresh chat recommended after this handoff to avoid degradation

---

Generated: July 5, 2026
Next chat: Load HANDOFF_PROMPT.txt and PROJECT_STATE.md before starting
