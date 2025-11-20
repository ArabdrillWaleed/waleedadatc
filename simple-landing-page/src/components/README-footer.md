FAQ footer fix — how to apply it to other pages

What we changed for FAQ
- Removed the `site-fill` body class on the FAQ page so it uses the normal document flow (prevents footer placement differences caused by column flex + min-height).
- Ensured the footer is visible even if JS doesn't run by keeping a small `.faq .site-footer{opacity:1;transform:none}` fallback in `src/css/styles.css`.
- Reverted per-page footer layout overrides so the global footer styles control spacing/padding and logo sizing.

When to apply the same fix
- Pages that are short and use `class="site-fill"` on `<body>` may show footer spacing/size differences. Examples found in the repo:
  - `src/instructors/ahmed-hassan.html`
  - `src/instructors/sarah-al-rashid.html`

How to apply (recommended — safe)
1) Remove the `site-fill` class from the page's `<body>` tag. This makes the page use the global header/footer layout rules automatically.

PowerShell one-liner to remove `site-fill` from all HTML files under `src/` (preview first):

# Preview - show files that would change
Get-ChildItem -Path src -Filter "*.html" -Recurse | ForEach-Object {
  $text = Get-Content $_.FullName -Raw
  if ($text -match 'class="[^"]*\bsite-fill\b[^"]*"') { Write-Host "Would update: $($_.FullName)" }
}

# Apply - removes the site-fill token from body class (idempotent)
Get-ChildItem -Path src -Filter "*.html" -Recurse | ForEach-Object {
  $path = $_.FullName
  $text = Get-Content $path -Raw
  $new = $text -replace 'class="([^"]*)\bsite-fill\b([^"]*)"','class="$1$2"'
  Set-Content -Path $path -Value $new
}

How to apply (alternate) — add per-page CSS fallback
- Instead of editing HTML, you can add a per-page CSS rule that forces the footer to use the global layout, e.g. for `instructors` pages in `styles.css`:

.instructors .site-footer{ opacity:1 !important; transform:none !important; }
.instructors .footer-brand-mark{ max-width:220px !important; }

This is less invasive but duplicates the FAQ fallback pattern.

Global option (if you want uniform behavior)
- If you want to avoid per-page changes, make the footer always visible and remove/reduce the reveal animation. E.g. set `.site-footer{opacity:1;transform:none}` globally. This removes the reveal effect but guarantees consistent spacing during development.

Recommendation
- I recommend the safe HTML edit (remove `site-fill`) for the short instructor pages first; it's clean and reverts the page to the intended layout model.

Want me to do it now?
- I can: (A) run the PowerShell apply snippet to remove `site-fill` from the two instructor pages now, or (B) add per-page CSS fallbacks for those pages, or (C) leave this README and task for you to run.

If you want me to apply the changes now, say which option (A/B) and I will proceed.