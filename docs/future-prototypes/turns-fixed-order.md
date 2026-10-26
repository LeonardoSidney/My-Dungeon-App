# Turns prototype: fixed order

> **Status:** proposal, not implemented. Today only the world master generates replies, and it writes the lines of the AI-controlled characters itself.

This document describes the simplest multi-voice turn: every AI-controlled character speaks once, in a fixed order, and the world master closes the turn. It also defines the per-voice prompt and the llama.cpp slot rules that the [mentions prototype](./turns-mentions.md) reuses.

## Terms

| Term | Meaning |
| --- | --- |
| **Voice** | Anyone the AI speaks for: the world master (dedicated or a character in the role) and every AI-controlled character. |
| **Turn** | Everything that happens between two player messages. |
| **Step** | One voice generating one message inside a turn. |
| **Slot** | A llama.cpp server slot: one KV cache that keeps one prompt warm between requests. |

## The turn

```
player sends a message
  └─ step 1: AI character #1 replies
  └─ step 2: AI character #2 replies
  └─ ...
  └─ last step: the world master resolves the turn
player's turn again
```

Rules:

1. **Order.** AI characters speak in the order of `charactersControlledByAi`. The Cast section of the adventure settings is where the player reorders them.
2. **One line each.** Every AI character speaks exactly once per turn, and there are no extra steps.
3. **The world master always closes.** The world master's message describes the outcome of what the player and the characters did, then hands the scene back to the player.
4. **Each step sees the previous steps.** Character #2 reads what character #1 just said before replying.
5. **No AI characters.** If the adventure has no AI-controlled characters, the turn is a single world master step. That is the same behavior as today.

### Stop, errors and regeneration

| Action | Behavior |
| --- | --- |
| **Stop** | Stops the whole turn. Finished steps stay in the chat, and the running step keeps what it has streamed so far. |
| **A step fails** | The turn stops with an error. Finished steps stay, so the player can resend or continue. |
| **Regenerate a message** | Regenerates only that step, as a new version of the message. The steps after it are not rerun. |
| **Resend the player message** | Reruns the whole turn from the first step. |
| **Continue** | Continues the selected message only. |

## Adventure settings

A new **Turns** section, built frontend-first like Generation:

```
Turns
  Mode            [ Fixed order | Mentions ]
  Speaking order  1. Bram   ↑↓
                  2. Aria   ↑↓
                  then the world master closes
  Reply length    [ 200 ] tokens per character step
```

The reply length becomes `n_predict` on each character step. Short character lines keep the turn fast and stop small models from narrating for everyone.

## Per-voice prompts

Every voice gets **its own prompt**, built for that voice only. A character never sees the world master's instructions, and the world master never sees a character's private sheet beyond what the scene needs.

Keep each prompt **objective**. Small models (a 27B or smaller) follow short, direct instructions much better than long creative briefs. One task per prompt, stated plainly, at the end.

### Layout: stable first, changing last

The order matters for the slot cache (see below): llama.cpp reuses the longest unchanged **prefix** of the prompt.

```
1. System prompt                     ← never changes during the adventure
2. Voice sheet (character or WM)     ← changes only when edited
3. Scene context (world, location)   ← changes rarely
4. Transcript                        ← only grows, append-only
5. Step instruction                  ← one or two lines, always last
```

Anything that changes often, like the current status of a character, goes **after** the transcript or inside the step instruction. Otherwise every turn throws the cache away from that point on.

### Transcript from the voice's point of view

Each voice reads the chat from its own seat:

- **Its own past lines** use the `assistant` role.
- **Everyone else's lines** use the `user` role, prefixed with the speaker's name (`Aria: ...`, `World Master: ...`).

This keeps the chat template valid, and the model always knows which lines are "mine". Because each voice reads the transcript differently, the voices cannot share one cached prompt. That is why every voice needs its own slot.

### Step instructions

Character step:

```
You are Bram. Write only Bram's next line in this scene.
Speak and act as Bram. Do not write for other characters or the narrator.
Keep it under 3 sentences.
```

World master step:

```
You are the World Master. Resolve this turn.
Describe what happens as a result of everyone's actions above.
End by showing the player what they can react to. Do not speak for the player.
```

