/* Shared diction style layer. Works in the browser and in Node tests. */
(function (root) {
  "use strict";

  const EXPAND = [
    [/can't\b/gi, "cannot"],
    [/won't\b/gi, "will not"],
    [/n't\b/gi, " not"],
    [/'re\b/gi, " are"],
    [/'ve\b/gi, " have"],
    [/'ll\b/gi, " will"],
    [/'d\b/gi, " would"],
    [/'m\b/g, " am"]
  ];

  const SHORT_WORDS = [
    [/\butilize(?:s|d|ing)?\b/gi, function (m) { return /ing$/i.test(m) ? "using" : /d$/i.test(m) ? "used" : /s$/i.test(m) ? "uses" : "use"; }],
    [/\bapproximately\b/gi, "about"],
    [/\bsufficient\b/gi, "enough"],
    [/\bnumerous\b/gi, "many"],
    [/\bindividuals\b/gi, "people"],
    [/\bpurchase\b/gi, "buy"],
    [/\bassist\b/gi, "help"],
    [/\bobtain\b/gi, "get"],
    [/\bcommence\b/gi, "start"],
    [/\bterminate\b/gi, "end"],
    [/\bsubsequent\b/gi, "next"],
    [/\bprior to\b/gi, "before"]
  ];

  const LONG_WORDS = [
    [/\buse\b/gi, "utilize"],
    [/\buses\b/gi, "utilizes"],
    [/\bused\b/gi, "utilized"],
    [/\busing\b/gi, "utilizing"],
    [/\babout\b/gi, "approximately"],
    [/\benough\b/gi, "sufficient"],
    [/\bmany\b/gi, "numerous"],
    [/\bhelp\b/gi, "assist"],
    [/\bget\b/gi, "obtain"],
    [/\bstart\b/gi, "commence"],
    [/\bbuy\b/gi, "purchase"],
    [/\bbefore\b/gi, "prior to"],
    [/\bshow\b/gi, "demonstrate"],
    [/\bsay\b/gi, "state"]
  ];

  const FORMAL = [
    [/\bbut\b/gi, "however"],
    [/\bso\b/gi, "therefore"],
    [/\balso\b/gi, "additionally"],
    [/\bstill\b/gi, "nevertheless"],
    [/\bwant to\b/gi, "wish to"],
    [/\ba lot of\b/gi, "a substantial number of"]
  ];

  const CASUAL = [
    [/\bhowever\b/gi, "but"],
    [/\btherefore\b/gi, "so"],
    [/\bfurthermore\b/gi, "and"],
    [/\bmoreover\b/gi, "and"],
    [/\badditionally\b/gi, "also"],
    [/\bnevertheless\b/gi, "still"],
    [/\bconsequently\b/gi, "so"]
  ];

  const HEDGES_STRIP = [
    [/\bit is important to note that\b[,:]?\s*/gi, ""],
    [/\bit should be noted that\b[,:]?\s*/gi, ""],
    [/\bit is worth noting that\b[,:]?\s*/gi, ""],
    [/\bi think that\b[,:]?\s*/gi, ""],
    [/\bi believe that\b[,:]?\s*/gi, ""],
    [/\bperhaps\b\s*/gi, ""],
    [/\bmaybe\b\s*/gi, ""],
    [/\bapparently\b\s*/gi, ""],
    [/\barguably\b\s*/gi, ""],
    [/\bsomewhat\b\s*/gi, ""],
    [/\bkind of\b\s*/gi, ""],
    [/\bsort of\b\s*/gi, ""]
  ];

  const SHAKESPEARE = [
    [/\byou are\b/gi, "thou art"],
    [/\byou have\b/gi, "thou hast"],
    [/\byou\b/gi, "thee"],
    [/\byour\b/gi, "thy"],
    [/\bdo not\b/gi, "do not"],
    [/\bvery\b/gi, "most"],
    [/\bbefore\b/gi, "ere"]
  ];

  const GONZO = [
    [/\bvery\b/gi, "wildly"],
    [/\breally\b/gi, "seriously"],
    [/\bquite\b/gi, "damn"]
  ];

  const ICEBERG_STRIP = [
    [/\bvery\b\s*/gi, ""],
    [/\breally\b\s*/gi, ""],
    [/\bquite\b\s*/gi, ""],
    [/\bjust\b\s*/gi, ""]
  ];

  const SLIDER_KEYS = [
    "wordSize", "formality", "sentenceLength", "contractions",
    "hedging", "tone", "concreteness", "person",
    "punch", "jargon", "warmth", "citationDensity"
  ];

  const WRITER_PRESETS = {
    custom: null,
    hemingway: { wordSize: 15, formality: 20, sentenceLength: 12, contractions: 82, hedging: 6, tone: 22, concreteness: 88, person: 70, punch: 90, jargon: 5, warmth: 45, citationDensity: 4 },
    shakespeare: { wordSize: 88, formality: 82, sentenceLength: 78, contractions: 8, hedging: 32, tone: 92, concreteness: 40, person: 80, punch: 35, jargon: 20, warmth: 55, citationDensity: 8 },
    thompson: { wordSize: 48, formality: 12, sentenceLength: 58, contractions: 90, hedging: 8, tone: 96, concreteness: 70, person: 55, punch: 85, jargon: 10, warmth: 30, citationDensity: 6 },
    thesis: { wordSize: 78, formality: 94, sentenceLength: 82, contractions: 4, hedging: 58, tone: 28, concreteness: 35, person: 15, punch: 18, jargon: 55, warmth: 12, citationDensity: 80 }
  };

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, Math.round(n)));
  }

  function countMatches(text, re) {
    const m = text.match(re);
    return m ? m.length : 0;
  }

  function readDraft(text) {
    const raw = String(text || "").trim();
    if (!raw) {
      return {
        writer: "custom",
        wordSize: 40, formality: 40, sentenceLength: 40, contractions: 40,
        hedging: 20, tone: 40, concreteness: 50, person: 40,
        punch: 40, jargon: 20, warmth: 40, citationDensity: 10,
        citation: "apa7",
        reading: "Paste a draft. The sliders will read how it is written."
      };
    }
    const words = raw.split(/\s+/).filter(Boolean);
    const wc = words.length || 1;
    const avgChars = words.reduce(function (s, w) { return s + w.replace(/[^A-Za-z]/g, "").length; }, 0) / wc;
    const sentences = raw.split(/(?<=[.!?])\s+/).filter(function (s) { return s.trim(); });
    const sc = sentences.length || 1;
    const avgSent = wc / sc;
    const shortSent = sentences.filter(function (s) { return s.trim().split(/\s+/).length <= 10; }).length / sc;
    const contractions = countMatches(raw, /\b\w+n't\b|\b(?:I'm|you're|we're|they're|it's|that's|there's|we'll|I'll|you'll)\b/gi);
    const hedges = countMatches(raw, /\b(?:perhaps|maybe|might|may|suggests?|appears?|seems?|somewhat|kind of|sort of|I think|I believe)\b/gi);
    const formal = countMatches(raw, /\b(?:however|therefore|furthermore|moreover|thus|hence|utilize|obtain|demonstrate|subsequently)\b/gi);
    const casual = countMatches(raw, /\b(?:but|so|also|gonna|yeah|okay)\b/gi);
    const intens = countMatches(raw, /\b(?:very|really|wildly|quite|most)\b|[!]{1,}/gi);
    const you = countMatches(raw, /\b(?:you|your|you're)\b/gi);
    const we = countMatches(raw, /\b(?:we|our|us)\b/gi);
    const third = countMatches(raw, /\b(?:the researcher|the committee|one must|subjects|participants)\b/gi);
    const jargon = countMatches(raw, /\b(?:utilize|leverage|synergy|paradigm|stakeholders|bandwidth|learnings|actionable|best-in-class)\b/gi);
    const abstract = countMatches(raw, /\b\w{8,}(?:tion|ment|ness|ity|ization)\b/gi);
    const cites = countMatches(raw, /\([A-Z][A-Za-z'`-]+(?:,?\s+)\d{4}/g) + countMatches(raw, /\[[0-9]+\]/g);
    const warmth = you + we + countMatches(raw, /\b(?:please|thanks|together)\b/gi);

    const style = {
      writer: "custom",
      wordSize: clamp((avgChars - 3.2) * 28, 5, 95),
      formality: clamp(40 + (formal - casual) * 8, 5, 95),
      sentenceLength: clamp((avgSent - 8) * 5.5, 5, 95),
      contractions: clamp((contractions / wc) * 900, 2, 95),
      hedging: clamp((hedges / wc) * 1200, 2, 95),
      tone: clamp(20 + intens * 6 + shortSent * 20, 5, 95),
      concreteness: clamp(80 - (abstract / wc) * 600, 5, 95),
      person: clamp((you / wc) * 1400, 5, 95),
      punch: clamp(shortSent * 90 + (intens / sc) * 15, 5, 95),
      jargon: clamp((jargon / wc) * 1800, 2, 95),
      warmth: clamp((warmth / wc) * 900, 5, 95),
      citationDensity: clamp((cites / Math.max(sc, 1)) * 120, 2, 95),
      citation: "apa7"
    };
    style.reading = "This draft currently reads: word size " + style.wordSize +
      ", formality " + style.formality +
      ", sentence length " + style.sentenceLength +
      ", contractions " + style.contractions +
      ", hedging " + style.hedging +
      ", tone " + style.tone +
      ", concreteness " + style.concreteness +
      ", second person " + style.person +
      ", punch " + style.punch +
      ", jargon " + style.jargon +
      ", warmth " + style.warmth +
      ", citations " + style.citationDensity + ".";
    return style;
  }

  const CITATION_LABELS = {
    apa7: "APA 7",
    mla9: "MLA 9",
    chicago: "Chicago",
    harvard: "Harvard",
    ieee: "IEEE"
  };

  function applyPairs(text, pairs, notes, label, limit) {
    let n = 0;
    let out = text;
    for (const pair of pairs) {
      const re = pair[0];
      const to = pair[1];
      out = out.replace(re, function (match) {
        n += 1;
        return typeof to === "function" ? to(match) : to;
      });
    }
    if (n && notes) notes.push(label + ": " + n + (n === 1 ? " change" : " changes"));
    return out;
  }

  function splitLongSentences(text, maxWords, notes) {
    const parts = text.split(/([.!?]+(?:\s+|$))/);
    let cuts = 0;
    const out = [];
    for (let i = 0; i < parts.length; i += 2) {
      let sentence = parts[i] || "";
      const punct = parts[i + 1] || "";
      const words = sentence.trim().split(/\s+/).filter(Boolean);
      if (words.length > maxWords) {
        const mid = Math.floor(words.length / 2);
        let cut = mid;
        for (let j = mid; j < words.length - 3; j++) {
          if (/^(and|but|so|which|that|because)$/i.test(words[j])) {
            cut = j;
            break;
          }
        }
        const a = words.slice(0, cut).join(" ");
        const b = words.slice(cut).join(" ").replace(/^(and|but|so|which|that|because)\s+/i, "");
        out.push(a.replace(/[,;:]$/, "") + ". ");
        out.push(b.charAt(0).toUpperCase() + b.slice(1) + punct);
        cuts += 1;
      } else {
        out.push(sentence + punct);
      }
    }
    if (cuts && notes) notes.push("Shortened " + cuts + (cuts === 1 ? " long sentence" : " long sentences"));
    return out.join("");
  }

  function joinShortSentences(text, notes) {
    const joined = text.replace(/([.!?])\s+([A-Z][^.!?]{8,80}[.!?])/g, function (m, p, rest) {
      if (/^(The|This|That|These|Those|It|We|They|There|A|An)\b/.test(rest)) {
        return "; " + rest.charAt(0).toLowerCase() + rest.slice(1);
      }
      return "; " + rest;
    });
    if (joined !== text && notes) notes.push("Joined some short sentences for a longer academic line");
    return joined;
  }

  function parseCitations(text) {
    const found = [];
    const re = /\(([A-Z][A-Za-z'`-]+(?:\s+(?:and|&)\s+[A-Z][A-Za-z'`-]+)?)(?:,?\s+)(\d{4})(?:[a-z])?(?:,\s*p+\.?\s*(\d+))?\)/g;
    let m;
    while ((m = re.exec(text))) {
      found.push({ raw: m[0], author: m[1], year: m[2], page: m[3] || "" });
    }
    return found;
  }

  function renderCite(item, fmt, index) {
    const author = item.author;
    const year = item.year;
    const page = item.page;
    if (fmt === "apa7") return "(" + author + ", " + year + (page ? ", p. " + page : "") + ")";
    if (fmt === "mla9") return "(" + author + (page ? " " + page : " " + year) + ")";
    if (fmt === "chicago") return "(" + author + " " + year + (page ? ", " + page : "") + ")";
    if (fmt === "harvard") return "(" + author + " " + year + (page ? ", p. " + page : "") + ")";
    if (fmt === "ieee") return "[" + (index + 1) + "]";
    return item.raw;
  }

  function applyCitations(text, fmt, notes) {
    const found = parseCitations(text);
    if (!found.length) {
      notes.push("Citation format " + (CITATION_LABELS[fmt] || fmt) + ": no in-text citations found to reformat");
      return text;
    }
    let out = text;
    found.forEach(function (item, i) {
      out = out.replace(item.raw, renderCite(item, fmt, i));
    });
    notes.push("Reformatted " + found.length + " in-text citation" + (found.length === 1 ? "" : "s") + " as " + (CITATION_LABELS[fmt] || fmt));
    if (fmt === "ieee") {
      const refs = found.map(function (item, i) {
        return "[" + (i + 1) + "] " + item.author + ", " + item.year + ".";
      });
      out = out.replace(/\s*$/, "") + "\n\nReferences\n" + refs.join("\n");
      notes.push("Added an IEEE-style numbered reference list from those in-text citations");
    }
    return out;
  }

  function cleanup(text) {
    return text
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\s+([,.;!?])/g, "$1")
      .replace(/([a-z])([.!?])(?=[A-Z])/g, "$1$2 ")
      .replace(/^[ \t,;:]+/gm, "")
      .replace(/(^|[.!?]\s+|\n+)([a-z])/g, function (m, lead, ch) { return lead + ch.toUpperCase(); })
      .trim();
  }

  function applyStyle(text, style) {
    const notes = [];
    const writer = (style && style.writer) || "custom";
    let out = text;
    const wordSize = Number(style.wordSize);
    const formality = Number(style.formality);
    const sentenceLength = Number(style.sentenceLength);
    const contractions = Number(style.contractions);
    const hedging = Number(style.hedging);
    const tone = Number(style.tone);
    const citation = style.citation || "apa7";
    const punch = Number(style.punch);
    const jargon = Number(style.jargon);

    if (writer && writer !== "custom") notes.push("Writer preset: " + writer);

    if (wordSize < 50) out = applyPairs(out, SHORT_WORDS, notes, "Shorter words");
    else if (wordSize > 50) out = applyPairs(out, LONG_WORDS, notes, "Longer words");

    if (formality < 50) out = applyPairs(out, CASUAL, notes, "Less formal");
    else if (formality > 50) out = applyPairs(out, FORMAL, notes, "More formal");

    if (contractions < 50) out = applyPairs(out, EXPAND, notes, "Expanded contractions");

    if (hedging < 50) out = applyPairs(out, HEDGES_STRIP, notes, "Cut hedging");
    else if (hedging > 50) {
      if (!/^(perhaps|it appears|the evidence)/i.test(out)) {
        const keepCap = /^[A-Z][a-z]+\s/.test(out) && !/^(The|This|That|These|Those|It|We|There|A|An)\b/.test(out);
        const rest = keepCap ? out : out.charAt(0).toLowerCase() + out.slice(1);
        out = "The evidence suggests that " + rest;
        notes.push("Added a cautious academic opener");
      }
    }

    if (tone < 50 || writer === "hemingway") out = applyPairs(out, ICEBERG_STRIP, notes, "Iceberg cuts");
    if (writer === "shakespeare" || (tone > 50 && writer !== "thompson" && writer !== "thesis")) {
      out = applyPairs(out, SHAKESPEARE, notes, "Elevated / Shakespeare diction");
    }
    if (writer === "thompson") {
      out = applyPairs(out, GONZO, notes, "Higher-voltage tone");
    }

    if (jargon < 50) out = applyPairs(out, SHORT_WORDS, notes, "Cut jargon");

    const maxWords = Math.max(8, Math.round(8 + (Number(sentenceLength) / 100) * 30));
    if (sentenceLength < 50 || punch > 50) out = splitLongSentences(out, punch > 50 ? Math.min(12, maxWords) : maxWords, notes);
    else if (sentenceLength > 50) out = joinShortSentences(out, notes);

    if (writer === "thesis") out = applyCitations(out, citation, notes);

    out = cleanup(out);
    return { text: out, notes: notes };
  }

  const api = {
    applyStyle: applyStyle,
    readDraft: readDraft,
    SLIDER_KEYS: SLIDER_KEYS,
    WRITER_PRESETS: WRITER_PRESETS,
    CITATION_LABELS: CITATION_LABELS,
    DEFAULT_STYLE: {
      writer: "custom",
      wordSize: 40,
      formality: 40,
      sentenceLength: 40,
      contractions: 70,
      hedging: 20,
      tone: 40,
      concreteness: 50,
      person: 40,
      punch: 40,
      jargon: 20,
      warmth: 40,
      citationDensity: 10,
      citation: "apa7"
    }
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.DictioStyle = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
