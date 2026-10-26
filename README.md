# My dungeon app

Welcome to the My dungeon app, an app I lovingly made for my dear wife Luna 🌙

The goal is to simulate an RPG table where you follow a narrative driven by a local AI acting as the world master, with the total freedom of a solo campaign to explore the limits of an AI-assisted story.

All of it runs on your machine, guaranteeing total privacy and zero cost for renting AI servers. Just like a game should be, 100% on your machine.

And all of it under a free software license ([AGPL v3](./LICENSE.md)), giving you full autonomy over the code running on your machine.

## What the project has today

- An app for **Android**, **iOS** and **Web**, built with React Native + TypeScript
- A catalog of reusable components saved on the device itself: worlds, world masters, characters, assistants, samplers, system prompts, locations, items, abilities, proficiencies and statuses
- **Adventure**: where everything meets and the table happens
- Connectivity with a [llama.cpp](https://github.com/ggml-org/llama.cpp) server in router mode: model listing, prompt building, streaming generation and _thinking_ from reasoning models
- A UI-independent backend (use cases, services, storage and friends), covered by unit and API tests

## How it works

My dungeon app is, first of all, a little notebook of reusable components: you think of each one with the care and the dedication you see fit, because they stay saved waiting for their moment to be called — and they are called when it's convenient for the current moment in the story, saving context and letting the narrative stay coherent.

The choice of _which_ components end up in the prompt is made by the adventure: each section only enters the context if the table has it.

## Concepts

### World

The setting: a name, an activation word, a prompt with the lore and an optional observation.

### World master

The game master: a prompt detailing how they run the table and make decisions, plus an **assistant** to connect them to a model. Don't want a dedicated world master? A character from the adventure can step into the role when you assemble the adventure.

### Character

A name, an activation word, a prompt detailing behavior and lore, an optional observation and an **assistant**. Optionally it also carries abilities, proficiencies, statuses and attributes.

### Assistant

What ties any persona (character or world master) to a model: **model + sampler + connection**, each one its own entity.

### Sampler

A set of generation parameters (top-k, top-p, temperature, presence/repeat penalty, mirostat, DRY, XTC and friends). The app ships with one default (`top_k`), and you create the rest to match the model you're running.

### Connection

The server the app talks to: name, IP, port and an optional auth token.

### Adventure

The starting point of the gameplay: it gathers the characters (the ones you control and the ones the AI controls), the world master (dedicated, or a character playing the role), the system prompts and the table's components — worlds, locations, items. The chat happens in the adventure.

And the backend won't let the table go live without the minimum:

- at least **1 system prompt**;
- **1 world master** — dedicated or a character in the role, but not both at the same time;
- at least **1 playable character** (not AI-controlled and not playing the world master);
- without a dedicated world master, **at least 2 characters**, with at least one of them outside AI control;
- every AI-controlled character must be part of the adventure.

Everything above can be changed mid-game from the chat's **settings**: name, narrator, cast, story context and **generation** — the assistant, sampler and sampler values of the world master and of each AI-controlled character (**Generation**) and of each character you play (**Your Characters**). Generation changes are saved to the characters, assistants and samplers themselves, so they apply to every adventure that uses them; want a variation just for one table? Create a separate assistant or sampler for it. Each card warns when an assistant or sampler is shared with other characters. System samplers can't be edited, and changes apply from the next reply. Today only the world master generates replies, so the settings of the other characters take effect once they reply on their own.

## Gameplay

Every turn the app assembles the prompt by joining the table's sections:

```
{systemPrompt}{worldMaster}{characterAsWorldMaster}{worlds}{locations}{items}{abilities}{proficiencies}{statuses}{characters}
```

Only what the adventure has goes in — the injection is on demand, precisely to keep a useful context without blowing the window.

That order is the default **System Prompt Load Order**, editable in Settings: reorder the tags or remove the ones you don't want injected (an empty load order injects nothing). Only the tags above are accepted, each one at most once; spaces and line breaks are ignored, and _Restore default_ brings the string above back.

The answer arrives **streaming** straight from the server, and reasoning models can _think_: the _thinking_ is recorded with the message in the chat and can be edited or removed. On your turn you decree actions and speak for the characters you control in the adventure chat; on the AI's turn the world master and the characters it controls answer — and every message can be regenerated, resent or continued.

## The server: llama.cpp

The project connects to a [llama.cpp](https://github.com/ggml-org/llama.cpp) server for local inference. Since that setup is done by the player on their own machine, the rest of this guide teaches the llama.cpp basics, so no adventurer is left stranded.

The app talks to the server through the HTTP API:

| Endpoint                                      | Use                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `GET /models`                                 | Lists the available models (feeds the assistant's model picker)                              |
| `POST /apply-template`                        | Applies the model's chat template to the built prompt (that's why `jinja = true` in the ini) |
| `POST /completion` and `POST /v1/completions` | Streaming text generation (native route and OpenAI-compatible route)                         |

That's why the server runs in **router mode**: a single `llama-server` with an INI preset hosts many models, and the app lists the ones that are available.

## Project installation

Installation starts with the inference server the app connects to — if you already have a server up and running (local or cloud), jump straight to [installing and running the app](#installing-and-running-the-app)

### llama.cpp

Currently the project only supports llama.cpp as a local inference server.

#### AMD

There are two ways to run this project on AMD, the hardware I develop on; the first one is the one I recommend, vulkan:

```sh
git clone https://github.com/ggml-org/llama.cpp

cd llama.cpp

MAX_JOBS=16 cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DLLAMA_BUILD_UI=OFF -DGGML_VULKAN=ON -DGGML_NATIVE=ON

cmake --build ./build --parallel$(nproc) --verbose

```

The commands above should compile the project with Vulkan, which has the fastest inference on my hardware (RX 7900 XTX).

The following commands refer to Rocm:

```sh
git clone https://github.com/ggml-org/llama.cpp

cd llama.cpp

MAX_JOBS=16 HIPCXX="$(hipconfig -l)/clang" HIP_PATH="$(hipconfig -R)" cmake -S . -B build -DGGML_HIP=ON -DGPU_TARGETS=gfx1100 -DCMAKE_BUILD_TYPE=Release -DGGML_HIP_ROCWMMA_FATTN=ON -DLLAMA_BUILD_UI=OFF  -DGGML_NATIVE=ON

cmake --build ./build --parallel$(nproc) --verbose

```

Don't ask me how to do it on nvidia, I don't know. You can find the instructions for that [here](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md#cuda)

### Starting the server

The server must be run in the llama.cpp router mode:

```sh
./build/bin/llama-server --models-preset llama-cpp-models-presets.ini --host 0.0.0.0 --no-models-autoload

```

Below is an example of how to configure an ini file in router mode:

```ini
;shared global config
[*]
jinja = true
offline = true
prio = 0
flash-attn = on
log-verbosity = 4
parallel = 1
threads = 8
threads-batch = 16

; per-model config
[Qwen3.8-27B-UD-Q4_K_XL]
model = /mnt/nvme/models/Qwen3.8-27B-UD-Q4_K_XL.gguf
device = Vulkan0
fit = on
fit-target = 512
load-mode = mmap+mlock ; personal preference
n-gpu-layers = all ; required for MTP to work correctly

; recommended generation params, if I read it right
chat-template-kwargs = {"reasoning_effort":"xhigh"} ; personal preference
min-p = 0.00
temperature = 1
top-k = 20
top-p = 0.95
presence-penalty = 0.0
repeat-penalty = 1.0
reasoning-preserve = true ; recommended by the template (if I understood right) always send the thought

; model context with a RAM limit
ctx-size = 131072
cache-type-k = q8_0
cache-type-v = q8_0
cache-prompt = true
cache-ram = 16384

; mtp (if the whole model fits in VRAM this speeds up tokens/second)
device-draft = Vulkan0 ; if you compile more than one backend, e.g. rocm/vulkan, you have to say which device too
spec-draft-n-max = 3 ; recommended setting
n-gpu-layers-draft = all
draft-p-min = 0
spec-type = draft-mtp

; model vision
mmproj = /mnt/nvme/models/Qwen3.8-mmproj-F16.gguf
mmproj-offload = false ; loads the model on the CPU

```

With the server up and running, all that's left is to get the app running.

## Installing and running the app

Prerequisites:

- [Node.js](https://nodejs.org) 22.11 or newer
- For device/emulator: follow the React Native [environment setup guide](https://reactnative.dev/docs/set-up-your-environment) (Android Studio for Android; Xcode + CocoaPods for iOS). For Web, Node.js only.

```sh
cd my_dungeon_ai

npm install

npm start
```

With Metro running, in another terminal:

```sh
# Android
npm run android

# iOS — first time, install bundler and pods before
bundle install
bundle exec pod install
npm run ios

# Web
npm run web
```

## Configuration

With the app open, the configuration happens right inside it:

1. **Settings → Connections**: add your server — Name, IP address (on the Android emulator, `10.0.2.2` points to the machine hosting the server), Port and, if the server asks for it, the Auth token.
2. Create an **assistant**, linking model, sampler and connection; the server's models show up in the assistant's model picker.
3. Write the components: world(s), world master, characters, system prompts — and, if the campaign calls for it, locations, items, abilities, proficiencies and statuses.
4. Build the **adventure** and play.

## Development

```sh
npm start           # Metro (Android/iOS)
npm run web         # web dev server
npm run lint        # eslint
npm test            # backend unit tests (no UI)
npm run test:api    # integration against a real llama.cpp server
```
