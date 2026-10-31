# My dungeon app

Welcome to the My dungeon app, an app I lovingly made for my dear wife Luna 🌙

The goal is to simulate an RPG table where you follow a narrative driven by a local AI acting as the world master, with the total freedom of a solo campaign to explore the limits of an AI-assisted story.

All of it runs on your machine, guaranteeing total privacy and zero cost for renting AI servers. Just like a game should be, 100% on your machine.

And all of it under a free software license ([AGPL v3](./LICENSE.md)), giving you full autonomy over the code running on your machine.

## What the project has today

- An app for **Android**, **iOS** and **Web**, built with React Native + TypeScript
- A catalog of reusable components saved on the device itself: worlds, world masters, characters, assistants, samplers, system prompts, locations, items, abilities, proficiencies and statuses
- **Adventure**: where everything meets and the table happens, in rounds where your characters, the AI-controlled characters and the world master each take their turn
- A **home** that guides your first setup, takes you back to your last adventure and sums up your table: what you created, how much you played, your highlights and the server status
- A **Playground** for free text: a single saved text that the first loaded model continues with the default sampler
- Connectivity with a [llama.cpp](https://github.com/ggml-org/llama.cpp) server in router mode: model listing, prompt building, streaming generation and _thinking_ from reasoning models
- A UI-independent backend (use cases, services, storage and friends), with unit tests for the backend and the UI, plus an integration test against a real llama.cpp server

Ideas still being studied for the project's future, such as turns driven by mentions and Playground sessions, live in [docs/future-prototypes](./docs/future-prototypes/). They are proposals, not features yet.

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
- a character playing the world master must be part of the adventure and can't be AI-controlled, so without a dedicated world master you need **at least 2 characters**;
- every AI-controlled character must be part of the adventure.

Everything above can be changed mid-game from the chat's **settings**: name, narrator, cast, story context and **generation** — the assistant, sampler and sampler values of the world master and of each AI-controlled character (**Generation**) and of each character you play (**Your Characters**). Generation changes are saved to the characters, assistants and samplers themselves, so they apply to every adventure that uses them; want a variation just for one table? Create a separate assistant or sampler for it. Each card warns when an assistant or sampler is shared with other characters. System samplers can't be edited, and changes apply from the next reply. The settings in **Your Characters** only take effect if the AI later plays that character.

## Gameplay

Each turn is a round: every character you play speaks, then each AI-controlled character replies in the adventure's order, and the world master closes the round. Each voice generates with its own assistant. On your turn, with the message box empty, **Skip turn** hands the round straight to the AI characters and the world master. **Stop** ends the whole round, and the messages already finished stay in the chat.

Before each AI reply the app assembles the prompt of whoever is speaking by joining the table's sections:

```
{systemPrompt}{worldMaster}{characterAsWorldMaster}{worlds}{locations}{items}{abilities}{proficiencies}{statuses}{characters}
```

Only what the adventure has goes in — the injection is on demand, precisely to keep a useful context without blowing the window.

That order is the default **System Prompt Load Order**, editable in Settings: reorder the tags or remove the ones you don't want injected (an empty load order injects nothing). Only the tags above are accepted, each one at most once; spaces and line breaks are ignored, and _Restore default_ brings the string above back.

Settings also lets you rewrite the text the app wraps around everything, for every adventure at once. **System Prompt Sections** holds the heading of each section above, and **Turn Messages** holds how a turn is written to the model: the layout of the message, the scene context, the characters' lines and the instructions for the AI characters, the world master and the scene context. Each field lists the tags it accepts; a required tag can't be removed and an unknown tag is refused, so a literal `{...}` can't be used. Line breaks are kept, and _Restore default_ brings a field's original text back when you save.

**Scene Context**, also in Settings and off by default, makes the model summarize the scene before each AI reply so the summary can guide it. It costs one extra model call per reply. The adventure list lets you open the system prompt and the final prompt assembled for an adventure.

The answer arrives **streaming** straight from the server, with Markdown and LaTeX rendered in the chat, and reasoning models can _think_: the _thinking_ is recorded with the message in the chat, can be edited or removed, and a switch in the chat header shows or hides it. On Android the app stays alive in the background while a reply streams.

Your messages can be edited, deleted or resent. AI messages can be edited, regenerated or continued, and each regeneration is kept as a version you can flip through.

## The server: llama.cpp

The project connects to a [llama.cpp](https://github.com/ggml-org/llama.cpp) server for local inference. Since that setup is done by the player on their own machine, the rest of this guide teaches the llama.cpp basics, so no adventurer is left stranded.

The app talks to the server through the HTTP API:

| Endpoint                                      | Use                                                                                          |
| --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `GET /models`                                 | Lists the available models (feeds the assistant's model picker)                              |
| `POST /apply-template`                        | Applies the model's chat template to the built prompt (that's why `jinja = true` in the ini) |
| `POST /completion` and `POST /v1/completions` | Streaming generation (native route for adventures, OpenAI route for the Playground)          |

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

The server must be run in the llama.cpp router mode. The `--host` depends on where the app runs.

**App on the phone** (the server machine spends its VRAM only on the model):

```sh
./build/bin/llama-server --models-preset llama-cpp-models-presets.ini --host 0.0.0.0 --api-key "your-secret-key" --no-models-autoload

```

`--host 0.0.0.0` makes the server reachable by every device on your network, so protect it with `--api-key`. Generate a key with `openssl rand -hex 32` and paste the same value in the connection's **Auth token** field, without the `Bearer` prefix: the app adds it to every request.

**Web app on the server machine itself** (the web version spends little VRAM):

```sh
./build/bin/llama-server --models-preset llama-cpp-models-presets.ini --host 127.0.0.1 --no-models-autoload

```

`--host 127.0.0.1` only accepts connections from the machine itself, so nobody on the network reaches the server and `--api-key` becomes optional.

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
- For the phone: follow the React Native [environment setup guide](https://reactnative.dev/docs/set-up-your-environment) (Android Studio for Android; Xcode + CocoaPods for iOS). For Web, Node.js only.

The app is meant to run on your phone, on the same network as the server: that way the machine hosting `llama-server` spends its VRAM only on the model. The web version spends little VRAM, so it can also run on the server machine itself. To install the app on the phone, connect the phone through USB with USB debugging enabled before running `npm run android` or `npm run android:release`.

```sh
cd my_dungeon_ai

npm ci

npm start
```

`npm ci` installs exactly the versions recorded in `package-lock.json`, so no dependency gets updated on its own.

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

Those are development builds. To play, use the release builds, which go without the development flags (the logs only keep warnings and errors):

```sh
# Android: installs a standalone build on the phone, no Metro needed
npm run android:release

# Web: builds a fresh release version and serves it at http://127.0.0.1:3000, reachable only from this machine
npm run prod
```

## Configuration

With the app open, the configuration happens right inside it:

1. **Settings → Connections**: add your server — Name, IP address (on the phone, the local network IP of the machine running `llama-server`, such as `http://192.168.0.10`, with the phone on the same network; on the web app running on that machine, `http://127.0.0.1`), Port and the Auth token (the same value passed to `--api-key`, if any).

   An address without a scheme uses `https://` by default, which keeps the Auth token from traveling in plain text to a server outside your network. `llama-server` on your network answers plain HTTP, so LAN connections must start with `http://`.
2. Create an **assistant**, linking model, sampler and connection; the server's models show up in the assistant's model picker.
3. Write the components: world(s), world master, characters, system prompts — and, if the campaign calls for it, locations, items, abilities, proficiencies and statuses.
4. Build the **adventure** and play.

## Development

```sh
npm start                     # Metro (Android/iOS)
npm run web                   # web dev server
npm run prod                  # fresh release web build, served at 127.0.0.1:3000
npm run build:web             # release web build in dist/
npm run lint                  # eslint
npm test                      # unit tests of the backend and the UI
npm run test:coverage         # unit tests with the coverage report
npm run test:coverage:staged  # unit tests, then requires 100% coverage on the staged files
npm run test:api              # integration against a real llama.cpp server
```

The husky `pre-commit` hook runs the lint, the tests and `test:coverage:staged`. A staged file below 100% blocks the commit, even when it has no tests yet. Only files measured by the coverage count, so what `jest.config.js` excludes, like `src/presentation`, stays out of this rule.

The `[STORAGE]` logs print everything read from and written to storage, and they are off by default. To turn them on, start Metro or the web dev server with `STORAGE=true`:

```sh
STORAGE=true npm start
STORAGE=true npm run web
```

The `[STREAMING]` logs print every intermediate save of a reply while it streams, and they are off by default as well. Turn them on the same way, with `STREAMING=true`:

```sh
STREAMING=true npm start
STREAMING=true npm run web
```
