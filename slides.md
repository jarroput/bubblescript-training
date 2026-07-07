---
theme: default
title: Bubblescript Basics
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
info: |
  Bubblescript training for new DialoX users and solution consultants.
css: unocss

---


<div class="chapter-label">Enreach · DialoX</div>

# Bubblescript Basics

Read, write, and extend conversational bots in DialoX.

---


## Workshop Goal

By the end, you can:

- Read and write Bubblescript
- Design a conversation around dialogs
- Use intents and LLM prompts to build free flowing conversations
- Build integrations with third parties

---


## Workshop Ladder

<div class="agenda">
  <div class="agenda-item" data-step="1">First bot</div>
  <div class="agenda-item" data-step="2">Dialogs and triggers</div>
  <div class="agenda-item" data-step="3">Matching and intents</div>
  <div class="agenda-item" data-step="4">Guided input</div>
  <div class="agenda-item" data-step="5">Data and UI widgets</div>
  <div class="agenda-item" data-step="6">Logic and guards</div>
  <div class="agenda-item" data-step="7">Tasks and side effects</div>
  <div class="agenda-item" data-step="8">Next ideas</div>
</div>

---
layout: two-cols-header
---

## Say, Ask, And Show

::left::

<div class="concept">

Concept:

- `say` sends text.
- `ask` sends a question and waits for input.
- `show` sends media, widgets, or locations.
- Use `#{answer}` when you need the last answer inside text.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

::right::

Starbucks greeting, media, address, and order:

```bubblescript
dialog __main__ do
  say "Welcome to Starbucks"
  show image "https://storage.googleapis.com/botsquad-assets/workshop/starbucks.jpg"
  say "We serve delicious coffees and pastries."

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

<div class="exercise">

Exercise:

- Add a `say` line that explains today's special.
- Ask whether the guest wants a table or takeaway.
- Say the answer back in a confirmation sentence.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---
layout: two-cols-header
---

## Dialogs And Triggers

::left::


<div class="concept">

Concept:

- A dialog is a named block of conversation.
- A `trigger` listens for matching user messages.
- Triggers use BML, so `"location | address"` means either word can match.
- The first matching triggered dialog handles the message.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

::right::


Split Starbucks into small triggered intents:

```bubblescript
dialog __main__ do
  say "Welcome to Starbucks"
  show image "https://storage.googleapis.com/botsquad-assets/workshop/starbucks.jpg"
  say "What can I do for you?"
end

dialog trigger: "about" do
  say "We serve delicious coffees and pastries."
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

<div class="exercise">

Exercise:

- Add a `menu | card` trigger.
- Make it say that Starbucks serves coffee, tea, and dessert.
- Add one trigger for opening hours.
- Test the wording by sending short user messages, not full sentences.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/match_engine.md
</div>

---
layout: two-cols-header
---

## Special Dialogs

::left::


<div class="concept">

Concept:

- `__main__` is the entry point.
- `__root__` runs when there are no more dialogs left to execute.
- `__unknown__` runs when the user says something that matches no trigger.
- `__closed__` runs when the conversation is closing.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

::right::


Starbucks fallback behavior:

```bubblescript
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

<div class="exercise">

Exercise:

- Add `__root__` with a useful Starbucks prompt.
- Make `__unknown__` suggest examples: about, location, order, stop.
- Keep `__closed__` short and final.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---
layout: two-cols-header
---

## Invoke A Named Dialog

::left::


<div class="concept">

Concept:

- `invoke about` calls a named dialog.
- When that named dialog finishes, execution returns to the caller.
- This keeps shared content in one place.
- A named dialog can also have a trigger.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

::right::


Call the same Starbucks "about" answer from startup and from a trigger:

```bubblescript
dialog __main__ do
  say "Welcome to Starbucks"
  invoke about
  show image "starbucks.jpg"
end

dialog __root__ do
  say "What can I do for you?"
end

dialog about, trigger: "about" do
  say "We serve delicious coffees and pastries."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Dialog Stack Mental Model

Text model:

