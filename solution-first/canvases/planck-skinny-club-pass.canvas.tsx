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

export default function PlanckSkinnyPass() {
  return (
    <Stack gap={28} style={{ maxWidth: 980, margin: "0 auto", padding: 24 }}>
      <Stack gap={8}>
        <H1>Solution-first test, Planck + Skinny Club</H1>
        <Text tone="secondary">
          Same six steps as this morning. Hubble Module A and the IGLI
          extracts stayed out. Drive was not changed. 27 Oct 2026, Toronto.
          Verdict marks updated 7:25 AM Eastern.
        </Text>
        <Row gap={8} wrap>
          <Pill tone="info" active>
            Docs untouched
          </Pill>
          <Pill>Planck + Skinny Club only</Pill>
          <Pill>Contested member is the new smell</Pill>
        </Row>
      </Stack>

      <Grid columns={4} gap={12}>
        <Stat value="10" label="Keep, finished" />
        <Stat value="3" label="Keep, in progress" />
        <Stat value="2" label="Beside" />
        <Stat value="2" label="Parked on the deck" />
      </Grid>

      <Callout tone="success" title="One-line verdict">
        The pattern holds. Planck already knows it is a floor that was never
        sold as a wall. Skinny Club already knows Planck is the odd member
        of a one-way family. The new smell is contested membership: a limit
        you cannot cross sitting next to limits you cross and cannot return
        from.
      </Callout>

      <Card>
        <CardHeader>Read this first — how to score a card</CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Text>
              A claim card is a sentence already in a doc. It is not a
              to-do. Read the legend, then the tables. Do not start from a
              problem list. If a pairing had to invent a crisis, it is
              discard.
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
              Keep, finished: the card can stand. Keep, in progress: still
              in, yellow light, missing work — look at it now. Beside: sits
              next to the main deck so you do not glue two jobs that share a
              word. Still in view. Not the same as parked. Parked: looked
              at, set aside for now, because other cards are worth a harder
              look first. Not thrown away. Discard: thrown out. Nothing in
              the P, S, or neighbor rows is discard.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Stack gap={8}>
        <H2>Docs used</H2>
        <Text>
          Method and pass-2 write-ups were read from this morning&apos;s
          canvases. Those two files are not on Drive under those names.
          Hubble Module A and the Illness Extracts were not opened.
        </Text>
      </Stack>

      <Table
        headers={["Doc", "Why it was in"]}
        rows={[
          [
            "Planck-Outline-v3",
            "The paper. Pencil length, metric axiom, vocabulary as evidence, LP/2, weasel word.",
          ],
          [
            "Planck-Outline-v4-Addendum",
            "LP-everywhere. 2LP correction. Thirty questions, nothing discarded.",
          ],
          [
            "THE SKINNY CLUB (ch. 1)",
            "The club rule. Planck contested. Lava game. Occam fits; Phil is not Occam.",
          ],
          [
            "The Skinny Club Pitch and Research",
            "Family of one-way limits. Corridor nobody talks about. Pitch logistics parked.",
          ],
          [
            "EOTU Module B — Planck Length",
            "Floor without a ruler. Ceiling of the book. Space held open for Phil's words.",
            ],
          [
            "Does This Harness Make Me Look Fat v2",
            "Same word, other job: irreducible shape. IGLI lines were not harvested.",
          ],
          [
            "The Planck Surface 1",
            "2LP again. Structural inertia. Grok-adjacent; kept, ranked lower.",
          ],
          [
            "Word pool spreadsheet",
            "Planck as wall or warning sign. Below-the-floor word still blank. Bucket.",
          ],
        ]}
        striped
      />

      <H2>Top claims</H2>
      <Text tone="secondary" size="small">
        Ranked on specificity and recurrence, not fashion. Speaker is Phil
        unless noted. Jokes stayed in. Verdict is the scoring layer; the
        claims are unchanged.
      </Text>
      <Table
        headers={["ID", "Claim", "Type", "Recurrence", "Verdict"]}
        rowTone={[
          "success",
          "success",
          "success",
          "success",
          "info",
          "warning",
          "warning",
          "warning",
          "success",
          "info",
          "neutral",
          "info",
          "neutral",
          "neutral",
        ]}
        rows={[
          [
            "P1",
            "LP = √(ħG/c³) ≈ 1.616×10⁻³⁵ m. 1899, no ruler. Planck did not call it a minimum. Later people did.",
            "Fact",
            "High: v3, Module B, Surface 1",
            "Keep, finished",
          ],
          [
            "P2",
            "If LP and zero are different places, the distance between them cannot be zero. d(LP, 0) = 0 while LP ≠ 0.",
            "Assertion",
            "High: v3 one-true-sentence, 42-metre joke, Skinny Club corridor",
            "Keep, finished",
          ],
          [
            "P3",
            "LP/2 is a length in the corridor. LP² was the wrong vehicle (m², not m). Instinct survived.",
            "Method + fact",
            "Medium: explicit in v3; density is Cantor",
            "Keep, finished",
          ],
          [
            "P4",
            "Foam, granular, discrete all need space. None of the camps said empty. They said inaccessible, undefined, or different.",
            "Assertion",
            "High: v3 hinge, Skinny Club other-theories list",
            "Keep, finished",
          ],
          [
            "P5",
            "Meaningful is doing the work. What they mean is operationally inaccessible: the probe buries its subject.",
            "Assertion",
            "Medium: v3 weasel-word section",
            "Keep, finished",
          ],
          [
            "P6",
            "State may only exist on one side of LP. The grammar of at 10⁻³⁶ m works. The referent may not.",
            "Assertion",
            "Medium: v3, new this pass",
            "Keep, in progress",
          ],
          [
            "P7",
            "LP is the birth certificate of distance. Switch, or crystallize. The corridor may be where distance comes from.",
            "Assertion",
            "Medium: v3 Q8/Q10, addendum emergence",
            "Keep, in progress",
          ],
          [
            "P8",
            "Electromagnetism has no seat in LP because α has no units. k might, because Hawking's T already seats it.",
            "Fact + open Q",
            "High inside the Planck pile; marked NEEDS WORK for k",
            "Keep, in progress",
          ],
          [
            "P9",
            "We do not know what is in the corridor. That is the paper's most important sentence.",
            "Assertion",
            "High: v3, Skinny Club I still do not",
            "Keep, finished",
          ],
          [
            "P10",
            "Planck-mass Schwarzschild radius is 2LP, not LP. Corrected in session. Kept as an improvement.",
            "Fact",
            "High: v4 addendum, Surface 1",
            "Keep, finished",
          ],
          [
            "P11",
            "LP is everywhere, not one ledge. Substrate of every point. Cantor: same size as space. Conjecture.",
            "Assertion",
            "Medium: addendum late; Surface says universal boundary",
            "Parked",
          ],
          [
            "S1",
            "Club members share one grammar: one-way, zero thickness, no return. Chandrasekhar has a journey. These do not.",
            "Assertion",
            "High: ch. 1, pitch, this morning's H5",
            "Keep, finished",
          ],
          [
            "S2",
            "Planck is the contested member. You cannot even cross. Rules change before you arrive. Event horizon is here, then there.",
            "Assertion",
            "High for this slice. The new card.",
            "Keep, finished",
          ],
          [
            "S3",
            "Planck-to-zero is not lava between two cracks. It is a corridor to nothing. Occam's razor fits. Phil is not Occam. He kept it open.",
            "Joke + rule",
            "High: ch. 1, pitch nobody talks about, word-pool blank",
            "Keep, finished",
          ],
        ]}
        striped
      />

      <H3>Neighbor cards, not mashed in</H3>
      <Table
        headers={["ID", "Claim", "Why it sat beside the slice", "Verdict"]}
        rows={[
          [
            "H1",
            "A harness Planck limit is the irreducible shape. Compression is not bloat. Quiet. Cleaning is not enough.",
            "Same word, other job. IGLI sentences were left in the held-out pile.",
            "Beside",
          ],
          [
            "B1",
            "Planck found a floor. The book finds a ceiling. Both from the units, not a lab. Space held for Phil's own words.",
            "Module B. Floor/ceiling pair is this book's, not the paper's.",
            "Beside",
          ],
          [
            "W1",
            "Word pool: Planck is a wall or a warning sign. The word for smaller-than-everything is still blank. Bucket means nothing is thrown away.",
            "Looked at. The blank word can wait. Harder look goes to P and S.",
            "Parked",
          ],
        ]}
        striped
      />

      <H2>Problem pairings</H2>
      <Text tone="secondary" size="small">
        Problems were not listed first. If the pairing needed a canned
        crisis, it was thrown out.
      </Text>
      <Table
        headers={["From", "Problem it already seems to solve", "Confidence", "Verdict"]}
        rowTone={[
          "success",
          "success",
          "success",
          "success",
          "info",
          "info",
          "warning",
          "success",
          "neutral",
          "info",
        ]}
        rows={[
          [
            "P1",
            "How do you find a real boundary without an instrument, and stop later people promoting it into a wall it never claimed to be?",
            "High. Module B and v3 both say this.",
            "Keep, finished",
          ],
          [
            "P2 + P3",
            "How do you talk about a floor without claiming two different numbers are the same point, or that the space below is empty?",
            "High. The 42-metre joke is the test.",
            "Keep, finished",
          ],
          [
            "P4",
            "How do you use a field's own metaphors as evidence when the picture and the formal claim disagree?",
            "High. v3 calls this the hinge.",
            "Keep, finished",
          ],
          [
            "P5",
            "How do you stop an undefined word from doing the work of a proof?",
            "High as a work habit. Medium as physics.",
            "Keep, finished",
          ],
          [
            "P6",
            "How do you notice a question that is grammatically fine and physically empty, without calling the speaker stupid?",
            "High for the formulation. Medium until a third card lands.",
            "Keep, in progress",
          ],
          [
            "P7 + P9 + S3",
            "How do you treat a residue that might be where the thing itself comes from, without filling it with foam you already cut away, and without letting Occam close it?",
            "High. This is this morning's residue smell with a door on it.",
            "Keep, finished",
          ],
          [
            "P8",
            "How do you notice a missing force in a formula that looks complete, without stuffing a fashionable extra constant in?",
            "Medium. k is tagged NEEDS WORK in the source.",
            "Keep, in progress",
          ],
          [
            "S1 + S2",
            "How do you keep a limit you cannot cross in the same family as limits you cross and cannot return from, without forcing them to be the same door?",
            "High. This is the new pairing. Skinny Club already wrote it.",
            "Keep, finished",
          ],
          [
            "P11",
            "How do you talk about a floor that is not one ledge but the substrate of every point, without inflating a late-session reframe into a law?",
            "Medium as a world problem. Source says do not build on it hastily.",
            "Parked",
          ],
          [
            "H1",
            "How do you know another cut would break the rule-set? How do you stop four copies of the same ban?",
            "High for harness work. Do not paste it onto spacetime.",
            "Beside",
          ],
        ]}
        striped
      />

      <Card>
        <CardHeader>White space between the two clusters</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text>
              Other club members have an other side: tachyons, the interior
              of a hole, galaxies that exist and will not send light.
              Planck&apos;s other side is not another country. It is the
              basement of the floor.
            </Text>
            <Text>
              The gap, if it is a problem at all: how do you put a door you
              cannot walk through in a club of doors that only swing one
              way — and still let the corridor be a member, not a hole in
              the membership list.
            </Text>
            <Text>
              Second gap, thinner: harness Planck means quiet and done.
              Physics Planck means we do not know. Same name. Two jobs.
              Mash them and both go false.
            </Text>
            <Text tone="secondary" size="small">
              The contested-member pairing is already in chapter 1 and is
              Keep, finished as S1 + S2. The extra between-cluster sentence
              is Parked. The harness warning is Beside, not Parked.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>What smelled promising</CardHeader>
        <CardBody>
          <Stack gap={8}>
            <Text>
              Contested membership. Planck does not cross. The others do,
              once, and do not come back. The club still holds if that
              difference is named, not sanded off.
            </Text>
            <Text>
              Residue still holds. Corridor, LP/2, vocabulary witness, and
              we do not know sit in the same gap as this morning&apos;s
              leftover that is not nothing.
            </Text>
            <Text>
              Third smell, keep separate: irreducible shape. Useful for
              harness work. Do not use it to declare the physics corridor
              empty. Phil already refused Occam on that.
            </Text>
          </Stack>
        </CardBody>
      </Card>

      <H2>Parked, not discarded</H2>
      <Text tone="secondary" size="small">
        Looked at. Set aside for now. Other cards get the harder look.
        Same IDs later. Not Discard.
      </Text>
      <Table
        headers={["Item", "Where", "Why parked", "Verdict"]}
        rows={[
          [
            "Brockman / agents / publishers / query order",
            "Pitch doc",
            "Logistics. Same IDs later. Not a science claim.",
            "Parked",
          ],
          [
            "H0 as a fourth leg of LP",
            "v3 §6.5",
            "Phil already said unlikely. Hubble Module A was held out anyway.",
            "Parked",
          ],
          [
            "Harvestable energy below LP",
            "v3 §6.3",
            "Engineering before the prior question. Too far ahead.",
            "Parked",
          ],
          [
            "Structural inertia / 5th force / 0.0777% delta",
            "Planck Surface 1",
            "Grok-adjacent sidebar. 2LP overlap was kept. The rest waits.",
            "Parked",
          ],
          [
            "LP-everywhere world models",
            "v4 addendum",
            "Source says dedicated session. Not a law yet.",
            "Parked",
          ],
        ]}
        striped
      />

      <Callout tone="neutral" title="Discard — not a claim card">
        Climate, alignment, education, and any pairing that had to invent
        a crisis so the claim would look useful. Same golf-ball rule. These
        never got an ID. They are the only Discard row.
      </Callout>

      <Divider />
      <Stack gap={8}>
        <H2>What this pass did to the method</H2>
        <Text>
          Matching still works when the slice is one contested member plus
          the family that wants to hold it. The problems were already in
          chapter 1 and in the one-true-sentence. Recurrence did real work:
          no ruler, not a minimum, corridor not empty, 2LP, we do not know.
        </Text>
        <Text>
          False pair to mark: harness Planck is not physics Planck. If a
          later automated matcher glues those, reject it by hand.
        </Text>
        <Text weight="semibold">
          Next, from this morning&apos;s plan: a junk-mail parking scheme
          (register, do not delete) and a claim-card template. Do not start
          a 2 TB embedding run.
        </Text>
      </Stack>

      <Text tone="tertiary" size="small">
        Sources read only: Planck-Outline-v3, v4 addendum, THE SKINNY CLUB
        ch. 1, Skinny Club Pitch, EOTU Module B, Harness v2, Planck Surface
        1, Word pool. Method from this morning&apos;s canvases. Nothing in
        Drive was edited.
      </Text>
    </Stack>
  );
}
