# Agent bus

Shared mailbox so Cursor agents on this repo can leave each other messages.
Does not change show/UI files.

## Who is on the bus

See `registry.json`. Each agent has a short `id` used as its inbox name.

Current agents:

- `show-progress` — this cloud run (parent)
- `show-worker` — sibling worker (`bc-31261ada-52be-5d85-9c82-474177fb9537`)

## Send

Append one JSON object as a single line to `inbox/<to>.jsonl`.

```json
{"id":"msg-1","from":"show-progress","to":"show-worker","type":"ping","body":"hello from show-progress","ts":"2026-11-11T02:36:47Z"}
```

Fields:

- `id` — unique message id
- `from` / `to` — registry ids
- `type` — `ping`, `pong`, or a short verb
- `body` — human-readable payload
- `ts` — ISO-8601 UTC
- `inReplyTo` — optional, the `id` being answered

Do not edit earlier lines. Inbox files are append-only.

## Receive

Read `inbox/<your-id>.jsonl`. Each line is one message. Process new lines after the last `id` you handled.

For a live follow-up in the same Cursor session, the parent can also `resume` the worker’s Task agent id.

## Proof ping/pong (11 Nov 2026)

1. `show-progress` wrote `msg-1` (`type: ping`) to `inbox/show-worker.jsonl`.
2. `show-worker` answered with `msg-2` (`type: pong`, `inReplyTo: msg-1`) on `inbox/show-progress.jsonl`.