```bubblescript
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

<div class="exercise">

Exercise:

- Create a named dialog `address`.
- Invoke `address` from `__main__`.
- Give `address` a trigger: `"location | address"`.
- Keep the coordinates exactly: `[lat: 52.3326472, lon: 4.91505839]`.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/examples.md
</div>

---
layout: two-cols-header
---

## Prompt And Continue

::left::


<div class="concept">

Concept:

- `prompt` keeps prompting for user input.
- `continue` breaks out of the current prompt.
- `close` ends the whole conversation.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

::right::


Keep Starbucks open until the guest is done:

```bubblescript
dialog __main__ do
  say "Welcome to Starbucks"

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

```bubblescript
dialog __main__ do
  say "Welcome to Starbucks"

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

<div class="exercise">

Exercise:

- Use `prompt` in your main menu.
- Make `nothing | stop | bye | close` use `continue`.
- Use `close` after the prompt is finished.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---
layout: two-cols-header
---

## Random Responses

::left::


<div class="concept">

Concept:

- `random do` chooses one statement from the block.
- Use it for small wording variation.
- Keep each random branch equivalent in meaning.
- Do not hide business logic inside random responses.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

::right::


Vary the Starbucks welcome without changing the flow:

```bubblescript
dialog __main__ do
  random do
    say "Hi there"
    say "Hello"
    say "Welcome to Starbucks"
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/conditionals.md
</div>

---


## Random Responses Exercise

<div class="exercise">

Exercise:

- Add three equivalent order confirmations.
- Keep each option short.
- Do not put `ask` inside the `random` block for this exercise.

</div>



<div class="pattern">

Example target:

```bubblescript
say "We'll start preparing your #{answer}"
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---
layout: two-cols-header
---

## Once And After

::left::


<div class="concept">

Concept:

- `once do` runs each statement once, in order, across repeated visits.
- `after` runs after the once-list is exhausted.
- Use this for escalating fallback messages.
- It is useful in `__unknown__`.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/conditionals.md
</div>

::right::


Escalate Starbucks's unknown-message handling:

```bubblescript
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

<div class="exercise">

Exercise:

- Make the first `__unknown__` message suggest `about`, `location`, and `order`.
- Make the second unknown message ask the guest to type one of those words.
- In `after`, close politely.
- Avoid adding a fourth fallback line.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/conditionals.md
</div>

---

## User Intent

<div class="concept">

Concept:

- An intent identifies what the user wants to do.
- Intent classification maps messy user text to one clear bot action.
- Intents can be local (in scope to the question) or global (outside of scope)

</div>



<div class="lookup">
Lookup: https://developer.dialox.ai/platform/nlp/bubblescript
</div>

---


## User Intent Exercise

<div class="exercise">

Exercise:

- Write three user phrases that mean "about Starbucks".
- Write one phrase that looks similar but should not match the coffee shop.
- Keep the phrases as full sentences, not only keywords.

</div>



<div class="warning">

Check yourself:

- Would a human classify each phrase the same way?
- Is the intent about the user's goal, not the exact words?

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/match_engine.md
</div>

---


## Intent Classification Challenge

<div class="concept">

Concept:

- Similar sentences can ask for different things.
- Keyword-only matching is often too broad.
- Use BML to describe the sentence shape you expect.

</div>



Try to classify:

```bubblescript
Tell me about the coffee shop
Tell me about the weather
Can you explain about the place starbucks?
```

Goal:

- coffee shop phrases should hit Starbucks.
- Weather phrases should be ignored or handled elsewhere.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---


## Bubblescript Matching Language

<div class="concept">

Concept:

- BML is sentence-level matching for user messages.
- It is like regular expressions for tokens and phrases.
- `|` means "or".
- `_` matches a short span of unrelated words.
- Parentheses group alternatives.

</div>



<div class="pattern">

Example pattern:

```bubblescript
about _ (coffee shop | starbucks)
```

</div>



This matches:

