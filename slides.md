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
Half-day workshop - Restaurant bot storyline - Concept, example, exercise, lookup
</div>

---

## What You Will Be Able To Do

- Read basic Bubblescript examples.
- Write small dialogs with `say`, `ask`, and `show`.
- Split a bot into dialogs and triggers.
- Recognize when to use BML, constants, branches, prompts, and tasks.
- Know where to look when you have a new bot idea.

---

## The Running Example

We will build up a restaurant bot one step at a time.

```text
dialog __main__ do
  say "Welcome at Restaurant Sienna"
  show image "restaurant.jpg"
  ask "What would you like to order?"
  say "We'll start preparing your #{answer}"
end
```

<div class="exercise">
First guided edit: change the restaurant name and the first question.
</div>

---

## Workshop Ladder

1. First bot: `say`, `ask`, `show`
2. Conversation shape: `dialog`, `trigger:`, `invoke`
3. Matching: BML, intents, `__unknown__`
4. Guided menus: `prompt`, labels, quick replies, `continue`
5. Data: variables, constants, lists, maps
6. Logic: `if`, `branch`, guards
7. Computation: `task`, `perform`
8. Next ideas: docs map and pattern catalog

---

<div class="chapter-label">Chapter 1</div>

# First Bot

The first goal is to read the shape of a bot:

- `dialog` groups conversation steps.
- `say` sends a message.
- `show` displays media or UI.
- `ask` waits for a user answer and stores it in `answer`.

---

## Lookup Anchor

Use these docs while building the deck:

- `docs/docs/bubblescript/getting_started.md`
- `docs/docs/bubblescript/dialogs.md`
- `docs/docs/bubblescript/bml.md`
- `docs/docs/bubblescript/tasks.md`

<div class="lookup">
After the initial port, this Slidev deck is the maintained narrative source. `botsi_platform` remains the syntax and behavior source.
</div>