Also send `stop` strings with the other voices' name prefixes (for example `"\nAria:"`, `"\nWorld Master:"`). This cuts the generation the moment a small model starts writing someone else's line.

## llama.cpp slots

### Why slots

A slot keeps the KV cache of the last prompt it processed. When the next request to the same slot shares a prefix with that prompt, llama.cpp skips that prefix and only processes the new tokens.

With one slot (`parallel = 1`, the current README preset), the steps of a turn keep overwriting each other's cache:

```
step 1 Bram    → full prompt processed (system + Bram sheet + transcript)
step 2 Aria    → Bram's cache is useless for Aria → full prompt again
step 3 WM      → full prompt again
next turn Bram → Bram's cache is gone → full prompt again
```

With one slot per voice, each voice only pays for the new messages since its last step:

```
step 1 Bram → slot 1: only the new transcript lines
step 2 Aria → slot 2: only the new transcript lines
step 3 WM   → slot 0: only the new transcript lines
```

With long system prompts and long chats, this is the difference between seconds and minutes per turn.

### Slot assignment

Slots belong to **one model instance**. In router mode each model runs as its own instance, so slots only need to be unique among the voices that share the same connection **and** the same model:

| Voice | Assistant model | Slot |
| --- | --- | --- |
| World Master | Qwen 27B | 0 |
| Bram | Qwen 27B | 1 |
| Aria | Mistral 12B | 0 |

The rule is deterministic: group the voices by `(connectionId, modelId)`, with the world master first and then the characters in speaking order, and number them from 0. The same adventure always lands on the same slots, so the caches survive between turns.

Each request then sends:

```json
{
  "id_slot": 1,
  "cache_prompt": true
}
```

`id_slot` and `cache_prompt` already exist in `NativePayload` (`samplerToNativePayload.ts`), but the gateway does not fill them yet.

### Server configuration

- **`parallel`** must be at least the number of voices that share one model. Set it per model section in the INI preset, so models that only ever serve one voice keep `parallel = 1`.
- **Context per slot.** By default `ctx-size` is divided among the slots: `ctx-size = 32768` with `parallel = 4` gives each slot 8192 tokens. Either raise `ctx-size`, or use a unified KV cache (`--kv-unified`), where the slots share one buffer and use what they need. Check `llama-server --help` on your build for the exact flag.
- **Memory.** More slots with a large unified context means more VRAM or RAM for the KV cache. On a single GPU, a turn with 2 AI characters and a world master on the same model needs `parallel = 3`.
- **Optional:** `--slot-save-path` together with `POST /slots/{id}?action=save|restore` can persist a slot's cache to disk, so a reopened adventure does not start cold.

### What invalidates a slot's cache

- Editing the system prompt, the voice sheet or the scene context, because everything after the edit is reprocessed.
- Editing or deleting a message in the middle of the chat, because everything after that message is reprocessed.
- Another adventure using the same slot number on the same model. A slot can only hold one prompt at a time, so switching adventures costs one cold step per voice.

## Implementation sketch

How this would map onto the current code:

| Piece | Change |
| --- | --- |
| `ITurnPolicyService` (domain) | `next(state): voiceId \| 'end'`. The first implementation is `FixedOrderTurnPolicyService` (application). |
| `GenerateChatReplyUseCase` | Loops: ask the policy for the next voice, run one step, repeat until `'end'`. The stream registry and **Stop** cover the whole loop. |
| `resolveWorldMasterRuntime` | Generalized to `resolveVoiceRuntime(hydrated, voiceId)`, already honoring `generationOverrides`. It returns the slot too. |
| Prompt building | One prompt builder per voice role (character, world master) following the layout above. |
| Gateway | Sends `id_slot`, `cache_prompt`, `n_predict` and the per-voice `stop` strings. |
| `Adventure` | Gains `turnSettings` (mode, reply length). The speaking order reuses `charactersControlledByAi`. |

## Open questions

- Should an AI character be allowed to **pass** (stay silent) on a turn? A small model can do it reliably with a constrained output (`json_schema` with `speak` / `pass`), at the cost of one extra short call.
- Should the world master see the characters' private sheets, or only what they said?
- Does the player want to see each step stream one after another, or only the finished turn?

---

_These ideas were developed with the assistance of Claude (Anthropic)._