```bubblescript
Tell me about the coffee shop
Can you explain about the place starbucks?
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---


## Bubblescript Matching Language Exercise

<div class="exercise">

Exercise:

- Start with `about _ (coffee shop | starbucks)`.
- Add one extra Starbucks synonym, such as `place`.
- Keep the weather example out of the match.

</div>



<div class="pattern">

Example target:

```bubblescript
about _ (coffee shop | starbucks | place)
```

</div>



<div class="warning">

Check yourself:

- Does "Tell me about the weather" still fail to match?
- Does "Tell me about the place starbucks" still match?

</div>



<div class="lookup">
Lookup: https://bml.dialox.ai/
</div>

---


## Intent Definition

<div class="concept">

Concept:

- `intent(match: [...])` gives a nameable intent to one or more BML patterns.
- A dialog can trigger on that intent.
- The dialog body remains normal Bubblescript.

</div>



Example:

```bubblescript
dialog trigger: intent(match: ["about _ (coffee shop | starbucks)"]) do
  say "We serve delicious coffees and pastries."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---


## Intent Definition Exercise

<div class="exercise">

Exercise:

- Add a second match phrase for "tell me about starbucks".
- Keep both phrases inside the same `match` list.
- Change the answer to mention delicious coffees and pastries.

Starting point:

</div>



```bubblescript
dialog trigger: intent(match: ["about _ (coffee shop | starbucks)"]) do
  say "We serve delicious coffees and pastries."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## Global Constants

<div class="concept">

Concept:

- Put reusable intents in global constants.
- Constants start with `@`.
- Triggered dialogs can use the constant instead of repeating the intent definition.

</div>



Example:

```bubblescript
@about intent(
         match: ["about _ (coffee shop | starbucks)"]
       )

dialog trigger: @about do
  say "We serve delicious coffees and pastries."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---


## Global Constants Exercise

<div class="exercise">

Exercise:

- Create `@weather` for weather questions.
- Create `@about` for Starbucks questions.
- Make sure coffee shop and weather messages trigger different dialogs.

</div>



<div class="pattern">

Example target:

```bubblescript
@weather intent(match: ["weather | forecast"])
@about   intent(match: ["about _ (coffee shop | starbucks)"])
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/constants.md
</div>

---


## Short Form Dialog Notation

<div class="concept">

Concept:

- Short-form dialogs keep routing code compact.
- Use it when the triggered action is a single statement.
- It reads well for intent-to-dialog routing.

</div>



Example:

```bubblescript
@about intent(
         match: ["about _ (coffee shop | starbucks)"]
       )

dialog trigger: @about, do: invoke about
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## Short Form Dialog Notation Exercise

<div class="exercise">

Exercise:

- Convert a multi-line `dialog trigger: @about do` block to short form.
- Use `invoke about`.
- Leave the named `dialog about do` unchanged.

</div>



<div class="pattern">

Example target:

```bubblescript
dialog trigger: @about, do: invoke about
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Intent, Trigger, Dialog Pattern

<div class="concept">

Concept:

- Define the intent once.
- Route the trigger to a named dialog.
- Keep the answer in the named dialog.
- This separates matching from conversation content.

</div>



Example:

```bubblescript
@about   intent(match: ["about _ (coffee shop | starbucks)"])
@address intent(match: ["what _ (location | address)", "where be _ (you | coffee shop)"])
@order   intent(match: ["i _ order", "i _ buy"])
@close   intent(match: ["bye | close | stop | goodbye | exit"])

dialog trigger: @about, do: invoke about
dialog trigger: @address, do: invoke address
dialog trigger: @order, do: invoke order
dialog trigger: @close, do: close

dialog about do
  say "We serve delicious coffees and pastries."
end

dialog address do
  say "We are located at Joan Muyskenweg 22 in Amsterdam"
end

dialog order do
  ask "What would you like to order?"
  say "We'll start preparing your #{answer}"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## Intent, Trigger, Dialog Pattern Exercise

<div class="exercise">

Exercise:

- Add `@hours` with phrases for opening hours.
- Route `@hours` to `invoke hours`.
- Add `dialog hours do` with one clear answer.

</div>



<div class="warning">

Check yourself:

- Is the intent definition at the top?
- Is the trigger only routing?
- Is the answer in the named dialog?

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/examples.md
</div>

---


## Examples Of BML

<div class="concept">

Concept:

- BML can match exact words, alternatives, and short gaps.
- Use `_` when the user may add small filler phrases.
- Use alternatives when several words mean the same route.

Weather examples:

</div>



```bubblescript
what _ be _ weather
weather | forecast
what _ forecast
```

