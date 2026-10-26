# Turns prototype: mentions

> **Status:** proposal, not implemented. It builds on the [fixed order prototype](./turns-fixed-order.md) and reuses its per-voice prompts and llama.cpp slot rules unchanged.

Fixed order gives every AI character exactly one line per turn. That is predictable, but characters cannot argue, answer each other or deliver a longer speech. This prototype lets a conversation emerge from **mentions**: when a message addresses a character by name, that character gets the next step.

The goal is still to keep the LLM away from deciding who speaks. Mentions are detected by plain code, with no extra model call, and hard limits bound every turn.

## The turn

```
player sends a message
  └─ loop:
       1. find the AI characters mentioned in the last message
       2. a mentioned character that can still speak → it takes the next step
       3. otherwise → the next character in fixed order that has not spoken yet
       4. nobody left, or a limit reached → the world master resolves the turn
player's turn again
```

Example with Bram and Aria, both AI-controlled:

```
Player:  "I put the map on the table. Aria, can you read these runes?"
Aria:    (mentioned)  "They're dwarven. Bram, you served in the mines, didn't you?"
Bram:    (mentioned)  "Aye. That mark means 'collapsed tunnel'."
Aria:    (mentioned)  "Then we go around. Bram, you lead."
Bram:    (mentioned)  limit reached for Bram this turn → skipped
WM:      resolves the turn
```

## Rules

### Who can be mentioned

| Mention of | Effect |
| --- | --- |
| An **AI-controlled character** | That character is queued for the next step. |
| A **character the player controls** | Ignored. The player answers on their own turn. |
| The **world master** | The world master closes the turn right away. |
| **Itself** | Ignored, because a character naming itself is not a request to speak. |

### Order

- Mentions in the **player's message** decide who opens the turn. "Aria, Bram, what do you think?" puts Aria first and Bram second.
- When a message mentions several characters, they are queued in the order they appear.
- Mentioned characters jump ahead of the fixed order. Characters that were never mentioned still get their fixed-order line, unless a limit ends the turn first.

### Limits

Limits are what make this safe with small models. Two characters that keep naming each other would otherwise talk forever.

| Limit | Default | Purpose |
| --- | --- | --- |
| **Steps per turn (N)** | 6 | Total AI character steps before the world master must close. |
| **Lines per character (K)** | 2 | How many times one character can speak in the same turn. |
| **Back to back** | off | Whether the same character can take two steps in a row. Turning it on allows monologues, which still count toward K. |

When a mentioned character has already reached K, the mention is skipped and the loop moves on. When the turn reaches N, the world master closes immediately.

## Mention detection

Detection is a pure function with no model call:

```
findMentions(text, voices) → voiceId[] in order of appearance
```

- **What counts as a mention:** the character's `name` or its `activationWord`, matched as a whole word (`Bram` matches "Bram," and "Bram?" but not "Brambles").
- **Case:** names are matched case-sensitively. This avoids false positives with names that are also common words, like *Will*, *Hope* or *Rose*. Activation words follow their current behavior in the prompt injection.
- **Scope:** the first version scans the whole message. A character saying *"Bram would hate this"* still queues Bram even though nobody asked him anything. It is a known false positive, and the K and N limits keep its cost bounded.

## Prompts

The character prompt is the same as in fixed order, with one extra line that makes conversation possible:

```
You are Aria. Write only Aria's next line in this scene.
Speak and act as Aria. Do not write for other characters or the narrator.
To ask or answer someone, address them by name.
Keep it under 3 sentences.
```

That single line is enough for a small model. A longer explanation of the turn system would only distract it, and the model never needs to know that mentions trigger replies.

The world master prompt does not change. It resolves everything said in the turn, however many steps there were.

## Slots

Nothing changes from [fixed order](./turns-fixed-order.md#llamacpp-slots): one slot per voice per model. Mentions make slots **more** valuable, because the same character can speak twice in one turn. Its second step only processes the lines added since its first one.

## Adventure settings

The **Turns** section gains the limits when the mode is Mentions:

```
Turns
  Mode                    [ Fixed order | Mentions ]
  Speaking order          1. Bram  ↑↓   2. Aria  ↑↓   (used when nobody is mentioned)
  Steps per turn          [ 6 ]
  Lines per character     [ 2 ]
  Back-to-back lines      [ off ]
  Reply length            [ 200 ] tokens per character step
```

## Implementation sketch

On top of the fixed order pieces:

| Piece | Change |
| --- | --- |
| `MentionsTurnPolicyService` | Second `ITurnPolicyService` implementation. It keeps a queue of mentioned voices plus per-voice counters for the turn. |
| `findMentions` | Pure function next to the policy, with its own tests: whole words, case, order of appearance, self-mention. |
| `Adventure.turnSettings` | Gains `maxStepsPerTurn`, `maxLinesPerCharacter` and `allowBackToBack`. |
| `GenerateChatReplyUseCase` | No change beyond fixed order. It already loops until the policy returns `'end'`. |

## Open questions

- Should a character that was **never mentioned** still get its fixed-order line, or should mentions fully replace the fixed order once someone is mentioned?
- Should the player be able to **force** a speaker by tapping a character, as a manual override of the queue?
- Is matching only the spoken part of a message worth the extra parsing, or are the limits enough to absorb the false positives?

---

_These ideas were developed with the assistance of Claude (Anthropic)._
