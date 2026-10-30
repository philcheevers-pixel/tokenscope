/* Dormant affiliate capture. No money moves until Stripe is live and Dictio is solid. */
(function (root) {
  "use strict";
  const KEY = "dictio-affiliate";
  const DAYS = 60;
  const KNOWN = {
    platypus: { name: "Punchy Platypus Primer / Platypus Publishing", rateUsdPerMonth: 1 },
    writingcom: { name: "Writing.Com", rateUsdPerMonth: 1 }
  };

  function clean(id) {
    return String(id || "").toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  }

  function readStore() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!raw || !raw.id || !raw.t) return null;
      if (Date.now() - raw.t > DAYS * 864e5) {
        localStorage.removeItem(KEY);
        return null;
      }
      return raw;
    } catch (e) {
      return null;
    }
  }

  function capture() {
    if (typeof location === "undefined") return readStore();
    const params = new URLSearchParams(location.search);
    const via = clean(params.get("via") || params.get("ref"));
    if (via) {
      const rec = { id: via, t: Date.now(), known: Boolean(KNOWN[via]) };
      try { localStorage.setItem(KEY, JSON.stringify(rec)); } catch (e) {}
      return rec;
    }
    return readStore();
  }

  const api = {
    KNOWN: KNOWN,
    DAYS: DAYS,
    capture: capture,
    current: readStore,
    stripeMetadata: function () {
      const cur = readStore();
      if (!cur) return {};
      return { affiliate: cur.id };
    }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DictioAffiliate = api;
  capture();
})(typeof globalThis !== "undefined" ? globalThis : this);