Example utterances:

```bubblescript
What is the weather?
What will the weather be today?
Tell me the forecast
```

<div class="lookup">
Lookup: https://bml.dialox.ai/
</div>

---


## Examples Of BML Exercise

<div class="exercise">

Exercise:

- Add one phrase for "menu".
- Add one phrase for "book a table".
- Do not make either phrase match "weather".

Starting point:

</div>



```bubblescript
@menu intent(match: ["menu | card"])
@booking intent(match: ["book _ table"])
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---


## Inner Dialog Labels

<div class="concept">

Concept:

- Inner dialogs can be shown as labeled choices inside a prompt.
- Labels are useful when the channel supports buttons or menu-like options.
- Each label can invoke the same named dialog used by text triggers.

</div>



Example:

```bubblescript
dialog __main__ do
  prompt ["What can I do for you today?", "What else can I do for you?"]

  dialog label: "About", do: invoke about
  dialog label: "Location", do: invoke address
  dialog label: "Order", do: invoke order
  dialog label: "Nothing", do: close
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## Inner Dialog Labels Exercise

<div class="exercise">

Exercise:

- Add a `Menu` label that invokes `menu`.
- Add a matching named `dialog menu do`.
- Keep the label short enough for a button.

</div>



<div class="pattern">

Example target:

```bubblescript
dialog label: "Menu", do: invoke menu
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## Quick Replies

<div class="concept">

Concept:

- `quick_replies:` suggests visible answer buttons.
- The user can still type something else.
- Use quick replies when you want to guide input without hard validation.

</div>



Example:

```bubblescript
dialog order do
  say "Let's take your order..."

  ask "What coffee would you like to order?",
    quick_replies: ["Latte", "Cappuccino", "Frappuccino"]

  say "We'll start preparing your #{answer}!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## Quick Replies Exercise

<div class="exercise">

Exercise:

- Add `Macchiato` to the quick replies.
- Keep the question text unchanged.
- Type an answer that is not shown as a quick reply and observe that it can still continue.

</div>



<div class="pattern">

Example target:

```bubblescript
quick_replies: ["Latte", "Cappuccino", "Frappuccino", "Macchiato"]
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Expecting

<div class="concept">

Concept:

- `expecting:` validates or classifies the answer to an `ask`.
- With a list of strings, only those matches are accepted.
- Use it when the bot needs one of a controlled set of answers.

</div>



Example:

```bubblescript
dialog order do
  say "Let's take your order..."

  ask "What coffee would you like to order?",
    expecting: ["Latte", "Cappuccino", "Frappuccino"]

  say "We'll start preparing your #{answer}!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## Expecting Exercise

<div class="exercise">

Exercise:

- Add `Espresso` to the accepted coffee list.
- Try `tea` and confirm it is not accepted by the list.
- Keep the confirmation line using `#{answer}`.

</div>



<div class="pattern">

Example target:

```bubblescript
expecting: ["Latte", "Cappuccino", "Frappuccino", "Espresso"]
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---


## Inner Dialog Triggers

<div class="concept">

Concept:

- Inner triggers belong to the surrounding dialog.
- They handle special answers while the bot is inside that dialog.
- Use `dialog __unknown__` inside the dialog for local fallback copy.

</div>



Example:

```bubblescript
dialog order do
  say "Let's take your order..."

  ask "What coffee would you like to order?",
    expecting: ["Latte", "Cappuccino", "Frappuccino"]

  say "We'll start preparing your #{answer}!"

  dialog trigger: "pumpkin spice" do
    say "The pumpkin spice Coffee is out of order"
  end

  dialog trigger: "tea" do
    say "We don't serve teas, only coffees"
  end

  dialog __unknown__ do
    say "Sorry, that is not on our menu..."
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## Inner Dialog Triggers Exercise

<div class="exercise">

Exercise:

- Add an inner trigger for `calzone`.
- Make it say that calzone is only available at lunch.
- Add or improve the inner `__unknown__` fallback.

</div>



<div class="warning">

Check yourself:

- Does the fallback talk about the coffee menu, not the whole bot?
- Are these triggers inside `dialog order do`?

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## __returning__

<div class="concept">

Concept:

