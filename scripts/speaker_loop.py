#!/usr/bin/env python3
"""Local speaker loop for Pink House 111.

Polls the live board. When a task is waiting on Phil's approval, writes a
one-line nudge into say.txt (this folder, or $SAY_FILE) so a local speaker
can read it aloud.

Usage:
  python3 scripts/speaker_loop.py
  SAY_FILE=/path/to/say.txt python3 scripts/speaker_loop.py
"""
from __future__ import annotations

import json
import os
import re
import sys
import time
import urllib.request

BOARD = os.environ.get("BOARD_URL", "https://pinkhouse.tech/111/tasks.json")
SAY_PUSH = os.environ.get("SAY_PUSH", "https://pinkhouse.tech/111/say.php")
HERE = os.path.dirname(os.path.abspath(__file__))
SAY_FILE = os.environ.get("SAY_FILE", os.path.join(HERE, "..", "site", "111", "say.txt"))
INTERVAL = int(os.environ.get("POLL_SECONDS", "8"))

WAIT_RE = re.compile(r"awaiting|approval|waiting on phil|\bok\b|photonews|toronto star", re.I)


def load_tasks():
    req = urllib.request.Request(BOARD + "?t=" + str(int(time.time())), headers={"Cache-Control": "no-store"})
    with urllib.request.urlopen(req, timeout=20) as r:
        data = json.loads(r.read().decode())
    return data.get("tasks") or []


def nudge_from(tasks):
    hits = []
    for t in tasks:
        if t.get("status") == "done":
            continue
        blob = " ".join([t.get("name") or "", t.get("notes") or "", t.get("waitingOn") or ""])
        waiting = t.get("status") == "waiting" or WAIT_RE.search(blob)
        if waiting:
            hits.append(t.get("name") or "unnamed task")
    if not hits:
        return ""
    return "Phil, an approval is waiting: " + "; ".join(hits[:3]) + "."


def write_local(text):
    path = os.path.abspath(SAY_FILE)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(text)
    os.replace(tmp, path)


def push_remote(text):
    body = json.dumps({"text": text}).encode()
    req = urllib.request.Request(
        SAY_PUSH,
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        r.read()


def main():
    last = None
    print("speaker_loop watching", BOARD, "->", os.path.abspath(SAY_FILE), file=sys.stderr)
    while True:
        try:
            text = nudge_from(load_tasks())
            if text != last:
                write_local(text)
                try:
                    push_remote(text)
                except Exception as e:
                    print("remote say.php failed:", e, file=sys.stderr)
                print(text or "(idle)", file=sys.stderr)
                last = text
        except Exception as e:
            print("poll failed:", e, file=sys.stderr)
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
