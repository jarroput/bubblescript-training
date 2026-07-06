# Bubblescript Slidev Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port and modernize the Slides.com Bubblescript basics workshop into the local Slidev deck while preserving the Restaurant Sienna storyline.

**Architecture:** Keep the deck as a single `slides.md` file with embedded Bubblescript examples. Use `styles/theme.css` only for reusable workshop presentation styles. Treat Slides.com as the one-time migration seed and `botsi_platform` docs/parser behavior as the correctness source.

**Tech Stack:** Slidev, Markdown, CSS, npm.

---

## Source Inventory

Use this Slides.com source as the migration seed:

`https://slides.com/nwildenberg/bubblescript-basics-workshop-b38500`

Port these topic groups in this order:

1. Intro and first Restaurant Sienna bot.
2. `say`, `ask`, `show`.
3. Dialogs, triggers, special dialogs, named dialogs, `invoke`.
4. Dialog stack, `prompt`, `continue`, reprompting, `random`, `once` / `after`.
5. User intent, intent classification, BML basics, intent constants, short-form dialog notation.
6. Inner dialog labels, quick replies, `expecting`, inner triggers, `__returning__`.
7. Lists, global constants, maps, `input_method`, UI widgets.
8. Conditionals, guards, entities.
9. Tasks, CMS/content files, intent YAML, user data, tagging, mail, PWA YAML, variables.
10. Closing lookup map and next-idea patterns.

Use `text` code fences for Bubblescript snippets until a later task adds a custom Shiki language. Do not use `botsi` fences because the current Slidev build fails on unknown Shiki languages.

## File Structure

Modify these files:

- `slides.md`: main deck content.
- `styles/theme.css`: visual helpers for agenda, exercises, lookup anchors, and split examples.
- `README.md`: add a short note that the Slides.com source has been ported and future edits should happen in this repo.

Do not create separate Bubblescript exercise files. Keep all examples embedded in `slides.md`.

## Task 1: Add Porting Scaffolding And Visual Helpers

**Files:**
- Modify: `slides.md`
- Modify: `styles/theme.css`

- [ ] **Step 1: Add reusable styles**

Append this CSS to `styles/theme.css`:

```css

.agenda {
  display: grid;
  gap: 0.65rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.agenda-item {
  background: var(--dx-surface);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.concept {
  border-left: 0.35rem solid var(--dx-blue);
  padding-left: 1rem;
}

.two-column {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.pattern {
  background: #f0fdf4;
  border-left: 0.35rem solid #16a34a;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
}

.warning {
  background: #fffbeb;
  border-left: 0.35rem solid #f59e0b;
  border-radius: 0.5rem;
  padding: 1rem 1.25rem;
}
```

- [ ] **Step 2: Replace the starter `slides.md` with section markers**

Replace `slides.md` with this scaffold:

````markdown
---
theme: default
title: Bubblescript Basics
info: |
  Half-day Bubblescript training for new DialoX users and solution consultants.
css: unocss
---

<style src="./styles/theme.css"></style>

# Bubblescript Basics

Read, write, and extend conversational bots in DialoX.

<div class="lookup">
Half-day workshop - Restaurant Sienna storyline - Concept, example, exercise, lookup
</div>

---

## Workshop Goal

By the end, you can:

- Read basic Bubblescript examples.
- Write small dialogs with `say`, `ask`, and `show`.
- Split a bot into dialogs and triggers.
- Recognize when to use BML, constants, prompts, branches, and tasks.
- Find the right docs or pattern when you have a new bot idea.

---

## Workshop Ladder

<div class="agenda">
  <div class="agenda-item">1. First bot</div>
  <div class="agenda-item">2. Dialogs and triggers</div>
  <div class="agenda-item">3. Matching and intents</div>
  <div class="agenda-item">4. Guided input</div>
  <div class="agenda-item">5. Data and UI widgets</div>
  <div class="agenda-item">6. Logic and guards</div>
  <div class="agenda-item">7. Tasks and side effects</div>
  <div class="agenda-item">8. Next ideas</div>
</div>

<!-- SECTION:FOUNDATIONS -->

<!-- SECTION:MATCHING_AND_INPUT -->