- `__returning__` runs when control returns to a dialog.
- It is useful after a nested triggered dialog handled a side case.
- Keep it short: remind the user what they were doing.

</div>



Example:

```bubblescript
dialog order do
  say "Let's take your order..."

  ask "What coffee would you like to order?",
    expecting: ["Latte", "Cappuccino", "Frappuccino"]

  say "We'll start preparing your #{answer}!"

  dialog trigger: "pumpkin spice", do: say "The pumpkin spice Coffee is out of order"
  dialog trigger: "tea"  , do: say "We don't serve teas, only coffees"
  dialog __unknown__       , do: say "Sorry, that is not on our menu..."

  dialog __returning__ do
    say "Let's continue with your order..."
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## __returning__ Exercise

<div class="exercise">

Exercise:

- Add a `__returning__` dialog to the order flow.
- Make it remind the guest to choose a coffee.
- Keep the message shorter than one sentence.

</div>



<div class="pattern">

Example target:

```bubblescript
dialog __returning__ do
  say "Back to your coffee order..."
end
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## Lists

<div class="concept">

Concept:

- Lists hold multiple values in order.
- Use lists for menus, accepted answers, order lines, and other repeated data.
- `repeat item in list do` is the common way to visit every item.

</div>



Example:

```bubblescript
dialog order do
  menu = ["Latte", "Cappuccino", "Frappuccino"]

  say "We serve #{length(menu)} different coffees:"

  repeat item in menu do
    say item
  end

  ask "What coffee would you like to order?", expecting: menu

  say "We'll start preparing your #{answer}!"

  dialog __unknown__, do: say "Sorry, we only serve #{join_and(menu)}..."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/language.md
</div>

---


## Lists Exercise

<div class="exercise">

Exercise:

- Add `Espresso` to the `menu` list.
- Change the copy from `different coffees` to `house coffees`.
- Keep `expecting: menu`, so the validation follows the list automatically.

</div>



<div class="pattern">

Example target:

```bubblescript
menu = ["Latte", "Cappuccino", "Frappuccino", "Espresso"]
```

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Maps And Global Constants

<div class="concept">

Concept:

- Maps group related fields, like a title and image URL for one menu item.
- Global constants start with `@` and are reusable across dialogs and tasks.
- `pluck(@menu, "title")` extracts one field from each map.

</div>



Example:

```bubblescript
@base_url "https://storage.googleapis.com/botsquad-assets/workshop/"

@menu [
  %{title: "Coffee Latte", image_url: @base_url + "coffee_latte.jpg"},
  %{title: "Coffee Cappuccino", image_url: @base_url + "coffee_cap.jpg"},
  %{title: "Coffee Frappuccino", image_url: @base_url + "coffee_frap.jpg"}
]

@menu_titles pluck(@menu, "title")

dialog order do
  say "We serve #{length(@menu)} different coffees:"

  ask "What coffee would you like to order?",
    quick_replies: @menu,
    expecting: @menu_titles

  say "We'll start preparing your #{answer}!"

  dialog __unknown__, do: say "Sorry, we only serve #{join_and(@menu_titles)}..."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/language.md
</div>

---


## Item Picker

<div class="concept">

Concept:

- `input_method("item_picker", ...)` creates a richer picker for menu items.
- Each item can carry display fields like `title`, `subtitle`, and `image_url`.
- Widget submissions are structured: use `answer.data` for the stored value.
- Use `answer.text` when you need the display text the user saw.

</div>



Example:

