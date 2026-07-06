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

---

## User Intent

Concept:

- An intent identifies what the user wants to do.
- Intent classification maps messy user text to one clear bot action.
- In Restaurant Sienna, "Tell me about the restaurant" should route to the about answer.
- "Tell me about the weather" should not route to the restaurant answer.

Example user text:

```text
i want to know the weather forecast for today
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## User Intent Exercise

Exercise:

- Write three user phrases that mean "about Restaurant Sienna".
- Write one phrase that looks similar but should not match the restaurant.
- Keep the phrases as full sentences, not only keywords.

Check yourself:

- Would a human classify each phrase the same way?
- Is the intent about the user's goal, not the exact words?

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/match_engine.md
</div>

---

## Intent Classification Challenge

Concept:

- Similar sentences can ask for different things.
- Keyword-only matching is often too broad.
- Use BML to describe the sentence shape you expect.

Try to classify:

```text
Tell me about the restaurant
Tell me about the weather
Can you explain about the place sienna?
```

Goal:

- Restaurant phrases should hit Restaurant Sienna.
- Weather phrases should be ignored or handled elsewhere.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Bubblescript Matching Language

Concept:

- BML is sentence-level matching for user messages.
- It is like regular expressions for tokens and phrases.
- `|` means "or".
- `_` matches a short span of unrelated words.
- Parentheses group alternatives.

Example pattern:

```text
about _ (restaurant | sienna)
```

This matches:

```text
Tell me about the restaurant
Can you explain about the place sienna?
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Bubblescript Matching Language Exercise

Exercise:

- Start with `about _ (restaurant | sienna)`.
- Add one extra Restaurant Sienna synonym, such as `place`.
- Keep the weather example out of the match.

Example target:

```text
about _ (restaurant | sienna | place)
```

Check yourself:

- Does "Tell me about the weather" still fail to match?
- Does "Tell me about the place sienna" still match?

<div class="lookup">
Lookup: https://bml.dialox.ai/
</div>

---

## Intent Definition

Concept:

- `intent(match: [...])` gives a nameable intent to one or more BML patterns.
- A dialog can trigger on that intent.
- The dialog body remains normal Bubblescript.

Example:

```text
dialog trigger: intent(match: ["about _ (restaurant | sienna)"]) do
  say "We serve traditional Italian pizza's."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Intent Definition Exercise

Exercise:

- Add a second match phrase for "tell me about sienna".
- Keep both phrases inside the same `match` list.
- Change the answer to mention traditional Italian pizzas.

Starting point:

```text
dialog trigger: intent(match: ["about _ (restaurant | sienna)"]) do
  say "We serve traditional Italian pizza's."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Global Constants

Concept:

- Put reusable intents in global constants.
- Constants start with `@`.
- Triggered dialogs can use the constant instead of repeating the intent definition.

Example:

```text
@about intent(
         match: ["about _ (restaurant | sienna)"]
       )

dialog trigger: @about do
  say "We serve traditional Italian pizza's."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Global Constants Exercise

Exercise:

- Create `@weather` for weather questions.
- Create `@about` for Restaurant Sienna questions.
- Make sure restaurant and weather messages trigger different dialogs.

Example target:

```text
@weather intent(match: ["weather | forecast"])
@about   intent(match: ["about _ (restaurant | sienna)"])
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/constants.md
</div>

---

## Short Form Dialog Notation

Concept:

- Short-form dialogs keep routing code compact.
- Use it when the triggered action is a single statement.
- It reads well for intent-to-dialog routing.

Example:

```text
@about intent(
         match: ["about _ (restaurant | sienna)"]
       )

dialog trigger: @about, do: invoke about
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Short Form Dialog Notation Exercise

Exercise:

- Convert a multi-line `dialog trigger: @about do` block to short form.
- Use `invoke about`.
- Leave the named `dialog about do` unchanged.

Example target:

```text
dialog trigger: @about, do: invoke about
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Intent, Trigger, Dialog Pattern

Concept:

- Define the intent once.
- Route the trigger to a named dialog.
- Keep the answer in the named dialog.
- This separates matching from conversation content.

Example:

```text
@about   intent(match: ["about _ (restaurant | sienna)"])
@address intent(match: ["what _ (location | address)", "where be _ (you | restaurant)"])
@order   intent(match: ["i _ order", "i _ buy"])
@close   intent(match: ["bye | close | stop | goodbye | exit"])

dialog trigger: @about, do: invoke about
dialog trigger: @address, do: invoke address
dialog trigger: @order, do: invoke order
dialog trigger: @close, do: close

dialog about do
  say "We serve traditional Italian pizza's."
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

Exercise:

- Add `@hours` with phrases for opening hours.
- Route `@hours` to `invoke hours`.
- Add `dialog hours do` with one clear answer.

Check yourself:

- Is the intent definition at the top?
- Is the trigger only routing?
- Is the answer in the named dialog?

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/examples.md
</div>

---

## Examples Of BML

Concept:

- BML can match exact words, alternatives, and short gaps.
- Use `_` when the user may add small filler phrases.
- Use alternatives when several words mean the same route.

Weather examples:

```text
what _ be _ weather
weather | forecast
what _ forecast
```

Example utterances:

```text
What is the weather?
What will the weather be today?
Tell me the forecast
```

<div class="lookup">
Lookup: https://bml.dialox.ai/
</div>

---

## Examples Of BML Exercise

Exercise:

- Add one phrase for "menu".
- Add one phrase for "book a table".
- Do not make either phrase match "weather".

Starting point:

```text
@menu intent(match: ["menu | card"])
@booking intent(match: ["book _ table"])
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Inner Dialog Labels

Concept:

- Inner dialogs can be shown as labeled choices inside a prompt.
- Labels are useful when the channel supports buttons or menu-like options.
- Each label can invoke the same named dialog used by text triggers.

Example:

```text
dialog __main__ do
  prompt ["What can I do for you today?", "What else can I do for you?"]

  dialog label: "About", do: invoke about
  dialog label: "Location", do: invoke address
  dialog label: "Order", do: invoke order
  dialog label: "Nothing", do: invoke close
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Inner Dialog Labels Exercise

Exercise:

- Add a `Menu` label that invokes `menu`.
- Add a matching named `dialog menu do`.
- Keep the label short enough for a button.

Example target:

```text
dialog label: "Menu", do: invoke menu
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Quick Replies

Concept:

- `quick_replies:` suggests visible answer buttons.
- The user can still type something else.
- Use quick replies when you want to guide input without hard validation.

Example:

```text
dialog order do
  say "Let's take your order..."

  ask "What pizza would you like to order?",
    quick_replies: ["Margherita", "Pepperoni", "Hawaii"]

  say "We'll start preparing your #{answer}!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Quick Replies Exercise

Exercise:

- Add `Quattro Formaggi` to the quick replies.
- Keep the question text unchanged.
- Type an answer that is not shown as a quick reply and observe that it can still continue.

Example target:

```text
quick_replies: ["Margherita", "Pepperoni", "Hawaii", "Quattro Formaggi"]
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Expecting

Concept:

- `expecting:` validates or classifies the answer to an `ask`.
- With a list of strings, only those matches are accepted.
- Use it when the bot needs one of a controlled set of answers.

Example:

```text
dialog order do
  say "Let's take your order..."

  ask "What pizza would you like to order?",
    expecting: ["Margherita", "Pepperoni", "Hawaii"]

  say "We'll start preparing your #{answer}!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Expecting Exercise

Exercise:

- Add `Marinara` to the accepted pizza list.
- Try `Pasta` and confirm it is not accepted by the list.
- Keep the confirmation line using `#{answer}`.

Example target:

```text
expecting: ["Margherita", "Pepperoni", "Hawaii", "Marinara"]
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/bml.md
</div>

---

## Inner Dialog Triggers

Concept:

- Inner triggers belong to the surrounding dialog.
- They handle special answers while the bot is inside that dialog.
- Use `dialog __unknown__` inside the dialog for local fallback copy.

Example:

```text
dialog order do
  say "Let's take your order..."

  ask "What pizza would you like to order?",
    expecting: ["Margherita", "Pepperoni", "Hawaii"]

  say "We'll start preparing your #{answer}!"

  dialog trigger: "caprese" do
    say "The Caprese Pizza is out of order"
  end

  dialog trigger: "pasta" do
    say "We don't serve pasta's, only pizza's"
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

Exercise:

- Add an inner trigger for `calzone`.
- Make it say that calzone is only available at lunch.
- Add or improve the inner `__unknown__` fallback.

Check yourself:

- Does the fallback talk about the pizza menu, not the whole bot?
- Are these triggers inside `dialog order do`?

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## __returning__

Concept:

- `__returning__` runs when control returns to a dialog.
- It is useful after a nested triggered dialog handled a side case.
- Keep it short: remind the user what they were doing.

Example:

```text
dialog order do
  say "Let's take your order..."

  ask "What pizza would you like to order?",
    expecting: ["Margherita", "Pepperoni", "Hawaii"]

  say "We'll start preparing your #{answer}!"

  dialog trigger: "caprese", do: say "The Caprese Pizza is out of order"
  dialog trigger: "pasta"  , do: say "We don't serve pasta's, only pizza's"
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

Exercise:

- Add a `__returning__` dialog to the order flow.
- Make it remind the guest to choose a pizza.
- Keep the message shorter than one sentence.

Example target:

```text
dialog __returning__ do
  say "Back to your pizza order..."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Lists

Concept:

- Lists hold multiple values in order.
- Use lists for menus, accepted answers, order lines, and other repeated data.
- `repeat item in list do` is the common way to visit every item.

Example:

```text
dialog order do
  menu = ["Margherita", "Pepperoni", "Hawaii"]

  say "We serve #{length(menu)} different pizzas:"

  repeat item in menu do
    say item
  end

  ask "What pizza would you like to order?", expecting: menu

  say "We'll start preparing your #{answer}!"

  dialog __unknown__, do: say "Sorry, we only serve #{join_and(menu)}..."
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/language.md
</div>

---

## Lists Exercise

Exercise:

- Add `Marinara` to the `menu` list.
- Change the copy from `different pizzas` to `house pizzas`.
- Keep `expecting: menu`, so the validation follows the list automatically.

Example target:

```text
menu = ["Margherita", "Pepperoni", "Hawaii", "Marinara"]
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Maps And Global Constants

Concept:

- Maps group related fields, like a title and image URL for one menu item.
- Global constants start with `@` and are reusable across dialogs and tasks.
- `pluck(@menu, "title")` extracts one field from each map.

Example:

```text
@base_url "https://storage.googleapis.com/botsquad-assets/workshop/"

@menu [
  %{title: "Pizza Margherita", image_url: @base_url + "pizza_marg.jpg"},
  %{title: "Pizza Pepperoni", image_url: @base_url + "pizza_pep.jpg"},
  %{title: "Pizza Hawaii", image_url: @base_url + "pizza_haw.jpg"}
]

@menu_titles pluck(@menu, "title")

dialog order do
  say "We serve #{length(@menu)} different pizzas:"

  ask "What pizza would you like to order?",
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

Concept:

- `input_method("item_picker", ...)` creates a richer picker for menu items.
- Each item can carry display fields like `title`, `subtitle`, and `image_url`.
- `value` is the value stored in `answer` when the user picks that item.

Example:

```text
@base_url "https://storage.googleapis.com/botsquad-assets/workshop/"

@menu [
  %{value: "Margherita", title: "Pizza Margherita", image_url: @base_url + "pizza_marg.jpg", subtitle: "$5.95"},
  %{value: "Pepperoni", title: "Pizza Pepperoni", image_url: @base_url + "pizza_pep.jpg", subtitle: "$6.95"},
  %{value: "Hawaii", title: "Pizza Hawaii", image_url: @base_url + "pizza_haw.jpg", subtitle: "$7.95"}
]

dialog order do
  item_picker = input_method("item_picker",
    caption: "Please select",
    mode: "single",
    items: @menu)

  ask "What pizza would you like to order?",
    expecting: item_picker

  say "We'll start preparing your #{answer}!"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## UI Widgets

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

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/input.md
</div>

---

## Conditionals

Concept:

- Use `if` for one yes/no decision.
- Use `branch` when several cases are easier to read as a table.
- Always keep the fallback path explicit when the bot has to continue.

Example:

```text
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

```text
branch do
  order == nil       -> say "You ordered nothing"
  length(order) == 1 -> say "We'll prepare your pizza"
  length(order) < 3  -> say "We'll prepare your pizzas"
