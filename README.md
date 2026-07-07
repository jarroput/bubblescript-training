# Bubblescript Training

Standalone Slidev deck for the Bubblescript basics half-day workshop.

## Audience

This deck is for new DialoX/Bubblescript users and solution consultants. It teaches practical Bubblescript literacy through a restaurant bot storyline.

## Toolchain

Use Node `22.12.0`, as pinned by `.nvmrc` and `.node-version`. The supported Node range is `^22.12.0 || >=24.0.0`, and the project package manager is npm `11.6.2`.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the Slidev dev server:

```bash
npm run dev
```

Build the static deck:

```bash
npm run build
```

Export the deck:

```bash
npm run export
```

Re-import from a Slides.com offline export:

```bash
npm run migrate:slidescom
```

Regenerate the Bubblescript Shiki grammar (after editing keywords in `scripts/generate-bubblescript-grammar.mjs`):

```bash
npm run generate:grammar
```

Set `SLIDESCOM_EXPORT` if the export folder is not in `~/Downloads/slides_bubblescript-basic-training (1)`.

## Editing The Deck

Edit slide content in `slides.md`; keep Bubblescript examples embedded there for now so the workshop narrative stays easy to review.

Put static images and media in `public/`. Use `styles/theme.css` for shared deck styling.

See [`docs/slide-authoring.md`](docs/slide-authoring.md) for slide layout conventions: two-column concept+example slides, theme CSS classes, headmatter defaults, and maintenance scripts.

Add reusable Slidev/Vue components to `components/` only when they reduce repeated markup or make a slide clearer.

## Maintenance Rule

The initial Slides.com workshop content has been ported. Slides.com is only the migration seed; this Slidev deck is now the maintained narrative source.

Use `botsi_platform` as the correctness source for Bubblescript behavior. These paths are in the `botsi_platform` repository, not this standalone Slidev deck:

- `apps/bubble/lib/bubble/parser.ex`
- `apps/bubble/lib/bubble/interaction_docs.ex`
- `docs/docs/bubblescript/*`
- `apps/botsi_web/test/botsi_common/scripts_parser_test.exs`

## Content Pattern

Each concept chapter should use this rhythm:

1. **Concept + example** — one `two-cols-header` slide (concept left, example right).
2. **Exercise** — separate slide with a guided edit.
3. **Lookup anchor** — docs path in a `.lookup` chip on each slide that needs it.

Authoring details, CSS classes, and scripts: [`docs/slide-authoring.md`](docs/slide-authoring.md).