```bubblescript
@base_url "https://storage.googleapis.com/botsquad-assets/workshop/"

@menu [
  %{value: "Latte", title: "Coffee Latte", image_url: @base_url + "coffee_latte.jpg", subtitle: "$5.95"},
  %{value: "Cappuccino", title: "Coffee Cappuccino", image_url: @base_url + "coffee_cap.jpg", subtitle: "$6.95"},
  %{value: "Frappuccino", title: "Coffee Frappuccino", image_url: @base_url + "coffee_frap.jpg", subtitle: "$7.95"}
]

dialog order do
  item_picker = input_method("item_picker",
    caption: "Please select",
    mode: "single",
    items: @menu)

  ask "What coffee would you like to order?",
    expecting: item_picker

  order = [answer.data]
  say "We'll start preparing your #{answer.text}!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## UI Widgets

<div class="concept">

Concept:

- Input methods describe what the channel should render when asking the user.
- Channel support differs, so treat widgets as capability-based UI.
- Start with the simplest widget that makes the answer clear.

Common widget capabilities:

- List
- Gallery/Card
- Buttons
- Text
- Multi select
- Form
- Location picker
- Numeric
- Wait control
- Closed control

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---


## Conditionals

<div class="concept">

Concept:

- Use `if` for one yes/no decision.
- Use `branch` when several cases are easier to read as a table.
- Always keep the fallback path explicit when the bot has to continue.

</div>



Example:

```bubblescript
if length(order) > 0 do
  say "Ok, we'll prepare your #{join_and(order)}"
else
  say "You didn't order anything"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Conditionals With Branch

Example:

```bubblescript
branch do
  order == nil       -> say "You ordered nothing"
  length(order) == 1 -> say "We'll prepare your coffee"
  length(order) < 3  -> say "We'll prepare your coffees"
else
  say "You ordered too many coffees"
end

branch length(order) do
  0 -> say "You've ordered nothing"
  1 -> say "We'll prepare your coffee"
  2 -> say "We'll prepare your coffees"
else
  say "You ordered too many coffees"
end
```

<div class="warning">

Check yourself:

- The first branch checks full expressions.
- The second branch matches against `length(order)`.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Guards

<div class="concept">

Concept:

- `when` guards choose a dialog variant before the dialog body runs.
- Put the most specific guarded dialogs above the default dialog.
- Guards are useful for order limits, missing data, and state-dependent flow.

</div>



Example:

```bubblescript
dialog order_line when length(order) >= 5 do
  say "You reached the maximum order size..."
end

dialog order_line when length(order) == 0 do
  ask "What coffee would you like to order?"
  invoke order_line
end

dialog order_line do
  ask "Do you want another coffee?"
  invoke order_line
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---


## Entities

<div class="concept">

Concept:

- Entities extract structured values from natural language.
- `entity(match: "[time=pickup_time]")` asks for a time and stores the matched value under `pickup_time`.
- Use the structured value for formatting, calculations, and validation.

</div>



Example:

```bubblescript
@datetime entity(match: "[time=pickup_time]")

dialog ask_pickup_time do
  ask "When would you like to pick up your order?", expecting: @datetime
  pickup_time = date_format(answer.pickup_time, "{D} {Mfull} at {h24}:{0m}")

  dialog __unknown__ do
    say "That doesn't seem to be a valid date or time"
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/entities.md
</div>

---
layout: two-cols-header
---

## Tasks

::left::


<div class="concept">

Concept:

- `perform` runs a `task`.
- Tasks are good for calculations, side effects, and reusable workflow steps.
- Variables set in a task can be used after `perform` completes.

</div>



<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/tasks.md
</div>

::right::


Example:

```bubblescript
perform calculate_price
say "The total price is $ #{total}"

task calculate_price do
  total = 0

  repeat item in order do
    coffee = first(@menu[value: item])
    price = replace(coffee.subtitle, "$", "")
    total = total + number(price)
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/tasks.md
</div>

---


## CMS

<div class="concept">

Concept:

- Content can live outside the dialog when the same data is reused often.
- A CMS or content file can expose constants like `@menu`.
- Dialogs can stay focused on conversation flow instead of data entry.

</div>



Example:

```bubblescript
dialog main do
  repeat item in @menu do
    say item.title
  end
end
```

<div class="lookup">
Lookup: Studio content and CMS documentation
</div>

---


## Intent YAML

<div class="concept">

Concept:

- Intent YAML keeps training utterances close to the intent they teach.
- Use it for reusable intents like `about`, opening hours, or support questions.
- Keep utterances realistic: short phrases people might actually type.

Compact example:

</div>



```bubblescript
intents:
  about:
    utterances:
      - what is Starbucks
      - tell me about this coffee shop
      - who are you
```

<div class="lookup">
Lookup: Studio intent and NLP documentation
</div>

---


## User Data

<div class="concept">

Concept:

- `user` stores data about the current user.
- `remember` persists a value so it is available in later conversations.
- Only remember data the bot should actually reuse.

</div>



Example:

```bubblescript
@email entity(match: "[email]")

