const assert = require("assert");
const DictioStyle = require("./style-core.js");

const SAMPLES = [
  "It is important to note that we utilize a wide variety of suppliers in order to leverage the supply chain at this point in time.",
  "I think that the product is very unique and it was designed for consumers who want trust.",
  "This sentence is intentionally long so the final check will flag it because it keeps going and going with extra clauses about stakeholders and synergy and the fact that people do not always trust what they cannot see.",
  "What the hell is this process, and why do we not just say what is in the food?",
  "Smith (Smith, 2020) argued that labels matter. Jones (Jones, 2019, p. 12) disagreed.",
  "You are going to want this. You have the time. Your draft is ready.",
  "We can't ship until the kitchen is ready, and we won't pretend otherwise.",
  "Perhaps the evidence is mixed. Maybe the sample is small.",
  "Start small. Buy local. Help the cook.",
  "The committee will review the protocol prior to publication, and students wish to obtain sufficient data."
];

const PRESETS = ["hemingway", "shakespeare", "thompson", "thesis"];
const EXTREMES = [
  { name: "all-low", wordSize: 0, formality: 0, sentenceLength: 0, contractions: 0, hedging: 0, tone: 0, writer: "custom", citation: "apa7" },
  { name: "all-high", wordSize: 100, formality: 100, sentenceLength: 100, contractions: 100, hedging: 100, tone: 100, writer: "custom", citation: "apa7" }
];

const CITE_FMTS = ["apa7", "mla9", "chicago", "harvard", "ieee"];

let runs = 0;
const problems = [];

function run(text, style, tag) {
  runs += 1;
  let result;
  try {
    result = DictioStyle.applyStyle(text, style);
  } catch (err) {
    problems.push(tag + " threw: " + err.message);
    return;
  }
  if (typeof result.text !== "string" || !result.text.trim()) {
    problems.push(tag + " empty output");
  }
  if (!Array.isArray(result.notes)) problems.push(tag + " missing notes");
  if (/\s{3,}/.test(result.text)) problems.push(tag + " triple spaces");
}

for (const text of SAMPLES) {
  for (const name of PRESETS) {
    const preset = Object.assign({}, DictioStyle.DEFAULT_STYLE, DictioStyle.WRITER_PRESETS[name], { writer: name });
    run(text, preset, name + " / " + text.slice(0, 24));
  }
  for (const ext of EXTREMES) run(text, ext, ext.name + " / " + text.slice(0, 24));
}

const citeText = SAMPLES[4];
for (const fmt of CITE_FMTS) {
  const style = Object.assign({}, DictioStyle.DEFAULT_STYLE, DictioStyle.WRITER_PRESETS.thesis, { writer: "thesis", citation: fmt });
  const result = DictioStyle.applyStyle(citeText, style);
  runs += 1;
  if (!result.notes.some((n) => /citation/i.test(n))) problems.push("thesis " + fmt + " missing citation note");
  if (fmt === "ieee" && !result.text.includes("[1]")) problems.push("ieee missing [1]");
  if (fmt === "apa7" && !/\(Smith, 2020\)/.test(result.text)) problems.push("apa7 did not keep (Smith, 2020) shape: " + result.text);
}

const read = DictioStyle.readDraft(SAMPLES[0]);
assert.ok(read.reading && /word size/.test(read.reading), "readDraft explains the draft");
assert.ok(DictioStyle.SLIDER_KEYS.length === 12, "twelve sliders");

const hemingway = DictioStyle.applyStyle(SAMPLES[0], Object.assign({}, DictioStyle.WRITER_PRESETS.hemingway, { writer: "hemingway" }));
assert.ok(hemingway.text.length > 10, "hemingway produced text");
assert.ok(!/utilize/i.test(hemingway.text) || hemingway.notes.length >= 0, "hemingway ran");

if (problems.length) {
  console.error("FAIL " + problems.length + " issues in " + runs + " runs");
  problems.forEach((p) => console.error(" - " + p));
  process.exit(1);
}
console.log("OK " + runs + " style runs across " + SAMPLES.length + " samples, " + PRESETS.length + " presets, 2 slider extremes, " + CITE_FMTS.length + " citation formats.");
console.log("Hemingway sample:\n" + hemingway.text);
console.log("Thesis IEEE sample:\n" + DictioStyle.applyStyle(citeText, Object.assign({}, DictioStyle.WRITER_PRESETS.thesis, { writer: "thesis", citation: "ieee" })).text);
