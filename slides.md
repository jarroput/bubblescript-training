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

---

## First Restaurant Sienna Bot

Concept:

- A bot starts in `__main__`.
- Statements run from top to bottom.
- `ask` waits for the user and stores the response in `answer`.
- `close` ends the conversation.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/getting_started.md
</div>

---

## First Restaurant Sienna Bot Example

Restaurant Sienna as one complete flow:

```text
dialog __main__ do
  say "Welcome to Restaurant Sienna"
  show image "restaurant.jpg"
  say "We serve traditional Italian pizzas."

  say "We are located at Joan Muyskenweg 22 in Amsterdam"
  show location [lat: 52.3326472, lon: 4.91505839]

  ask "What would you like to order?"
  say "We'll start preparing your #{answer}"

  say "Goodbye"
  close
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/examples.md
</div>

---

## First Restaurant Sienna Bot Exercise

Exercise:

- Change the welcome copy.
- Swap the restaurant image.
- Adjust the goodbye message.

Check yourself:

- Does the script still read in the exact order the guest will experience it?
- Is every user-facing text useful?

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Say, Ask, And Show

Concept:

- `say` sends text.
- `ask` sends a question and waits for input.
- `show` sends media, widgets, or locations.
- Use `#{answer}` when you need the last answer inside text.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Say, Ask, And Show Example

Restaurant Sienna greeting, media, address, and order:

```text
dialog __main__ do
  say "Welcome to Restaurant Sienna"
  show image "https://storage.googleapis.com/botsquad-assets/workshop/restaurant.jpg"
  say "We serve traditional Italian pizzas."

  say "We are located at Joan Muyskenweg 22 in Amsterdam"
  show location [lat: 52.3326472, lon: 4.91505839]

  ask "What would you like to order?"
  say "We'll start preparing your #{answer}"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/ui.md
</div>

---

## Say, Ask, And Show Exercise

Exercise:

- Add a `say` line that explains today's special.
- Add a `show image` line for the special.
- Ask whether the guest wants a table or takeaway.
- Echo the answer back in a confirmation sentence.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Dialogs And Triggers

Concept:

- A dialog is a named block of conversation.
- A `trigger` listens for matching user messages.
- Triggers use BML, so `"location | address"` means either word can match.
- The first matching triggered dialog handles the message.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Dialogs And Triggers Example

Split Restaurant Sienna into small triggered intents:

```text
dialog __main__ do
  say "Welcome to Restaurant Sienna"
  show image "https://storage.googleapis.com/botsquad-assets/workshop/restaurant.jpg"
  say "What can I do for you?"
end

dialog trigger: "about" do
  say "We serve traditional Italian pizzas."
end

dialog trigger: "location | address" do
  say "We are located at Joan Muyskenweg 22 in Amsterdam"
  show location [lat: 52.3326472, lon: 4.91505839]
end

dialog trigger: "order" do
  ask "What would you like to order?"
  say "We'll start preparing your #{answer}"
end

dialog trigger: "stop | close | bye" do
  say "Goodbye!"
  close
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Dialogs And Triggers Exercise

Exercise:

- Add a `menu | card` trigger.
- Make it say that Restaurant Sienna serves pizza, pasta, and dessert.
- Add one trigger for opening hours.
- Test the wording by sending short user messages, not full sentences.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/match_engine.md
</div>

---

## Special Dialogs

Concept:

- `__main__` is the entry point.
- `__root__` runs when there are no more dialogs left to execute.
- `__unknown__` runs when the user says something that matches no trigger.
- `__closed__` runs when the conversation is closing.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Special Dialogs Example

Restaurant Sienna fallback behavior:

```text
dialog __main__ do
  say "Hi!"
end

dialog __root__ do
  say "What can I do for you?"
end

dialog __unknown__ do
  say "I don't understand"
end

dialog __closed__ do
  say "Goodbye!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Special Dialogs Exercise

Exercise:

- Change `__root__` into a useful Restaurant Sienna menu prompt.
- Make `__unknown__` suggest examples: about, location, order, stop.
- Keep `__closed__` short and final.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Invoke A Named Dialog

Concept:

- `invoke about` calls a named dialog.
- When that named dialog finishes, execution returns to the caller.
- This keeps shared content in one place.
- A named dialog can also have a trigger.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Invoke A Named Dialog Example

Call the same Restaurant Sienna "about" answer from startup and from a trigger:

```text
dialog __main__ do
  say "Welcome to Restaurant Sienna"
  invoke about
  show image "restaurant.jpg"