else
  say "You ordered too many pizzas"
end

branch length(order) do
  0 -> say "You've ordered nothing"
  1 -> say "We'll prepare your pizza"
  2 -> say "We'll prepare your pizzas"
else
  say "You ordered too many pizzas"
end
```

Check yourself:

- The first branch checks full expressions.
- The second branch matches against `length(order)`.

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/statements.md
</div>

---

## Guards

Concept:

- `when` guards choose a dialog variant before the dialog body runs.
- Put the most specific guarded dialogs above the default dialog.
- Guards are useful for order limits, missing data, and state-dependent flow.

Example:

```text
dialog order_line when length(order) >= 5 do
  say "You reached the maximum order size..."
end

dialog order_line when length(order) == 0 do
  ask "What pizza would you like to order?"
  invoke order_line
end

dialog order_line do
  ask "Do you want another pizza?"
  invoke order_line
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/dialogs.md
</div>

---

## Entities

Concept:

- Entities extract structured values from natural language.
- `entity(match: "[time=pickup_time]")` asks for a time and stores the matched value under `pickup_time`.
- Use the structured value for formatting, calculations, and validation.

Example:

```text
@datetime entity(match: "[time=pickup_time]")

dialog ask_pickup_time do
  ask "When would you like to pick up your order?", expecting: @datetime
  pickup_time = date_format(answer.pickup_time.value, "{D} {Mfull} at {h24}:{0m}")

  dialog __unknown__ do
    say "That doesn't seem to be a valid date or time"
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/entities.md
</div>

---

## Tasks

Concept:

- `perform` runs a `task`.
- Tasks are good for calculations, side effects, and reusable workflow steps.
- Variables set in a task can be used after `perform` completes.

Example:

```text
perform calculate_price
say "The total price is $ #{total}"

task calculate_price do
  total = 0

  repeat item in order do
    pizza = first(@menu[title: item])
    price = replace(pizza.subtitle, "$", "")
    total = total + number(price)
  end
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/tasks.md
</div>

---

## CMS

Concept:

- Content can live outside the dialog when the same data is reused often.
- A CMS or content file can expose constants like `@menu`.
- Dialogs can stay focused on conversation flow instead of data entry.

Example:

```text
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

Concept:

- Intent YAML keeps training utterances close to the intent they teach.
- Use it for reusable intents like `about`, opening hours, or support questions.
- Keep utterances realistic: short phrases people might actually type.

Compact example:

```text
intents:
  about:
    utterances:
      - what is Restaurant Sienna
      - tell me about this restaurant
      - who are you
```

<div class="lookup">
Lookup: Studio intent and NLP documentation
</div>

---

## User Data

Concept:

- `user` stores data about the current user.
- `remember` persists a value so it is available in later conversations.
- Only remember data the bot should actually reuse.

Example:

```text
dialog ask_email do
  ask "What is your email address?", expecting: @email
  user.email = answer.email.value
  remember user.email

  dialog __unknown__, do: say "That isn't a valid email address"
end
```

<div class="lookup">
Lookup: botsi_platform/docs/docs/bubblescript/user-data.md
</div>

---

## Tagging

Concept:

- Tags mark that something important happened.
- They are useful for analytics, segmentation, and follow-up automation.
- Place tags after the action they represent has succeeded.

Example:

```text
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

Concept:

- A task can send an email after the order is confirmed.
- Build the message from the order, total, and pickup time.
- Keep mail tasks small so they are easy to replace with another integration later.

Example:

```text
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

Concept:

- PWA settings control how the bot appears when installed as an app.
- Keep configuration short and brand-specific.
- This is platform configuration, not conversation logic.

Compact example:

```text
manifest:
  background_color: "#f0f0f0"
  display: standalone
  orientation: portrait
  theme_color: "#990000"
splash_screen:
  title: Restaurant Sienna
  description: Order your pizzas
  call_to_action: Start
appearance: app
```

<div class="lookup">
Lookup: Studio PWA settings
</div>

---

## Variables

Concept:

- Variables can hold strings, integers, lists, maps, and structured answers.
- Name variables after the thing they represent.
- Reassign only when the new value is still the same concept.

Example:

```text
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

<!-- SECTION:LOOKUP_AND_CLOSE -->
