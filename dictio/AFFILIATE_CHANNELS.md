# Dictio affiliate channels — later, when the product is bulletproof

Do not sell, do not pay, and do not send these notes as a live offer until Dictio’s reading is trusted (counts match a long paste, left column stays, 80-word floor holds).

## Economics (locked intent)

- List: **$5 / month** (or $49 / year). Phil is fine with $5; more only after the product earns it.
- Partner cut: **$1 per paying month** per subscriber who arrived on that partner’s link, while they stay subscribed, refunds clawed back.
- Variable API: keep **under $0.25 / average subscriber / month** by not making an LLM the default polish.
- Control: unique `?via=` link, 60-day cookie, Stripe customer metadata `affiliate=…`, monthly count you send, one kill switch per partner. No discount-code-only tracking.

## Built now (dormant)

- Script: `affiliate.js` on the Dictio page.
- Links that will work when billing exists:
  - Platypus: `https://pinkhouse.tech/910/?via=platypus`
  - Writing.Com: `https://pinkhouse.tech/910/?via=writingcom`
- Nothing is paid. The cookie only remembers `via` for a later Stripe field.

## Ask later (not now)

1. **Punchy Platypus Primer / Matt Rud, Platypus Publishing** — best fit. Authors on a writing newsletter. Disclose that he earns $1/month on Dictio, not on their book royalties.
2. **Writing.Com** — ask **partnerships / advertising**, not members. A site-wide or newsletter slot, same $1/month, `?via=writingcom`. Do not scrape items. Evaluate-and-discard for testing is separate from this channel.
3. **Others to ask once Platypus is a yes/no:** Reedsy blog/newsletter; one or two independent author newsletters Matt already respects; maybe a single writing-craft Substack. Skip Grammarly/Hemingway/ProWritingAid (competitors). Skip scraping forums for DMs.

## Email later (do not send until bulletproof)

**Platypus / Matt**

Subject: $1/month if Primer readers subscribe to Dictio

Matt — Dictio (pinkhouse.tech) shows how a draft is written (counts, then polish; original stays). When it is solid we will sell it at $5/month. If Primer readers come through your link, we would pay Platypus **$1 per paying month** per subscriber, while they stay, refunds reversed. You keep the book-royalty promise; this is on our tool only. Need a one-line disclose in the issue. Reply if you even want that on the calendar.

**Writing.Com partnerships**

Subject: Affiliate for a diction tool (authors), $1/month per paid sub

We are not launching today. When Dictio is stable we want one tracked link for Writing.Com members who opt in: $5/month product, $1/month to Writing.Com per active sub from that link. No scraping, no member spam from us. Who should see this when we are ready?

## Kill switch

`via` ids live in `affiliate.js` `KNOWN`. Remove or comment an id to stop **new** attributions. Existing Stripe metadata stays until you choose to freeze payouts.
