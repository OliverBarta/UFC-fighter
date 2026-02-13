import json
import requests
import time

WIKI_API = "https://en.wikipedia.org/w/api.php"
HEADERS = {
    "User-Agent": "UFC-Fighter-Image-Fetcher/1.0 (contact: barta3738@gmail.com)"
}

def get_wikipedia_image(name):
    params = {
        "action": "query",
        "titles": name,
        "prop": "pageimages",
        "piprop": "original",
        "format": "json"
    }

    try:
        r = requests.get(
            WIKI_API,
            params=params,
            headers=HEADERS,
            timeout=10
        )

        data = r.json()

        pages = data["query"]["pages"]
        page = next(iter(pages.values()))
        
        if "original" in page:
            return page["original"]["source"]

    except Exception as e:
        print(f"Error for {name}: {e}")

    return ""


# Load json
with open("fighters.json", "r", encoding="utf-8") as f:
    fighters = json.load(f)

# go through each fighter
for i, fighter in enumerate(fighters):
    if fighter.get("image", "") == "":
        print(f"[{i+1}/{len(fighters)}] Searching image for {fighter['name']}")

        image_url = get_wikipedia_image(fighter["name"])
        print(image_url)
        fighter["image"] = image_url

        time.sleep(0.5)  # if you go too fast you get blocked

# save
with open("fighters.json", "w", encoding="utf-8") as f:
    json.dump(fighters, f, indent=4)

print("Done.")
