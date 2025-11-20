Header/footer components (client include)

What I added
- `src/components/header.html` — canonical header markup
- `src/components/footer.html` — canonical footer markup
- `src/js/include-fragments.js` — small client-side loader that fetches the above fragments and inserts them into placeholders
- `src/components/README-components.md` — this file

How to use
1) In a new page, add placeholders where you want the header and footer:

   <div id="site-header-placeholder"></div>
   ...page content...
   <div id="site-footer-placeholder"></div>

2) Add the loader script right before `</body>` (use the `defer` attribute):

   <script src="/js/include-fragments.js" defer></script>

3) Optional: add `class="site-fill"` only if you understand it makes the page use a column flex layout with min-height:100vh. It's usually better to avoid `site-fill` for shorter pages to keep footer consistent.

Notes and migration tips
- The loader computes the components directory relative to the script's `src` attribute, so it works from pages in subfolders.
- This is a client-side include. It keeps HTML files simple and consistent without changing your build pipeline.
- To migrate existing pages, either:
  - Replace existing header/footer markup with the placeholders and the script (recommended), or
  - Leave existing pages as-is; new pages will use the components.

Want me to migrate the current pages to use components?
- I can update all pages to use the placeholders (safer: create a branch or keep backups). Say "migrate all" and I'll replace the header/footer on every page with placeholders and the loader script.