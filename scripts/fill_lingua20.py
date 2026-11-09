#!/usr/bin/env python3
"""Merge the live Lingua20 API harvest into the publications CSV.

Reads /tmp/lingua20.csv and /tmp/lingua20-api.json when present.
Writes site/pitching/publications.json.
Sheet writes are done separately through Drive tools so this script
never needs Google credentials on the droplet.
"""
from __future__ import annotations

import csv
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
CSV_IN = Path("/tmp/lingua20.csv")
API_IN = Path("/tmp/lingua20-api.json")
JSON_OUT = ROOT / "site" / "pitching" / "publications.json"

COUNTRY_MAP = {
    "us": "United States",
    "usa": "United States",
    "united states": "United States",
    "ca": "Canada",
    "canada": "Canada",
    "mx": "Mexico",
    "mexico": "Mexico",
    "gb": "United Kingdom",
    "uk": "United Kingdom",
    "united kingdom": "United Kingdom",
    "au": "Australia",
    "australia": "Australia",
}
TLD_COUNTRY = {
    "edu": "United States",
    "gov": "United States",
    "ca": "Canada",
    "uk": "United Kingdom",
    "au": "Australia",
    "nz": "New Zealand",
    "ie": "Ireland",
    "mx": "Mexico",
    "es": "Spain",
    "de": "Germany",
    "fr": "France",
    "nl": "Netherlands",
    "jp": "Japan",
    "br": "Brazil",
    "in": "India",
    "za": "South Africa",
}


def norm_country(v: str) -> str:
    s = (v or "").strip()
    if not s or s.lower() in ("unknown", "any"):
        return ""
    return COUNTRY_MAP.get(s.lower(), s)


def tld_country(url: str) -> str:
    if not url:
        return ""
    u = url.strip()
    if "://" not in u:
        u = "http://" + u
    try:
        host = (urlparse(u).hostname or "").lower()
    except Exception:
        return ""
    if not host:
        return ""
    tld = host.split(".")[-1]
    if tld in ("com", "org", "net", "io", "info"):
        return ""
    return TLD_COUNTRY.get(tld, "")


def main() -> None:
    api = {}
    if API_IN.exists():
        for row in json.loads(API_IN.read_text()):
            name = (row.get("name") or "").strip()
            if name:
                api[name] = row
    rows = []
    with CSV_IN.open(newline="", encoding="utf-8", errors="replace") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    pub = []
    for row in rows:
        name = (row.get("Name") or "").strip()
        api_row = api.get(name) or {}
        country = norm_country(row.get("Country") or "")
        website = (row.get("Website") or "").strip()
        pays = (row.get("Pays") or "").strip()
        if pays.lower() == "unknown":
            pays = ""
        if not country:
            country = norm_country(api_row.get("country") or "")
        if not website:
            website = (api_row.get("website") or "").strip()
        api_p = (api_row.get("pays") or "").strip()
        if not pays and api_p in ("Yes", "No"):
            pays = api_p
        if not country:
            country = tld_country(website)
        if not country and "SEGOB" in (row.get("Source") or ""):
            country = "Mexico"
        rec = {
            "name": name,
            "website": website,
            "source": row.get("Source") or "",
            "sourceUrl": row.get("SourceURL") or "",
            "country": country or "Unknown",
            "jurisdiction": row.get("Jurisdiction") or "",
            "language": row.get("Language") or "",
            "genre": row.get("Genre") or "",
            "pays": pays or "Unknown",
        }
        pub.append(rec)
    JSON_OUT.parent.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(pub, separators=(",", ":")))
    print("wrote", JSON_OUT, "rows", len(pub))


if __name__ == "__main__":
    main()
