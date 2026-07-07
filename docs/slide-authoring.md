# Slide Authoring Guide

Conventions for adding and maintaining slides in `slides.md`.

## Chapter rhythm

Most teaching chapters follow three beats:

1. **Concept + example** — one slide, two columns
2. **Exercise** — separate slide
3. **Lookup** — footer chip on each slide that needs a docs anchor

Some later chapters keep concept and example inline on a single default-layout slide (no separate `## … Example` slide). That is fine when the example is very short.

## Headmatter defaults

Deck-wide settings live in the first frontmatter block:

```yaml
---
theme: default
colorSchema: light
background: '#faf9fc'
fonts:
  sans: Inter
  serif: Inter
  mono: JetBrains Mono
  provider: google
themeConfig:
  primary: '#883ad0'
defaults:
  zoom: 0.8
css: unocss
---
```

- **`defaults.zoom: 0.8`** — scales every slide to 80%. Override per slide with `zoom: 1` if needed.
- **`#883ad0`** — Enreach purple; keep this as the primary accent.

## Concept + example slide (preferred)

Use `two-cols-header` when a chapter has a separate concept slide and `## Topic Example` slide.

```md
---
layout: two-cols-header
---

## Topic Name

::left::

<div class="concept">

Concept:

- First bullet
- Second bullet

</div>

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

::right::

Short intro before the code block:

```bubblescript
dialog __main__ do
  say "Example"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/examples.md
</div>

---

## Topic Name Exercise

<div class="exercise">

Exercise:

- Change one thing
- Try another thing

</div>

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>
```

### Column rules

| Column | Content |
|--------|---------|
| **Left** | `.concept` block + concept lookup |
| **Right** | Example intro text, code block, example lookup |
| **Header** | Shared `##` title (drop the separate `## … Example` heading) |

## Theme CSS classes

Defined in `styles/theme.css`. Styles load via `styles/index.css`.

| Class | Use | Visual |
|-------|-----|--------|
| `.concept` | Explain the idea | Light purple fill, purple top bar |
| `.exercise` | Guided edit / hands-on task | White card, purple outline |
| `.pattern` | Example target or pattern to match | Cool gray, slate top bar |
| `.warning` | “Check yourself” prompts | Warm cream, amber top bar |
| `.lookup` | Docs / source anchor | Monospace footer chip |
| `.agenda` / `.agenda-item` | Workshop ladder grid | Numbered cards with `data-step` |
| `.chapter-label` | Cover subtitle | Uppercase Enreach purple label |

Each block type has a distinct background so stacked blocks on one slide stay scannable. Stacked blocks get vertical spacing automatically.

### Label lines

Keep the label as the first paragraph inside the div:

```md
<div class="concept">

Concept:

- …

</div>
```

The CSS uppercases and styles `Concept:`, `Exercise:`, `Example target:`, etc.

## Maintenance scripts

```bash
# Wrap Concept / Exercise / pattern / warning blocks with theme classes
node scripts/apply-theme-classes.mjs

# Merge adjacent "## Topic" + "## Topic Example" slides into two-cols-header
npm run slides:merge-concept-example
```

Run `slides:merge-concept-example` after adding new concept/example pairs with the old two-slide pattern. The script skips slides that are already merged.

## Adding a new chapter checklist

1. Write concept bullets in a `.concept` block.
2. Add the smallest useful Bubblescript example.
3. Put concept + example on one `two-cols-header` slide (or run the merge script).
4. Add a separate exercise slide with `.exercise`.
5. Add `.lookup` chips pointing at `botsi_platform` docs paths.
6. Run `npm run build` to verify the deck compiles.

## Correctness source

Bubblescript behavior and syntax must match `botsi_platform`, not Slides.com. See `README.md` for the canonical file list.