dialog ask_email do
  ask "What is your email address?", expecting: @email
  user.email = answer.email
  remember user.email

  dialog __unknown__, do: say "That isn't a valid email address"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/user-data.md
</div>

---


## Tagging

<div class="concept">

Concept:

- Tags mark that something important happened.
- They are useful for analytics, segmentation, and follow-up automation.
- Place tags after the action they represent has succeeded.

</div>



Example:

```bubblescript
dialog confirm do
  perform calculate_price
  say "The total price is $ #{total}"
  say "We will prepare your order for #{pickup_time}"
  perform send_order
  tag "ordered"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---


## Mail

<div class="concept">

Concept:

- A task can send an email after the order is confirmed.
- Build the message from the order, total, and pickup time.
- Keep mail tasks small so they are easy to replace with another integration later.

</div>



Example:

```bubblescript
task send_order do
  summary = "
  You ordered:\n - #{join(order, "\n - ")}\n
  Total price: #{total}\n
  Please pickup at #{pickup_time}"

  mail user.email, "Order Confirmation", summary
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/tasks.md
</div>

---


## PWA Settings

<div class="concept">

Concept:

- PWA settings control how the bot appears when installed as an app.
- Keep configuration short and brand-specific.
- This is platform configuration, not conversation logic.

Compact example:

</div>



```bubblescript
manifest:
  background_color: "#f6f6f6"
  display: standalone
  orientation: portrait
  theme_color: "#883ad0"
splash_screen:
  title: Starbucks
  description: Order your coffees
  call_to_action: Start
appearance: app
```

<div class="lookup">
Lookup: Studio PWA settings
</div>

---


## Variables

<div class="concept">

Concept:

- Variables can hold strings, integers, lists, maps, and structured answers.
- Name variables after the thing they represent.
- Reassign only when the new value is still the same concept.

</div>



Example:

```bubblescript
# string
v = "This is a string"
say v

# integer
v = 10
say v

# list
v = ["a", "b"]
say first(v)
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/language.md
</div>

---


## When You Have A New Idea

Start by naming the shape of the idea:

- Need to say or show something? Use statements: `say`, `ask`, `show`, `prompt`, `show card`, `show carousel`.
- Need to catch user wording? Use BML intents and examples.
- Need choices? Use `prompt`, quick replies, buttons, or a constrained input method.
- Need reusable data? Use constants, lists, maps, and clear variable names.
- Need decisions? Use `if`, `branch`, guards, and small confirmation dialogs.
- Need background work? Use tasks for non-interactive work.
- Need persistence or integrations? Use `remember`, tags, mail, CMS, or the platform docs.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/getting_started.md
</div>

---


## Docs Lookup Map

- Getting started: `botsi_platform/docs/docs/bubblescript/getting_started.md`
- Dialogs: `botsi_platform/docs/docs/bubblescript/dialogs.md`
- Statements: `botsi_platform/docs/docs/bubblescript/statements.md`
- BML: `botsi_platform/docs/docs/bubblescript/bml.md`
- Variables: `botsi_platform/docs/docs/bubblescript/variables.md`
- Constants: `botsi_platform/docs/docs/bubblescript/constants.md`
- Tasks: `botsi_platform/docs/docs/bubblescript/tasks.md`
- Schemas: `botsi_platform/docs/docs/bubblescript/schemas.md`

---


## Final Exercise

<div class="exercise">

Extend the Starbucks bot with one new capability.

Pick one:

- Add a dessert menu with prices and a total update.
- Validate pickup time against opening hours.
- Send an email confirmation after checkout.
- Add an order-size guard for large group orders.
- Improve fallback handling when the guest asks for something outside the menu.

Keep the extension small:

1. Add the smallest working version.
2. Test the happy path.
3. Test one wrong or surprising user answer.
4. Add a lookup note for the docs you used.

</div>

---


<div class="chapter-label">Enreach · DialoX</div>

# This Deck Is The Narrative Source

<div class="lookup">
Slides.com was the migration seed; this deck is now the narrative source.
</div>
iv>
