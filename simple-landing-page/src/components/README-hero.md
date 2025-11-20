Hero fragment usage

There are two hero fragments in this repository:

1. `hero.html` - a richer marketing hero (brand line, h1, lead paragraph, CTA buttons, media image). Use this for home page or marketing landing pages.

2. `hero-contact-fragment.html` - a compact, Contact-style hero (full-bleed image, title and subtitle) that is used for the Contact page and facility pages. Copy this into any new page that needs a full-bleed hero that matches the Contact page.

How to use

- Copy the fragment's <section> block into the top of the page's <main>.
- Update the inline background-image URL (relative to the page location).
- Replace the title and subtitle text.
- Keep the classes `image-hero color-1`, `hero-text-container`, `hero-contact` and `hero-contact-subtitle` to ensure consistent styling.

Example (from a page inside `src/`):

<section class="image-hero color-1" aria-hidden="true">
  <div class="hero-text-container">
    <div class="hero-contact">My Page Title</div>
    <div class="hero-contact-subtitle">Short subtitle</div>
  </div>
</section>

Notes

- The CSS is already scoped so pages with `body.facility` will inherit the same colors and alignment as the Contact page.
- If you want the hero title to be an actual H1 for SEO, you can replace the `div.hero-contact` with `<h1 class="hero-contact">...` but ensure the page has only one H1.
- For new pages nested in subfolders, adjust the background-image path accordingly (e.g., `../images/...`).