<!-- SECTION:DATA_LOGIC_TASKS -->

<!-- SECTION:LOOKUP_AND_CLOSE -->
````

- [ ] **Step 3: Verify build**

Run:

```bash
npm run build
```

Expected: command exits `0`. Dependency warnings are acceptable if they match the existing Rolldown warning from `@vueuse/core`.

- [ ] **Step 4: Commit scaffolding**

Run:

```bash
git status --short && git add slides.md styles/theme.css && git commit -m "feat: add deck porting scaffold"
```

Expected: commit succeeds.

## Task 2: Port Foundations And Conversation Flow

**Files:**
- Modify: `slides.md`

- [ ] **Step 1: Replace `<!-- SECTION:FOUNDATIONS -->`**

Replace the `<!-- SECTION:FOUNDATIONS -->` marker in `slides.md` with slides covering:

- First Restaurant Sienna bot.
- `say`, `ask`, `show`.
- Dialogs and triggers.
- Special dialogs: `__main__`, `__root__`, `__unknown__`, `__closed__`.
- `invoke` and named dialogs.
- Named dialog with trigger.
- Dialog stack mental model.
- `prompt` and `continue`.
- Reprompting with prompt text list.
- `random`.
- `once` / `after`.

Use the code examples from Slides.com, modernized only for clarity and ASCII where possible. Keep the Restaurant Sienna names and location coordinates.

Each topic must have:

- A concept slide.
- A restaurant-bot example slide.
- A small exercise slide.
- A lookup anchor referencing the relevant `botsi_platform` docs path.

- [ ] **Step 2: Verify required headings exist**

Run:

```bash
rg "First Restaurant Sienna Bot|Say, Ask, And Show|Dialogs And Triggers|Special Dialogs|Invoke A Named Dialog|Prompt And Continue|Random Responses|Once And After" slides.md
```

Expected: all headings are found.

- [ ] **Step 3: Verify build**

Run:

```bash
npm run build
```

Expected: command exits `0`.

- [ ] **Step 4: Commit foundations**

Run:

```bash
git status --short && git add slides.md && git commit -m "feat: port Bubblescript conversation foundations"
```

Expected: commit succeeds.

## Task 3: Port Matching, Intents, And Guided Input

**Files:**
- Modify: `slides.md`

- [ ] **Step 1: Replace `<!-- SECTION:MATCHING_AND_INPUT -->`**

Replace the `<!-- SECTION:MATCHING_AND_INPUT -->` marker in `slides.md` with slides covering:

- User intent.
- Intent classification challenge using restaurant vs weather examples.
- BML as sentence-level matching.
- BML example: `about _ (restaurant | sienna)`.
- Intent definition with `intent(match: [...])`.
- Global constants for intents.
- Short-form dialog notation.
- Intent, trigger, dialog pattern.
- Examples of BML.
- Inner dialog labels.
- Quick replies.
- `expecting`.
- Inner dialog triggers.
- `__returning__`.

Each topic must have concept, example, exercise, and lookup anchor content where useful. Exercises should be small edits, such as adding a new BML phrase, adding a menu label, or adding an `__unknown__` fallback.

- [ ] **Step 2: Verify required headings exist**

Run:

```bash
rg "User Intent|Bubblescript Matching Language|Intent Definition|Global Constants|Short Form Dialog Notation|Inner Dialog Labels|Quick Replies|Expecting|Inner Dialog Triggers|__returning__" slides.md
```

Expected: all headings are found.

- [ ] **Step 3: Verify build**

Run:

```bash
npm run build
```

Expected: command exits `0`.

- [ ] **Step 4: Commit matching/input section**

Run:

```bash
git status --short && git add slides.md && git commit -m "feat: port Bubblescript matching and input sections"
```

Expected: commit succeeds.

## Task 4: Port Data, Logic, Tasks, And Integrations

**Files:**
- Modify: `slides.md`

- [ ] **Step 1: Replace `<!-- SECTION:DATA_LOGIC_TASKS -->`**

Replace the `<!-- SECTION:DATA_LOGIC_TASKS -->` marker in `slides.md` with slides covering:

