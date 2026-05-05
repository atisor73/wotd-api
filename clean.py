import pandas as pd
import json

df = pd.read_excel("words.xlsx")

words = (
    df["word"]
    .dropna()
    .astype(str)
    .str.strip()
    .str.lower()
    .drop_duplicates()
    .tolist()
)

with open("words.json", "w") as f:
    json.dump(words, f, indent=2)
