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
} from "cursor/canvas";

export default function PassTwo() {
  return (
    <Stack gap={28} style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <Stack gap={8}>
        <H1>Solution-first test, pass 2</H1>
        <Text tone="secondary">
          Nine docs past Hubble Module A and the IGLI extracts. Fiction and
          jokes stayed in. Drive was not changed. 27 Oct 2026, Toronto.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="info" active>
            Docs untouched
          </Pill>
          <Pill>Nine new docs</Pill>
          <Pill>Residue reinforced</Pill>
        </Row>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="9" label="Docs in this pass" />
        <Stat value="12" label="Claims ranked" />
        <Stat value="3" label="Smells kept" />
        <Stat value="Holds" label="Pattern verdict" />
      </Grid>

      <Callout tone="success" title="One-line verdict">
        The pattern holds: start from the claim, and the problem is usually
        already sitting in the same paragraph.
      </Callout>

      <Stack gap={8}>
        <H2>Docs used</H2>
        <Text>
          Hubble Module A and the Illness Extracts IGLI pages were left out
          on purpose. Anchors still appear because other docs carry them.
        </Text>
      </Stack>

      <Table
        headers={["Doc", "Why it was in"]}
        rows={[
          [
            "WireAlgorithm Three Languages v1.3",
            "Algorithms. Same sentence on four wires. Pencil-countable tokens.",
          ],
          [
            "The Argument You Had With AI Last Week Has a Name",
            "Algorithms. Aversion, prompt scrapping, authorship.",
          ],
          [
            "Planck-Outline-v3",
            "Planck. Floor versus emptiness. Vocabulary as evidence.",
          ],
          [
            "While we wait — Beckett",
            "Story beat. Godot does not arrive. Neither does the end.",
          ],
          [
            "Does time end at the end of the Universe?",
            "Story beat plus claim. Time completed, not destroyed.",
          ],
          [
            "Does This Harness Make Me Look Fat v2",
            "Joke. IGLI and Planck show up inside a harness story.",
          ],
          [
            "Raquel white paper v1.2",
            "Algorithms. Classify, pick a representation, attenuate the test space.",
          ],
          [
            "The Skinny Club Pitch and Research",
            "Family of one-way limits. Corridor nobody talks about.",
          ],
          [
            "Word pool spreadsheet",
            "Jokes and parked words. Bucket means nothing is thrown away.",
          ],
        ]}
        striped
      />

      <H2>Top claims</H2>
      <Table
        headers={["ID", "Claim", "Type", "Recurrence"]}
        rowTone={[
          "success",
          "success",
          "info",
          "info",
          "neutral",
          "info",
          "success",
          "info",
          "warning",
          "warning",
          "info",
          "neutral",
        ]}
        rows={[
          [
            "R1",
            "Residue is not nothing: lonely points, grease, Godot, the score after the music.",
            "Assertion + story",
            "High, now across both passes",
          ],
          [
            "R2",
            "Reduce to the irreducible shape. Harness Planck limit is quiet. Allusions are not bloat.",
            "Method + joke",
            "High",
          ],
          [
            "R3",
            "Time is the bookkeeping of change. Completed, not destroyed.",
            "Assertion",
            "High",
          ],
          [
            "P1",
            "d(LP, 0) = 0 while LP ≠ 0. The 42-metre joke. Category change, not emptiness.",
            "Assertion + joke",
            "High",
          ],
          [
            "P2",
            "Planck found a length without a ruler. He did not call it a minimum.",
            "Fact",
            "Medium",
          ],
          [
            "P3",
            "Foam and granular still need space. Vocabulary is evidence.",
            "Assertion",
            "High",
          ],
          [
            "A1",
            "Swahili costs more on technical content. Floor is English. Code notation wins on long specs.",
            "Fact",
            "High",
          ],
          [
            "A2",
            "Classify, pick a wire, encode. Attenuation defends a cut in a huge test space.",
            "Method",
            "Medium",
          ],
          [
            "A3",
            "Algorithm aversion is authorship, not accuracy. Prompt scrapping looks like rigor.",
            "Assertion",
            "Medium",
          ],
          [
            "S1",
            "Godot does not arrive. Neither does the end, not on our clock.",
            "Story beat",
            "Medium",
          ],
          [
            "S2",
            "One-way, zero thickness, no return. The Planck-to-zero corridor is the quiet member.",
            "Assertion",
            "High",
          ],
          [
            "J1",
            "Bucket: nothing is thrown away. The word for smaller-than-everything is still blank.",
            "Joke + rule",
            "Medium",
          ],
        ]}
        striped
      />

      <H2>Problem pairings</H2>
      <Text tone="secondary" size="small">
        Problems were not listed first. When residue smelled good, more
        solutions were added to it.
      </Text>
      <Table
        headers={["From", "Problem it already seems to solve", "Confidence"]}
        rowTone={[
          "success",
          "success",
          "success",
          "info",
          "info",
          "info",
          "info",
          "warning",
          "info",
          "neutral",
        ]}
        rows={[
          [
            "R1 + S1 + R3",
            "How do you treat something real and unfinished, without deleting it and without calling it done?",
            "High",
          ],
          [
            "R1 extra",
            "How do you give a reader something honest to do while the last event refuses to arrive?",
            "High",
          ],
          [
            "R2",
            "How do you know another cut would break the rule-set? How do you stop four copies of the same ban?",
            "High for harness work",
          ],
          [
            "P1",
            "How do you talk about a floor without claiming the space below it is empty?",
            "High",
          ],
          [
            "P2",
            "How do you keep a derived number from being promoted into a wall it never claimed to be?",
            "Medium as a general rule",
          ],
          [
            "P3",
            "How do you use a field's own metaphors as evidence when the picture and the formal claim disagree?",
            "High",
          ],
          [
            "A1 + A2",
            "How do you pick a wire from the content type, and fall back to English when compression goes negative?",
            "High",
          ],
          [
            "A2 extra",
            "How do you cut a combinatorial test space and still defend the cut?",
            "Medium (same shape as IGLI squeeze)",
          ],
          [
            "A3",
            "How do you argue with a model without shopping for cover?",
            "High as a work habit",
          ],
          [
            "S2 + J1",
            "How do you put one-way limits in one room, and park a missing word without deletion?",
            "High for pile hygiene",
          ],
        ]}
        striped
      />

      <Card>
        <CardHeader>What smelled promising</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text>
              Residue held. It is no longer only a lonely galaxy and grease
              on a hand. Beckett's wait, time completed not destroyed, the
              harness Planck limit, and Raquel's attenuation sit in the same
              gap.
            </Text>
            <Text>
              Second smell: representation. Same meaning, different wire,
              different cost, different trust. Pencil math, code notation,
              five-word allusions, same advice from a different source.
            </Text>
            <Text>
              Third smell, thinner: vocabulary as evidence. Foam words, song
              versus score, prompt scrapping in a lab coat. Parked, not
              discarded.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Divider />
      <Text tone="tertiary" size="small">
        Full write-up is in the workspace file solution-first-pass-2.md.
        Nothing in Drive was edited.
      </Text>
    </Stack>
  );
}
