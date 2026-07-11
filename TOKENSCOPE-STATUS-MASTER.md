# TokenScope Master Status — 2026-07-10
**Updated in real-time. No bullshit. Plain English.**

---

## ✅ DONE (Actually Working)

- Backend: Real API integrations (Claude, OpenAI, DeepSeek)
- Frontend: UI layout (3-column, sidebar, cards)
- 16 verified API key URLs (all providers)
- Cost math: Working calculation (input tokens × rate + output tokens × rate)
- API key storage: Browser vault
- LOGIN flow: Opens modal, links to get keys, stores them

---

## 🔨 IN PROGRESS

**Per-Model 120-Day Tracking Data Structure** (CRITICAL - blocks testing)
- Track: date, provider, model, input_tokens, output_tokens, cost
- Example: July 9 Claude Opus $12 + Claude Sonnet $3 = verify total
- Without this: Can't validate costs balance
- Status: STARTING NOW

---

## 📋 TO DO (In Order)

1. **Per-model 120-day tracking** - CRITICAL (you won't test until done)
2. **Card 1**: List all models → current GREEN → multiple active = multiple GREEN
3. **Card 2**: Today's costs + "Loading..." + real-time token counter
4. **Card 4**: Sycophancy (0-4) + Brevity (0-4) sliders
5. **Remove Settings card** - it's redundant
6. **LOGIN button shows "ACTIVE"** when key stored
7. **Body font 1.5x** (text only, not titles)
8. **Real-time data streaming display** - show data arriving live
9. **Model shift detection** - flag when user switches models
10. **Card 3**: 7-day trend chart
11. **Card 5**: Help docs
12. **Card 6**: Forensic Lab

---

## 🚫 BLOCKED (Waiting on User)

None - all blockers resolved.

---

## ✅ RESEARCH COMPLETED

**Gemini Sycophancy & Brevity Framework** (from transcript)

**Sycophancy Scale (0-10):**
- 0: Absolute cold hard truth (clinical, no emotion)
- 1-2: Grounded expert (direct, helpful peer)
- 3-5: Helpful peer (validates logic, corrects errors without apologizing)
- 7-8: Standard AI default (overly accommodating, polite filler)
- 10: Pure flattery (agrees with false statements)

**Sycophancy Library Tiers:**
- >2.5: ~50,000+ words/phrases (baseline courtesies: "certainly," "great question")
- >5.0: ~5,000-10,000 words/phrases (high affirmation: "brilliant," "fantastic")
- >7.5: ~1,500-2,000 words/phrases (hyperbolic: "magnificent," "visionary")

**Mechanism:**
- Hard system instructions (rails that change with dial)
- Semantic embedding (vector distance in token space)
- Tone/syntax mapping (mirror user sentiment)
- Asymmetric library: Level 1 = zero weight on flattery vectors, Level 10 = massive positive multiplier

**Implementation for TokenScope:**
- Default: Level 1 (grounded, direct)
- Configurable via Card 4 slider (0-4 scale maps to 0-10)
- Controls token selection through vector weighting

---

## ❓ NEEDS CLARIFICATION (User to Confirm)

- Per-model costs: YES, track Opus vs Haiku separately to verify totals
- Real-time streaming: YES, show tokens arriving live
- Sycophancy detection: BLOCKED on Gemini instructions

---

## 🚨 KNOWN ISSUES

- Cost balancing logic is gone (was never properly implemented with per-model tracking)
- Need per-model tracking to make cost verification real, not fake

---

**Last updated: 2026-07-10 (this session)**
**Next action: Build per-model 120-day tracking data structure**
