import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
} from "cursor/canvas";

export default function P1SweepBatch1() {
  return (
    <Stack gap={28} style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <Stack gap={8}>
        <H1>P1 sweep — batch 1</H1>
        <Text tone="secondary">
          Pattern: a real boundary found without an instrument, later
          promoted into a wall it never claimed to be. Drive was read-only.
          27 Oct 2026, Toronto. Not a thousand-file read.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="info" active>
            Docs untouched
          </Pill>
          <Pill>Science pile first</Pill>
          <Pill>Same verdict marks</Pill>
        </Row>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="~40" label="Search hits screened" />
        <Stat value="11" label="Scored this batch" />
        <Stat value="3" label="Keep, finished" />
        <Stat value="4" label="Keep, in progress" />
      </Grid>

      <Card>
        <CardHeader>Read this first</CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              P1 is not “find every limit.” It is: someone derived a real
              boundary from units, logic, or a pencil. Later writers treated
              it as a wall, a minimum, or a ban it did not claim. If the
              pairing needs a canned crisis, it is Discard.
            </Text>
            <Row gap={8} wrap>
              <Pill tone="success" active>
                Keep, finished
              </Pill>
              <Pill tone="warning" active>
                Keep, in progress
              </Pill>
              <Pill tone="info" active>
                Beside
              </Pill>
              <Pill tone="renamed" active>
                Parked
              </Pill>
              <Pill tone="neutral" active>
                Discard
              </Pill>
            </Row>
            <Text size="small">
              This batch searched by pattern, not by opening every file.
              Medical, junk, ChatGPT dump zips, and patent FTO “did not
              claim” language were parked as the wrong family. Next batches:
              07 BOOKS, Voyager, ARGUING WITH AI, fresh writing.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Callout tone="success" title="What this batch found">
        The seed still holds. Planck without a ruler, later called a
        minimum, is the clean hit. Skinny Club and Module B already know
        it. The new work is seeing the same inflation inside later Phil
        writing: harness Planck as “the universe stops cooperating.”
      </Callout>

      <H2>Ranked matches</H2>
      <Table
        headers={["Rank", "Doc", "P1 fit", "Verdict"]}
        rowTone={[
          "success",
          "success",
          "success",
          "warning",
          "warning",
          "info",
          "warning",
          "neutral",
          "neutral",
          "neutral",
          "info",
        ]}
        rows={[
          [
            "1",
            "Planck-Outline-v3",
            "Derived LP with no ruler. He did not call it a minimum. Later people did. This is the seed.",
            "Keep, finished",
          ],
          [
            "2",
            "THE SKINNY CLUB, ch. 1",
            "Some theories treat Planck as the smallest grain. Phil keeps it contested. Chandrasekhar is the counterexample with a journey.",
            "Keep, finished",
          ],
          [
            "3",
            "EOTU Module B — Planck Length",
            "Floor from units, not a lab. He did not say what lies beyond. Space held for Phil's words.",
            "Keep, finished",
          ],
          [
            "4",
            "Does This Harness Make Me Look Fat v2",
            "Later Phil writing uses Planck as smallest possible, universe stops cooperating. That is the inflation, in-house. Do not mash onto spacetime.",
            "Keep, in progress",
          ],
          [
            "5",
            "EOTU Module A — Hubble (held out of last slice, in this sweep)",
            "Pencil law, later talked about as an edge. Same shape as P1, different member of the club. Not opened this morning.",
            "Keep, in progress",
          ],
          [
            "6",
            "Skinny Club pitch — corridor nobody talks about",
            "Names the family. Speed of light / horizon / Bekenstein as one-way limits. Watch for later wall-talk on those members.",
            "Beside",
          ],
          [
            "7",
            "Word pool — Planck as wall or warning sign",
            "The blank word for smaller-than-everything. Looked at. Harder look stays on 1–3.",
            "Parked",
          ],
          [
            "8",
            "Planck Surface 1 — Structural Inertia",
            "A later framework laid on LP. Grok-adjacent. 2LP overlap already kept. Rest waits.",
            "Parked",
          ],
          [
            "9",
            "AI Standing Rules — 70 percent floor",
            "Same shape (floor, not a lie that it is finished) but IGLI cluster. Sibling, not P1.",
            "Parked",
          ],
          [
            "10",
            "Patent / FTO docs saying did not claim",
            "Legal claim-scope, not a derived physical boundary. Wrong family.",
            "Parked",
          ],
          [
            "11",
            "Climate / alignment / education pairings",
            "Invented crisis so the claim looks useful. Golf-ball rule.",
            "Discard",
          ],
        ]}
        striped
      />

      <H2>What was not this batch</H2>
      <Table
        headers={["Pile", "Why skipped now"]}
        rows={[
          [
            "07 BOOKS / Mental Health / EOTU recovery dumps",
            "Next science batch. Too large to fake-read.",
          ],
          [
            "Voyager I The Machine That Shouldn't Still Be Working",
            "Hit on speed of light. Park for batch 2.",
          ],
          [
            "ChatGPT zip dumps, MASTER BUCKET INDEX",
            "Too big for this pass. Register, do not delete.",
          ],
          [
            "013 PROBABLY JUNK, medical, lawyers, merch",
            "Junk-mail register. Same IDs later.",
          ],
        ]}
        striped
      />

      <Callout tone="info" title="How the automation runs">
        Repeat the same queries on the next folder. Score only hits that
        have both halves: a real derived boundary, and a later wall. Write
        results here, not in Drive. Recipe is also in P1-SWEEP.md in this
        project.
      </Callout>

      <Divider />
      <Text tone="tertiary" size="small">
        Queries used: did not claim minimum; without a ruler Planck; Planck
        did not claim; physical floor later interpretation; Schwarzschild
        Wall; speed of light cannot be crossed. Nothing in Drive was
        edited.
      </Text>
    </Stack>
  );
}