end

dialog __root__ do
  say "What can I do for you?"
end

dialog about, trigger: "about" do
  say "We serve traditional Italian pizzas."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Dialog Stack Mental Model

Text model:

```text
1. __main__ starts.
2. __main__ runs: invoke about.
3. invoke about pushes about onto the dialog stack.
4. about runs its statements.
5. When about finishes, execution returns to the next line in __main__.
6. Later, prompt uses the same idea of pausing and resuming conversation flow.
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Invoke A Named Dialog Exercise

Exercise:

- Create a named dialog `address`.
- Invoke `address` from `__main__`.
- Give `address` a trigger: `"location | address"`.
- Keep the coordinates exactly: `[lat: 52.3326472, lon: 4.91505839]`.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/examples.md
</div>

---

## Prompt And Continue

Concept:

- `prompt` keeps the current dialog open while the bot waits for user input.
- Triggered dialogs can run while the prompt is waiting.
- `continue` exits the current prompt or ask.
- `close` ends the whole conversation.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Prompt And Continue Example

Keep Restaurant Sienna open until the guest is done:

```text
dialog __main__ do
  say "Welcome to Restaurant Sienna"

  # keeps prompting until continue or close
  prompt "What can I do for you?"

  say "Goodbye"
  close
end

dialog trigger: "nothing | stop | bye | close" do
  continue
end

dialog __unknown__ do
  say "I don't understand"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Prompt And Continue Reprompting

Use a text list when the second and later prompt should sound different:

```text
dialog __main__ do
  say "Welcome to Restaurant Sienna"

  # keeps prompting until continue or close
  prompt [
    "What can I do for you today?",
    "What else can I do for you?"
  ]

  say "Goodbye"
  close
end

dialog trigger: "nothing | stop | bye | close" do
  continue
end

dialog __unknown__ do
  say "I don't understand"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Prompt And Continue Exercise

Exercise:

- Add triggers for `about`, `location`, and `order`.
- Wrap the service flow in a `prompt` list.
- Make `nothing | stop | bye | close` use `continue`.
- Confirm that goodbye happens after leaving the prompt.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Random Responses

Concept:

- `random do` chooses one statement from the block.
- Use it for small wording variation.
- Keep each random branch equivalent in meaning.
- Do not hide business logic inside random responses.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Random Responses Example

Vary the Restaurant Sienna welcome without changing the flow:

```text
dialog __main__ do
  random do
    say "Hi there"
    say "Hello"
    say "Welcome to Restaurant Sienna"
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/conditionals.md
</div>

---

## Random Responses Exercise

Exercise:

- Add three equivalent order confirmations.
- Keep each option short.
- Do not put `ask` inside the `random` block for this exercise.

Example target:

```text
say "We'll start preparing your #{answer}"
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Once And After

Concept:

- `once do` runs each statement once, in order, across repeated visits.
- `after` runs after the once-list is exhausted.
- Use this for escalating fallback messages.
- It is useful in `__unknown__`.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/conditionals.md
</div>

---

## Once And After Example

Escalate Restaurant Sienna's unknown-message handling:

```text
dialog __unknown__ do
  once do
    say "I don't understand"
    say "I still don't understand"
  after
    say "Sorry, I don't think this is working"
    close
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Once And After Exercise

Exercise:

- Make the first unknown message suggest `about`, `location`, and `order`.
- Make the second unknown message ask the guest to type one of those words.
- In `after`, close politely.
- Avoid adding a fourth fallback line.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/conditionals.md
</div>

<!-- SECTION:MATCHING_AND_INPUT -->

<!-- SECTION:DATA_LOGIC_TASKS -->

<!-- SECTION:LOOKUP_AND_CLOSE -->
