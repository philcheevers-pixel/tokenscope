import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  useHostTheme,
} from "cursor/canvas";

export default function SolutionFirstPlan() {
  const theme = useHostTheme();

  return (
    <Stack gap={28} style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <Stack gap={8}>
        <H1>Solution-first research method</H1>
        <Text tone="secondary">
          Read-only test on Hubble and IGLI slices. No Google Docs were
          changed. Criteria were not written in advance: each problem below
          is asked from a claim already in the pile.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="info" active>
            Docs untouched
          </Pill>
          <Pill>Prototype slice</Pill>
          <Pill>27 Oct 2026, Toronto</Pill>
        </Row>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="6" label="Plan steps" />
        <Stat value="10" label="Claims extracted" />
        <Stat value="8" label="Problems proposed" />
        <Stat value="0" label="Docs modified" />
      </Grid>

      <Callout tone="info" title="The golf-ball rule">
        Start from a claim, fact, assertion, or joke already in the docs.
        Ask what world problem it could solve. Do not write a problem list
        first. If someone later recognizes the claim as their missing piece,
        that is a hit. If the problem has to be invented to make the claim
        look useful, throw the pairing out.
      </Callout>

      <Stack gap={10}>
        <H2>The plan</H2>
        <Text>
          Built for about 1.5 to 2 TB of Drive, four years of science
          writing, plus junk mail that must be parked, not deleted.
        </Text>
      </Stack>

      <Table
        headers={["Step", "What happens", "Output", "Do not"]}
        rows={[
          [
            "1. Gather",
            "Pull every claim, fact, assertion, and joke. Tag speaker: Phil, AI, or pasted. Tag type. Keep junk mail in a separate register with the same IDs so it can be found again.",
            "Claim cards. Junk-mail register. No deletions.",
            "Do not pre-filter by topic. Do not clean jokes out. Do not write into Drive.",
          ],
          [
            "2. Rank",
            "Score each card on specificity (a number, a named mechanism, a testable sentence) and recurrence (same idea in more than one doc or year).",
            "Ranked deck. High-specificity repeats rise first.",
            "Do not rank by how fashionable the topic is.",
          ],
          [
            "3. Ask",
            "For each top card: what problem does this already solve if someone else has it? Write the problem as a question that a stranger could recognize.",
            "Claim-to-problem pairs with confidence.",
            "Do not start from UN goals or a canned crisis list.",
          ],
          [
            "4. Anchor",
            "Force the first full pass through four keywords already in the pile: Hubble's constant (End of the Universe), Planck's limit, algorithms, IGLI (Glory Road / E74).",
            "Four seed clusters, not a complete inventory.",
            "Do not treat anchors as the only allowed topics.",
          ],
          [
            "5. Map",
            "After a few hundred cards exist, embed them and look at the white space between clusters. Empty space is a candidate for an unstated problem.",
            "Cluster map plus a short list of gaps.",
            "Do not embed 2 TB on day one. Science pile first.",
          ],
          [
            "6. Match",
            "The novel step: hold the claim still and hunt for a problem that fits it. Prototype on a small slice before any scale run.",
            "This canvas. Then a second slice.",
            "Do not automate matching until a human has rejected a few false pairs.",
          ],
        ]}
        striped
        stickyHeader
      />

      <Stack gap={8}>
        <H2>Test slice</H2>
        <Text>
          Two clusters only. Hubble from End of the Universe Module A (20 May
          2026) plus Skinny Club and the EOTU table of contents. IGLI from
          Phil's own words in Claude Backup AI Illness Extracts v2.0 (E74,
          E75, E80 to E84) and the Standing Rules leave-it line. Planck sat
          beside the slice as an anchor and was not the test subject.
        </Text>
      </Stack>

      <H3>Claims taken from the docs</H3>
      <Table
        headers={["ID", "Claim", "Type", "Source", "Recurrence"]}
        rowTone={[
          "info",
          "info",
          "info",
          "neutral",
          "success",
          "success",
          "success",
          "warning",
          "neutral",
          "warning",
        ]}
        rows={[
          [
            "H1",
            "v = H0 × d. H0 is about 70 km/s per megaparsec.",
            "Fact",
            "EOTU Module A: Hubble's Law",
            "High: TOC, recovery drafts, Module A",
          ],
          [
            "H2",
            "Galaxies are not racing like rockets. Space between us is growing.",
            "Assertion",
            "EOTU Module A",
            "Medium: Module A, expansion chapter notes",
          ],
          [
            "H3",
            "Space itself can expand faster than light. Einstein's limit is motion through space.",
            "Assertion",
            "EOTU Module A",
            "Medium",
          ],
          [
            "H4",
            "At about 4,300 Mpc, recession equals light speed. Beyond that, galaxies are already, in a small way, lonely.",
            "Assertion + joke",
            "EOTU Module A, last calculation",
            "High: Module A, Skinny Club Hubble horizon, TOC Hungry horizon",
          ],
          [
            "H5",
            "Club members share a structure: one-way, no thickness, no return. Chandrasekhar has a journey. These do not.",
            "Assertion",
            "THE SKINNY CLUB, ch. 1",
            "High: Skinny Club, EOTU Bucket 2",
          ],
          [
            "I1",
            "Oscar slew Igli by shoving an arm, then a leg, into its mouth until only grease remained. Geometric / binary cut of PONC. 1963.",
            "Story as method",
            "Illness Extracts E74, 29 Nov 2025",
            "High: E74, white papers, patent notes",
          ],
          [
            "I2",
            "Igli sometimes stands for I'm gonna leave it. That is the antithesis of quality.",
            "Assertion",
            "Illness Extracts E75, 29 Nov 2025",
            "High: E75, Standing Rules, Flying Geese I'll-get-it-later",
          ],
          [
            "I3",
            "Accept 70 percent, list the 30 percent still to do, squeeze toward grease on Oscar's hand. Do not lie that it is finished.",
            "Method",
            "E80, E81, E83, E84 (Jun 2026)",
            "High: Phil's own repeats",
          ],
          [
            "I4",
            "70 percent deterministic coverage is correct in development. Do not chase the last 2 percent. Residual must be observable.",
            "Rule",
            "AI Standing Rules v1.1",
            "High: rules + E84",
          ],
          [
            "J1",
            "Lava game: cracks are the boundaries, space between is lava. Occam's razor has no thickness so it fits in the Planck corridor.",
            "Joke kept",
            "THE SKINNY CLUB, ch. 1",
            "Low so far: one doc",
          ],
        ]}
        striped
      />

      <H3>Problems the claims appear to already solve</H3>
      <Text tone="secondary" size="small">
        Confidence is about the pairing, not about physics. High: the
        document is already doing this work. Medium: one step out from the
        wording. Low: a jump the document does not make.
      </Text>
      <Table
        headers={["Claim", "Problem it could already be a solution to", "Confidence", "Why"]}
        rowTone={[
          "success",
          "success",
          "info",
          "info",
          "warning",
          "success",
          "info",
          "warning",
        ]}
        rows={[
          [
            "H1 + Module A method",
            "How do you let a grade-12 student do real cosmology in ten minutes without turning the universe into spectacle?",
            "High",
            "The module states this as its reason for existing.",
          ],
          [
            "H2 + H3",
            "How do you stop people treating expansion as ordinary motion, which then makes faster-than-light recession look like a broken law?",
            "High",
            "Module A spends a whole section on this exact confusion.",
          ],
          [
            "H4",
            "How do you describe something that is real and permanently unreachable, without calling it gone?",
            "High",
            "Lonely is Phil's word. Hungry horizon in the TOC: moves one way, only takes.",
          ],
          [
            "H5",
            "How do you tell a zero-thickness one-way limit from a thick limit that still has a journey (collapse, waiting, a second crossing)?",
            "Medium",
            "Skinny Club is already sorting members by that rule. Not yet applied outside physics.",
          ],
          [
            "I1 + I3",
            "How do you shrink a messy remainder geometrically, instead of waiting for one fatal blow or a 100 percent first pass?",
            "High",
            "E74 and E84 say this in Phil's voice.",
          ],
          [
            "I2 + I4",
            "How do you stop the habit of I'll get it later from silently eating margin, quality, or an AI session?",
            "High",
            "E75 names the counter-quality move. Flying Geese uses the same leave-it sense on margin.",
          ],
          [
            "I3",
            "How do you keep a helper from declaring done while the leftover work is hidden?",
            "High",
            "E81: you don't make them lie. Thrilled at 70 percent with 30 percent bugs, then surgery.",
          ],
          [
            "J1",
            "How do you keep a joke that also does classification work (crack vs corridor, thickness vs idea)?",
            "Low as a world problem; keep the joke",
            "Parked, not discarded. Recurrence is still one document.",
          ],
        ]}
        striped
      />

      <Card>
        <CardHeader>White space between the two clusters</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text>
              Hubble's leftover is a galaxy that exists and will never send
              light. IGLI's leftover is grease on the hand: the last residue
              after geometric squeeze. Neither leftover is nothing. Neither
              is a finished job.
            </Text>
            <Text>
              The gap between those two clusters, if it is a problem at all,
              sounds like this: how do you treat a residue that the current
              instrument cannot recover, without deleting it and without
              pretending the work is complete?
            </Text>
            <Text tone="secondary" size="small">
              Speculative. This pairing is not written in any one doc. That
              is the point of looking at the space between clusters. Confidence
              is low until a third card lands in the same gap.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap={8}>
        <H2>What this test showed about the method</H2>
        <Text>
          The matching step works on a small slice if you stay greedy for
          the document's own question. Hubble Module A already knows what it
          is for. IGLI already knows what it is for. The method fails when
          I reach for a canned crisis (climate, alignment, education) that
          the claim did not ask to enter.
        </Text>
        <Text>
          Recurrence is doing real work. Lonely / hungry horizon appears in
          Module A, Skinny Club, and the EOTU TOC. IGLI leave-it versus
          squeeze-it appears in Nov 2025 speech, Jun 2026 speech, and the
          Standing Rules. Those are the cards to keep on the table.
        </Text>
        <Text>
          Algorithms as an anchor were not opened in this slice. Planck was
          read as a neighbor (Skinny Club, Planck outline, Module B) and
          held out of the pairing table so the prototype stayed small.
        </Text>
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>Next step</H2>
        <Text weight="semibold">
          Repeat the same six-step loop on Planck plus Skinny Club only.
          Same claim-card format. Same rule: no problem list in advance. No
          Drive writes.
        </Text>
        <Text>
          After that slice: write a junk-mail parking scheme (register, do
          not delete) and a claim-card template. Do not start a 2 TB
          embedding run until the science pile has a few hundred ranked
          cards and you have rejected some false pairs by hand.
        </Text>
      </Stack>

      <Text tone="tertiary" size="small">
        Sources: EOTU Part IV Module A Hubble's Law v1; EOTU Working TOC v3;
        THE SKINNY CLUB; Claude Backup AI Illness Extracts v2.0 (E74, E75,
        E80 to E84); AI Standing Rules and Governance Mandate v1.1. All
        times in the extracts are already Toronto. Nothing in Drive was
        edited.
      </Text>
    </Stack>
  );
}