- Lists.
- Maps and global constants.
- `input_method("item_picker", ...)`.
- UI widget capability overview.
- `if`.
- `branch`.
- Guards with `when`.
- Entities using `entity(match: "[time=pickup_time]")`.
- `perform` and `task`.
- CMS/content file idea.
- Intent YAML idea.
- User data and `remember`.
- Tagging.
- Mail task.
- PWA YAML.
- Variables: string, integer, list.

Keep advanced platform/configuration topics short. The goal is concept awareness and "where to look next", not deep implementation.

- [ ] **Step 2: Verify required headings exist**

Run:

```bash
rg "Lists|Maps And Global Constants|Item Picker|UI Widgets|Conditionals|Guards|Entities|Tasks|CMS|Intent YAML|User Data|Tagging|Mail|PWA Settings|Variables" slides.md
```

Expected: all headings are found.

- [ ] **Step 3: Verify build**

Run:

```bash
npm run build
```

Expected: command exits `0`.

- [ ] **Step 4: Commit data/logic/tasks section**

Run:

```bash
git status --short && git add slides.md && git commit -m "feat: port Bubblescript data logic and task sections"
```

Expected: commit succeeds.

## Task 5: Add Closing Lookup Map And Maintenance Update

**Files:**
- Modify: `slides.md`
- Modify: `README.md`

- [ ] **Step 1: Replace `<!-- SECTION:LOOKUP_AND_CLOSE -->`**

Replace the `<!-- SECTION:LOOKUP_AND_CLOSE -->` marker in `slides.md` with closing slides:

- "When you have a new idea, start here" pattern map.
- Docs lookup map:
  - Getting started: `botsi_platform/docs/docs/bubblescript/getting_started.md`
  - Dialogs: `botsi_platform/docs/docs/bubblescript/dialogs.md`
  - Statements: `botsi_platform/docs/docs/bubblescript/statements.md`
  - BML: `botsi_platform/docs/docs/bubblescript/bml.md`
  - Variables: `botsi_platform/docs/docs/bubblescript/variables.md`
  - Constants: `botsi_platform/docs/docs/bubblescript/constants.md`
  - Tasks: `botsi_platform/docs/docs/bubblescript/tasks.md`
  - Schemas: `botsi_platform/docs/docs/bubblescript/schemas.md`
- Final exercise: extend the Restaurant Sienna bot with one new capability.
- Closing slide: "Slides.com was the migration seed; this deck is now the narrative source."

- [ ] **Step 2: Update README maintenance note**

In `README.md`, update the maintenance rule to say the initial Slides.com content has been ported. Keep the instruction that `botsi_platform` is the correctness source.

- [ ] **Step 3: Verify no migration markers remain**

Run:

```bash
rg "SECTION:" slides.md
```

Expected: no matches.

- [ ] **Step 4: Verify build**

Run:

```bash
npm run build
```

Expected: command exits `0`.

- [ ] **Step 5: Commit closing section**

Run:

```bash
git status --short && git add slides.md README.md && git commit -m "feat: complete Bubblescript training deck port"
```

Expected: commit succeeds.

## Task 6: Final Deck Review And Verification

**Files:**
- Verify: `slides.md`
- Verify: `README.md`
- Verify: `styles/theme.css`

- [ ] **Step 1: Verify source coverage**

Run:

```bash
rg "Restaurant Sienna|Say, Ask, And Show|Dialogs And Triggers|Prompt And Continue|Bubblescript Matching Language|Quick Replies|Conditionals|Tasks|PWA Settings|Variables" slides.md
```

Expected: all major source topics are represented.

- [ ] **Step 2: Verify deck build**

Run:

```bash
npm run build
```

Expected: command exits `0`.

- [ ] **Step 3: Smoke-run local deck**

Run:

```bash
npm run dev -- --port 3030
```

Expected: local URL is printed. Open or curl `http://localhost:3030/` and confirm HTTP `200`. Stop the dev server afterward.

- [ ] **Step 4: Verify git status and commit log**

Run:

```bash
git status --short && git log --oneline --decorate -10
```

Expected: status is clean and the porting commits are visible.

At this point, the Slidev deck should no longer depend on Slides.com as the narrative source.

