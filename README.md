Workflow:
Workflow:
- update `words.xlsx`. script is expecting word column to be named 'word'
- run `python clean.py` to update `words.json`

Options:
- 1. public word source on gh pages (private account hosting needs pro account)
- 2. GH pages frontend calls Cloudflare worker function to check a private list that returns T/F and similar matches (example response: {'exists':false, 'similar':["oranges"]}
- 3. some other server


Possible add-ons:
- for old words add (date used, ID#)
- viewer of all past years (buttons to sort by date/year, alphabetically, clusters, etc.)
