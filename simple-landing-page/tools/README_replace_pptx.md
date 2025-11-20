Replace PPTX course info helper
================================

This folder contains a small Python script to replace placeholders in a PowerPoint (.pptx)
using a JSON or CSV data file.

How it works
-----------
- The script `replace_pptx_courses.py` supports two workflows:
  1. Slide-mapped items: your data file is a JSON array or CSV where each row has a
     `slide_index` (0-based). The script opens that slide and replaces tokens like
     `{{TITLE}}`, `{{DURATION}}`, `{{DESCRIPTION}}` in any text shapes. If the row
     includes an `image` field with a path, any shape containing `{{IMAGE}}` will be
     replaced by that image (keeps position/size).
  2. Global mapping: if your data is a single JSON object (or CSV with a single row),
     it treats keys as tokens and replaces them across all slides.

Usage
-----
Place your PPTX and data files in the workspace, for example:

  - `assets/courses-template.pptx`
  - `data/courses.csv` or `data/courses.json`

Run the script:

```powershell
python tools/replace_pptx_courses.py --pptx assets/courses-template.pptx --data data/courses.json --out output/courses-filled.pptx --backup
```

Notes and next steps
--------------------
- If your PPTX uses different placeholder tokens or you want mapping by slide title
  instead of index, tell me and I will adapt the script.
- If you prefer I run the script here, upload the PPTX and data files into the workspace
  (drag into the chat or place under `src/`/`assets/` and tell me the path). I'll run it
  and return the generated PPTX and a small report.

Dependencies
------------
- python-pptx
