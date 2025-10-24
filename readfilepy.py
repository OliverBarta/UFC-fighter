#this just sets up the json
import csv
import json

data = []
with open('ufc-fighters-statistics.csv', 'r', newline='') as file:
    reader = csv.DictReader(file)
    for row in reader:
        data.append(row)

with open('fighters.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)
