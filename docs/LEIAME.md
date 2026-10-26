# My dungeon app

Bem vindo ao My dungeon app, esse é um aplicativo que eu carinhosamente fiz para minha querida esposa Luna 🌙

O objetivo é simular uma mesa de RPG onde você acompanha uma narrativa feita por uma IA local que atua como mestre do mundo, com total liberdade em uma campanha solo para explorar os limites de uma narrativa auxiliada por IA.

Tudo isso rodando localmente na sua máquina, garantindo total privacidade e zero custo com locação de servidores de IA. Tal qual um jogo deve ser, 100% alocado na sua máquina.

E tudo sob uma licença de código livre ([AGPL v3](../LICENSE.md)), permitindo total autonomia sobre o código rodando na sua máquina.

## O que o projeto tem hoje

- App para **Android**, **iOS** e **Web**, construído com React Native + TypeScript
- Catálogo de componentes reutilizáveis salvos no próprio dispositivo: mundos, world masters, personagens, assistentes, samplers, system prompts, locations, itens, abilities, proficiências e statuses
- **Aventura**: onde tudo se encontra e a mesa acontece
- Uma **home** que leva de volta à sua última aventura e resume a sua mesa: o que você criou, o quanto jogou, seus destaques e o status do servidor — e um **Playground** para testar modelos e samplers em texto livre
- Conectividade com um servidor [llama.cpp](https://github.com/ggml-org/llama.cpp) em modo router: listagem de modelos, montagem do prompt, geração com streaming e _thinking_ de modelos de raciocínio
- Backend independente da UI (use cases, services, storage e afins), coberto por testes de unidade e de API

Ideias que ainda estão sendo estudadas para o futuro do projeto, como turnos com vários personagens, ficam em [docs/future-prototypes](./future-prototypes/). São propostas, ainda não funcionalidades.

## Como o projeto funciona

My dungeon app é, primeiramente, um caderninho de componentes reutilizáveis: você pensa em cada um com o carinho e a dedicação que achar necessários, pois eles ficam salvos esperando a hora de serem chamados — e são chamados quando convenientes para o momento atual da história, economizando contexto e permitindo que a narrativa se mantenha coerente.

A escolha de _quais_ componentes entram no prompt é feita pela aventura: cada seção entra no contexto só se a mesa tiver.

## Conceitos

### Mundo

O cenário: nome, palavra de ativação, um prompt com o lore e uma observação opcional.

### World master

O mestre de mundo: um prompt detalhando como ele conduz a mesa e toma decisões, e um **assistente** para se conectar a um modelo. Não quer um world master dedicado? Um personagem da aventura pode assumir o papel na hora de montar a aventura.

### Personagem

Nome, palavra de ativação, um prompt detalhando comportamento e lore, uma observação opcional e um **assistente**. Opcionalmente carrega também abilities, proficiências, statuses e atributos.

### Assistente

É o que liga qualquer persona (personagem ou world master) a um modelo: **modelo + sampler + conexão**, cada um sendo sua própria entidade.

### Sampler

Um conjunto de parâmetros de geração (top-k, top-p, temperature, presence/repeat penalty, mirostat, DRY, XTC e companhia). O app já vem com um default (`top_k`), e você cria os outros conforme o modelo que for usar.

### Conexão

O servidor com o qual o app conversa: nome, IP, porta e um token de auth opcional.

### Aventura

O ponto de partida da gameplay: reúne os personagens (os que você controla e os que a IA controla), o world master (dedicado ou um personagem no papel dele), os system prompts e os componentes da mesa — mundos, locations, itens. É na aventura que o chat acontece.

E o backend não deixa a mesa ir ao ar sem o mínimo:

- ao menos **1 system prompt**;
- **1 world master** — dedicado ou um personagem no papel, mas os dois ao mesmo tempo, não;
- ao menos **1 personagem jogável** (que não seja controlado pela IA nem esteja no papel de world master);
- sem world master dedicado, **ao menos 2 personagens**, com ao menos um deles fora do controle da IA;
- todo personagem controlado pela IA precisa fazer parte da aventura.

Tudo isso pode ser trocado no meio do jogo pelas **settings** do chat: nome, narrador, elenco, contexto da história e **geração** — o assistente, o sampler e os valores do sampler do world master e de cada personagem controlado pela IA (**Generation**) e de cada personagem que você joga (**Your Characters**). As mudanças de geração são salvas nos próprios personagens, assistentes e samplers, então valem em toda aventura que os usa; quer uma variação só para uma mesa? Crie um assistente ou sampler separado para ela. Cada card avisa quando um assistente ou sampler é compartilhado com outros personagens. Samplers do sistema não podem ser editados, e as mudanças valem a partir da próxima resposta. Hoje só o world master gera respostas, então a configuração dos outros personagens passa a valer quando eles responderem por conta própria.

## Gameplay

Em cada turno o app monta o prompt juntando as seções da mesa:

```
{systemPrompt}{worldMaster}{characterAsWorldMaster}{worlds}{locations}{items}{abilities}{proficiencies}{statuses}{characters}
```

Só entra o que a aventura tem — a injeção é sob demanda, justamente para preservar um contexto útil sem estourar a janela.

Essa ordem é o padrão da **System Prompt Load Order**, editável nas Configurações: reordene as tags ou remova as que não quer injetar (uma load order vazia não injeta nada). Só as tags acima são aceitas, cada uma no máximo uma vez; espaços e quebras de linha são ignorados, e o _Restore default_ traz a string acima de volta.

A resposta chega em **streaming** direto do servidor, e modelos de raciocínio podem _pensar_: o _thinking_ fica gravado junto da mensagem no chat e pode ser editado ou removido. No seu turno você decreta ações e fala dos personagens que controla no chat da aventura; no turno da IA, o world master e os personagens sob controle dela respondem — e cada mensagem pode ser regenerada, reenviada ou continuada.

## O servidor: llama.cpp

O projeto se conecta a um servidor [llama.cpp](https://github.com/ggml-org/llama.cpp) para a inferência local. Como essa configuração é feita pelo jogador na máquina dele, o resto deste guia ensina o básico do llama.cpp, para não deixar nenhum aventureiro desamparado.

O app conversa com o servidor pela API HTTP:

| Endpoint                                    | Uso                                                                                   |
| ------------------------------------------- | ------------------------------------------------------------------------------------- |
| `GET /models`                               | Lista os modelos disponíveis (alimenta o seletor de modelos do assistente)            |
| `POST /apply-template`                      | Aplica o chat template do modelo no prompt montado (por isso o `jinja = true` no ini) |
| `POST /completion` e `POST /v1/completions` | Geração de texto com streaming (rota nativa e rota compatível com a OpenAI API)       |

Por isso o servidor roda em **modo router**: um único `llama-server` com um preset INI hospeda vários modelos e o app lista os que estão disponíveis.

## Instalação do projeto

A instalação começa pelo servidor de inferência ao qual o app se conecta — caso você já tenha um servidor no ar (local ou em nuvem), pule direto para a [instalação do app](#instalação-e-execução-do-app)

### llama.cpp

Atualmente o projeto suporta apenas o llama.cpp como servidor de inferência local.

#### AMD

Existem duas formas de rodar esse projeto em AMD, hardware ao qual eu desenvolvo o projeto, o primeiro é o que eu recomendo, vulkan:

```sh
git clone https://github.com/ggml-org/llama.cpp

cd llama.cpp

MAX_JOBS=16 cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DLLAMA_BUILD_UI=OFF -DGGML_VULKAN=ON -DGGML_NATIVE=ON

cmake --build ./build --parallel$(nproc) --verbose

```

A sequência de instruções acima deve compilar o projeto em Vulkan, que tem a maior velocidade de inferência no meu hardware (RX 7900 XTX)

A sequência de instruções abaixo se refere ao Rocm:

```sh
git clone https://github.com/ggml-org/llama.cpp

cd llama.cpp

MAX_JOBS=16 HIPCXX="$(hipconfig -l)/clang" HIP_PATH="$(hipconfig -R)" cmake -S . -B build -DGGML_HIP=ON -DGPU_TARGETS=gfx1100 -DCMAKE_BUILD_TYPE=Release -DGGML_HIP_ROCWMMA_FATTN=ON -DLLAMA_BUILD_UI=OFF  -DGGML_NATIVE=ON

cmake --build ./build --parallel$(nproc) --verbose

```

Não me perguntem como faz pra nvidia, eu não sei. Você pode ver as instruções para isso [aqui](https://github.com/ggml-org/llama.cpp/blob/master/docs/build.md#cuda)

### Inicialização do servidor

O servidor deve ser executado em modo router do llama.cpp:

```sh
./build/bin/llama-server --models-preset llama-cpp-models-presets.ini --host 0.0.0.0 --no-models-autoload

```

A seguir um exemplo de como configurar um arquivo ini no modo router:

```ini
;config global compartilhada
[*]
jinja = true
offline = true
prio = 0
flash-attn = on
log-verbosity = 4
parallel = 1
threads = 8
threads-batch = 16

; config especifica do modelo
[Qwen3.8-27B-UD-Q4_K_XL]
model = /mnt/nvme/models/Qwen3.8-27B-UD-Q4_K_XL.gguf
device = Vulkan0
fit = on
fit-target = 512
load-mode = mmap+mlock ; preferência pessoal
n-gpu-layers = all ; Necessário para que MTP funcione corretamente

; parametros de geração recomendados, se não li errado
chat-template-kwargs = {"reasoning_effort":"xhigh"} ; preferência pessoal
min-p = 0.00
temperature = 1
top-k = 20
top-p = 0.95
presence-penalty = 0.0
repeat-penalty = 1.0
reasoning-preserve = true ; É uma recomendação do template(se eu entendi direito) sempre enviar o pensamento

; contexto do modelo com limitação de RAM
ctx-size = 131072
cache-type-k = q8_0
cache-type-v = q8_0
cache-prompt = true
cache-ram = 16384

; mtp (se todo o modelo for carregado na VRAM isso acelera a geração de tokens/segundo)
device-draft = Vulkan0 ; Se você compilar mais de um backend como por exemplo rocm/vulkan você precisa dizer qual o device também
spec-draft-n-max = 3 ; configuração recomendada
n-gpu-layers-draft = all
draft-p-min = 0
spec-type = draft-mtp

; visão do modelo
mmproj = /mnt/nvme/models/Qwen3.8-mmproj-F16.gguf
mmproj-offload = false ; carrega o modelo na CPU

```

Com o servidor no ar, falta colocar o app para rodar.

## Instalação e execução do app

Pré-requisitos:

- [Node.js](https://nodejs.org) 22.11 ou mais novo
- Para device/emulador: siga o [guia de ambiente](https://reactnative.dev/docs/set-up-your-environment) do React Native (Android Studio para Android; Xcode + CocoaPods para iOS). Para Web, só o Node.js.

```sh
cd my_dungeon_ai

npm install

npm start
```

Com o Metro no ar, em outro terminal:

```sh
# Android
npm run android

# iOS — na primeira vez, instale bundler e pods antes
bundle install
bundle exec pod install
npm run ios

# Web
npm run web
```

## Configuração do projeto

Com o app aberto, a configuração acontece lá dentro mesmo:

1. **Settings → Connections**: adicione o servidor — Name, IP address (na emuladora Android, `10.0.2.2` aponta para a máquina que hospeda o servidor), Port e, se o servidor pedir, o Auth token.
2. Crie um **assistente**, ligando modelo, sampler e conexão; os modelos do servidor aparecem no seletor de modelos do assistente.
3. Escreva os componentes: mundo(s), world master, personagens, system prompts — e, se a campanha pedir, locations, itens, abilities, proficiências e statuses.
4. Monte a **aventura** e jogue.

## Desenvolvimento

```sh
npm start           # Metro (Android/iOS)
npm run web         # servidor de desenvolvimento web
npm run lint        # eslint
npm test            # testes de unidade do backend (sem UI)
npm run test:api    # integração contra um servidor llama.cpp real
```
