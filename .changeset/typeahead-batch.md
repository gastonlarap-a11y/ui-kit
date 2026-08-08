---
"@galarap/ui": minor
---

Add `Combobox` and `Autocomplete`, the two typeahead controls.

`Combobox` is the "select with a search box" the kit was missing. `Select` makes you scan
a list; `Combobox` filters it as you type while keeping the listbox semantics, and still
refuses anything that is not one of your items. `multiple` turns the input into removable
chips, one per selection, with the text cursor after them.

`Autocomplete` looks almost identical and answers a different question: there the typed
text _is_ the value and the suggestions are only a shortcut. Use it for search boxes and
for fields that accept anything but usually repeat. The short version — if a typo should
be rejected, you want `Combobox`; if a typo is a valid answer, you want `Autocomplete`.

Both bundle the portal, positioner, popup and list, so you compose the items and nothing
else. The empty state is a prop rather than a child: Base UI renders it as a sibling of
the list, and passing it as a child would put it inside, where it would be treated as an
item.

The render function's item is typed `never` instead of Base UI's `any`, so annotating it
yourself — `{(fruit: Fruit) => …}` — keeps `any` out of the kit's public types entirely.

Their shared styling lives in one internal module, because a user cannot tell which of the
two a given field is and two controls that should look identical must not drift apart.
