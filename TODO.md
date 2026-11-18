# NHL International Redesign — Implementation Checklist

## Shared shell and migration safeguards
- [x] Preserve the existing primary URLs and category slugs, including `/`, `/catalog/`, `/contact/`, `/home`, `/about-us/`, `/how-we-work/`, `/certifications/`, and the 19 category paths currently linked from the source site.
- [x] Build a responsive sticky header with the existing NHL wordmark treatment, Catalog mega-menu, primary navigation, and prominent `Send Inquiry` action.
- [x] Build a polished footer with the verified phone, email, address, navigation links, and inquiry CTA.
- [x] Serve `GET /manus-routes.json` with the complete client route manifest before the dev server starts.

## Home experience
- [x] Use the requested hero headline `Precision trims for the world's apparel makers.` with supporting copy and `View Catalog` / `Send an Inquiry` CTAs.
- [x] Add a trust strip for Oeko-Tex Standard 100, Confidence in Textiles and Made in Green, plus clearly labeled capability / experience placeholders where source facts are missing.
- [x] Show all 19 categories as fast-scanning image cards: Beads, Belts, Buckles, Buttons, D Rings, Drawcords, Elastic Items, Grippers, Hook & Bar, Laces, Loop Buttons, Paper Bags, Reflective Tape, Shank, Snap, Tapes & Cords, Toggles, Zip Pullers, Zippers.
- [x] Add the verified Our Story preview, four-step How We Work timeline, six manufacturing capability cards, inquiry banner, and responsive footer.

## Catalog and category pages
- [x] Build a searchable and filterable catalog covering every preserved category, with `Add to inquiry` behavior and a visible inquiry count.
- [x] Build reusable category pages that keep the current slugs, show verified intros, replaceable product imagery, material / size / finish specification rows, downloadable e-catalog placeholder action, and `Request sample` CTA.
- [x] Keep placeholder product content explicitly labeled where source product specs or imagery are not available.

## About, process, certifications and inquiry
- [x] Build About Us, How We Work and Certifications pages with the verified current copy and improved hierarchy.
- [x] Build the Contact / Inquiry form with labels for name, company, email, country, product category, quantity, message and artwork upload.
- [x] Show the selected multi-item inquiry list and visible WhatsApp, email, phone and address options.

## Quality, accessibility and SEO
- [x] Use a premium editorial visual system with logo-derived deep-primary / accent / neutral colors, a modern sans-serif, restrained motion, high-contrast focus states, semantic landmarks and labeled controls.
- [x] Add page-specific title / description / Open Graph metadata, canonical URL only when the real public origin is configured, meaningful alt text, Organization / Product JSON-LD, `robots.txt` and `sitemap.xml` compatible routing.
- [x] Check mobile layout at 390px and desktop layout at 1440px, then resolve confirmed defects.
- [x] Run type diagnostics, build, and a read-only requirements review before checkpointing.

## Content confirmations to deliver
- [ ] List missing product photography, certificate files, e-catalog PDF, product specifications, WhatsApp destination, and any unverified company statistics or claims.
- [ ] List source contradictions for confirmation, including headquarters wording versus the current footer address and the missing evidence for years-in-business / key capability stats.
