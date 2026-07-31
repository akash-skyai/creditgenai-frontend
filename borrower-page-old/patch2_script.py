import sys

html_path = "c:/Users/premk/Downloads/v5 final borrower form/v5/index.html"
patch_path = "c:/Users/premk/Downloads/v5 final borrower form/v5/patch2.html"

with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

start_token = "<!-- Expandable Direct Upload Files Section (Revealed when Upload Now is clicked) -->"
start_idx = html.find(start_token)
if start_idx == -1:
    print("Could not find start idx")
    sys.exit(1)

end_token = "<!-- STEP 4: Review &amp; Submit Application -->"
end_idx = html.find(end_token)
if end_idx == -1:
    print("Could not find end idx")
    sys.exit(1)

with open(patch_path, "r", encoding="utf-8") as f:
    patch = f.read()

new_html = html[:start_idx] + patch + "\n                        " + html[end_idx:]

with open(html_path, "w", encoding="utf-8") as f:
    f.write(new_html)

print("Patched successfully")
