# Adds the wikipedia image urls, so that all fighters have urls

import json
import requests
import time

WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary/"

with open("fighters.json", "r", encoding="utf-8") as f:
    fighters = json.load(f)

updated = 0
skipped = 0

for fighter in fighters:
    name = fighter.get("name", "").strip()

    # Skip if image already exists
    if fighter.get("image"):
        skipped += 1
        continue

    url = WIKI_API + name.replace(" ", "_")

    try:
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            thumbnail = data.get("thumbnail", {}).get("source")

            if thumbnail:
                fighter["image"] = thumbnail
                updated += 1
            else:
                fighter["image"] = ""
        else:
            fighter["image"] = ""

    except Exception as e:
        fighter["image"] = ""

    # Be nice to Wikipedia
    time.sleep(0.3)

with open("fighters.json", "w", encoding="utf-8") as f:
    json.dump(fighters, f, indent=4)

print(f"Done! Added images: {updated}, skipped existing: {skipped}")
