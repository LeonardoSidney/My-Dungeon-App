# Playground prototype: sessions

> **Status:** proposal, not implemented. Today the Playground is a single text (the fixed `home` draft) that generates with the first loaded model and the default sampler, without letting the player choose either.

This document describes how to turn the Playground into a **test bench**: many independent sessions, each with its own text, assistant and sampler, saved automatically and never mixed with the adventures.

## Why

The Playground exists to answer questions like "how does this model continue this text?" or "what changes if I raise the temperature?". Today it cannot answer them:

- there is only one text, so trying a variation overwrites the previous one;
- the model and sampler are picked for the player, so neither can be compared;
- nothing connects it to the adventures, so testing a sampler on a real table means changing the table itself.

## Sessions

The Playground becomes a list of sessions, like a notes app:

```
Playground
┌─────────────────────────────────────────────┐
│ + New session                               │
│ ▸ Testing Qwen with Creative      2h ago    │
│ ▸ Lost Kingdom prompt (copy)      yesterday │
│ ▸ Mirostat experiments            3 days ago│
└─────────────────────────────────────────────┘
```

### Saving

- **No save button.** A session saves itself when its text or settings change and when a generation finishes.
- **Keeping a version means duplicating the session.** One session is one line of experiments; another idea gets another session.

### Where a session comes from

| Action | Result |
| --- | --- |
| **New session** | Empty text, the default assistant and its sampler. |
| **Duplicate** | A copy of the session to try a variation without losing the original. |
| **Open in Playground** (from an adventure's prompt screen) | A session holding a **copy** of the prompt built for that adventure. The adventure is never changed; it is only kept as a reference to where the text came from. |

## A session's screen

```
Testing Qwen with Creative            ⚙
┌─ 1 · Assistant ── Qwen Local  [Change]
├─ 2 · Sampler ──── Creative    [Change]
└─ 3 · Parameters ─ 2 changed   [Adjust]
───────────────────────────────────────
 Once upon a time, in a forgotten realm...▌
───────────────────────────────────────
 [▶ Generate]   42 tok/s · 380 tokens
```

- **Assistant and sampler** reuse the step cards of the adventure settings (`GenerationSourceCard`, `SamplerParameters`).
- **Parameters stay in the session.** Unlike the adventure settings, where edits are saved to the sampler itself, the Playground is for experimenting: changing a value never touches the sampler. A **Save as new sampler** button turns an experiment into a real sampler, so a variation worth keeping becomes its own instance.
- **Generation metrics.** llama.cpp answers with timings and token counts; showing tokens per second and the reply size fits a test bench.

## Generation history (second step)

Every generation can be recorded in the session: model, sampler, parameter values, date and the generated text, with the option to go back to any of them. This compares "temperature 0.8 gave this, 1.2 gave that" without duplicating sessions.

## Backend sketch

| Piece | Change |
| --- | --- |
| Entity | `Draft` (`id`, `content`, dates) evolves into a `PlaygroundSession`: name, content, assistant, sampler, parameter values, optional source adventure, dates. |
| Migration | The current `home` draft becomes the first session, so nothing is lost. |
| Use cases | Create, duplicate, rename, delete, list and save sessions; "save as new sampler" reuses `CreateSamplerUseCase`. |
| Generation | Uses the session's assistant and sampler, with the session's parameter values applied on top of the sampler, instead of the first loaded model and the default sampler. |
| Open in Playground | Builds the adventure prompt with the existing templated prompt use case and creates a session with a copy of it. |

## Open questions

1. **Parameters:** local to the session with "Save as new sampler" (proposed), or edit the sampler itself like the adventure settings do?
2. **History:** in the first version, or sessions and settings first?
3. **Open in Playground:** in the first version, or later?

---

_These ideas were developed with the assistance of Claude (Anthropic)._
