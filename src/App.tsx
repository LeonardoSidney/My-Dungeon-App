import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View, type TextProps } from 'react-native';
import {
  createAbilityController,
  createCharacterController,
  createAssistantController,
  createConnectionConfigController,
  getAbilitiesController,
  getCharactersController,
  getAssistantsController,
  getConnectionsController,
  getModelsFromProviderController,
  getSamplersController,
  createStatusController,
  getStatusesController,
  createProficiencyController,
  getProficienciesController,
  createWorldMasterController,
  getWorldMasterController,
  createSystemPromptController,
  getSystemPromptsController,
  createWorldController,
  getWorldsController,
  createLocationController,
  getLocationsController,
  createItemController,
  getItemsController,
  createAdventureController,
  getAdventuresController,
  getAdventureTextController,
  appendAdventureChatController,
  createChatAdventureController,
  eraseAdventuresController
} from '@infra/container';
import { SidebarPanel, type SidebarMenuItem, type SidebarRoute } from '@application/ui';
import {
  Ability,
  Adventure,
  Assistant,
  Attribute, Character,
  Connection,
  Item,
  Location,
  Model,
  Proficiency,
  RoleEnum,
  Sampler,
  Status,
  SystemPrompt,
  World,
  WorldMaster
} from '@domain/entities';
import { TextAreaStream, SettingsScreen, WorldScreen } from '@application/ui';

const logoUri = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 841.9 595.3"><g fill="#61DAFB"><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V78c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V78.5c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6zM320.8 78.4z" /><circle cx="420.9" cy="296.5" r="45.7" /><path d="M520.5 78.1z" /></g></svg>';

type LinkProps = TextProps & {
  href?: string;
};

function Link(props: LinkProps) {
  return <Text {...props} role="link" style={[styles.link, props.style]} />;
}

async function setConnection() {
  const createConnection = createConnectionConfigController();
  return createConnection.handle({
    name: 'llamacpp2',
    ip: '192.168.18.101',
    port: 8080,
  });
}

async function getConnections(): Promise<Connection[]> {
  const connectionsController = getConnectionsController();
  return connectionsController.handle();
}

async function getModels(connection: Connection) {
  const modelsController = getModelsFromProviderController();
  return modelsController.handle({ connection });
}

async function getSamplers() {
  const samplersController = getSamplersController();
  return samplersController.handle();
}

async function setAssistant(sampler: Sampler, model: Model) {
  const createAssistant = createAssistantController();

  return createAssistant.handle({
    model,
    sampler,
    name: 'test',
    observation: 'test'
  });
}

async function setCharacter(
  assistant: Assistant,
  abilities: Ability[],
  attributes: Attribute[],
  proficiencies: Proficiency[],
  statuses: Status[]
) {
  const createCharacter = createCharacterController();

  return createCharacter.handle({
    name: 'Stelle',
    activationWord: 'taco;metroviaria;lata de lixo',
    prompt: 'Uma poderosa e apatica protagonista.',
    observation: 'Alguém para se ter certo medo',
    assistant,
    abilities,
    attributes,
    proficiencies,
    statuses
  });
}

async function getAssistants() {
  const assistantsController = getAssistantsController();
  return assistantsController.handle();
}

async function setAbility() {
  const createAbility = createAbilityController();
  return createAbility.handle({
    name: 'Bola de fogo',
    prompt: 'Uma simples habilidade de bola de fogo',
    observation: 'Tive essa ideia vendo um mago fazer magias mágicas',
    activationWorld: 'bola de fogo;magia de fogo'
  });
}

async function getAbilities() {
  const abilitiesController = getAbilitiesController();
  return abilitiesController.handle();
}

async function setStatus() {
  const createStatus = createStatusController();
  return createStatus.handle({
    name: 'Curse',
    prompt: 'Seu personagem foi amaldiçoado pela eternidade',
    observation: 'A alma escura',
    activationWord: 'curse;undead'
  });
}

async function getStatuses() {
  const statusesController = getStatusesController();
  return statusesController.handle();
}

async function setProficiency() {
  const createProficiency = createProficiencyController();
  return createProficiency.handle({
    name: 'Ferragem',
    prompt: 'É quando um ferreiro sabe ferrear',
    activationWord: 'ferreiro;ferramenta;martelo',
    observation: 'Vi um ferreiro ferreando e tive uma ideia férrea'
  });
}

async function getProficiencies() {
  const proficienciesController = getProficienciesController();
  return proficienciesController.handle();
}

async function getCharacters() {
  const charactersController = getCharactersController();
  return charactersController.handle();
}

function getAttributes(): Attribute[] {
  return [
    {
      name: 'Força',
      value: 100
    },
    {
      name: 'Emocional',
      value: 8
    },
    {
      name: 'Intelecto',
      value: 0
    },
    {
      name: 'Atração por lixo',
      value: 999
    }
  ];
}

async function setWorldMaster(assistant: Assistant) {
  const createWorldMaster = createWorldMasterController();
  return createWorldMaster.handle({
    name: 'Dungeon Master',
    activationWord: 'dungeon master;dm',
    prompt: 'Você é o mestre do jogo de RPG Dungeon & Dragons',
    observation: 'O mestre do jogo',
    assistant
  });
}

async function getWorldMasters() {
  const worldMasters = getWorldMasterController();
  return worldMasters.handle();
}

async function setSystemPrompt() {
  const createSystemPrompt = createSystemPromptController();
  return createSystemPrompt.handle({
    name: 'D&D Prompt',
    content: 'Você é um mestre de RPG que gera aventuras para jogadores iniciantes',
    observation: 'Um mestre de RPG experiente'
  });
}

async function getSystemPrompts() {
  const systemPromptsController = getSystemPromptsController();
  return systemPromptsController.handle();
}

async function setWorld() {
  const createWorld = createWorldController();
  return createWorld.handle({
    name: 'Mundo de Teste',
    activationWord: 'teste',
    prompt: 'Um mundo de testes',
    observation: 'Um mundo de testes para verificar se tudo funciona'
  });
}

async function getWorlds() {
  const worldsController = getWorldsController();
  return worldsController.handle();
}

async function setLocation() {
  const createLocation = createLocationController();
  return createLocation.handle({
    name: 'Cidade de Teste',
    activationWord: 'teste',
    prompt: 'Uma cidade de testes',
    observation: 'Uma cidade de testes para verificar se tudo funciona'
  });
}

async function getLocations() {
  const locationsController = getLocationsController();
  return locationsController.handle();
}

async function setItem() {
  const createItem = createItemController();
  return createItem.handle({
    name: 'Espada de Ferro',
    activationWord: 'espada;ferramenta;arma',
    prompt: 'Uma espada de ferro comum',
    observation: 'Uma espada de ferro comum para iniciantes'
  });
}

async function getItems() {
  const itemsController = getItemsController();
  return itemsController.handle();
}

async function setAdventure(
  worlds: World[],
  locations: Location[],
  characters: Character[],
  items: Item[],
  worldMaster: WorldMaster,
  systemPrompts: SystemPrompt[]
) {
  const createAdventure = createAdventureController();
  return createAdventure.handle({
    name: 'Aventura de Teste',
    worlds,
    locations,
    characters,
    items,
    worldMaster,
    systemPrompts
  });
}

async function getAdventures() {
  const adventuresController = getAdventuresController();
  return adventuresController.handle();
}

async function appendChatAdventure(adventure: Adventure) {
  const createChatController = createChatAdventureController();
  const chatResult = await createChatController.handle({
    content: 'Hello!!',
    role: RoleEnum.USER
  });

  if (!chatResult.success || !chatResult.chat) {
    throw new Error('Failed to create chat for adventure');
  }

  const appendChatController = appendAdventureChatController();
  return appendChatController.handle({
    adventure,
    message: chatResult.chat
  });
}

async function eraseAdventures() {
  const eraseAdventuresCtrl = eraseAdventuresController();
  return eraseAdventuresCtrl.handle();
}

async function getAdventureText(adventure: Adventure) {
  const getAdventureTextCtrl = getAdventureTextController();
  return getAdventureTextCtrl.handle({ adventure });
}

async function doSomething(): Promise<string | undefined> {
  await eraseAdventures();
  await setConnection();
  const connections = await getConnections();
  console.log('connections: >>', connections);
  const models = await getModels(connections[0]);
  console.log('models: >>', models);
  const samplers = await getSamplers();
  console.log('samplers: >>', samplers);
  if (!models.models) {
    throw new Error('No models available');
  }

  await setAssistant(samplers[0], models.models[0]);
  const assistants = await getAssistants();
  console.log('assistants: >>', assistants);

  await setAbility();
  const abilities = await getAbilities();
  console.log('abilities: >>', abilities);

  await setStatus();
  const statuses = await getStatuses();
  console.log('statuses: >>', statuses);

  await setProficiency();
  const proficiencies = await getProficiencies();
  console.log('proficiencies: >>', proficiencies);

  const attributes = getAttributes();

  await setCharacter(assistants[0], abilities, attributes, proficiencies, statuses);
  const characters = await getCharacters();
  console.log('characters: >>', characters);

  await setWorldMaster(assistants[0]);
  const worldMasters = await getWorldMasters();
  console.log('worldMasters: >>', worldMasters);

  await setSystemPrompt();
  const systemPrompts = await getSystemPrompts();
  console.log('systemPrompts: >>', systemPrompts);

  await setWorld();
  const worlds = await getWorlds();
  console.log('worlds: >>', worlds);

  await setLocation();
  const locations = await getLocations();
  console.log('locations: >>', locations);

  await setItem();
  const items = await getItems();
  console.log('items: >>', items);

  await setAdventure(worlds, locations, characters, items, worldMasters[0], systemPrompts);
  const adventures = await getAdventures();
  console.log('adventures: >>', adventures);
  console.log('adventures.json', JSON.stringify(adventures));

  if (adventures.length > 0) {
    const appended = await appendChatAdventure(adventures[0]);
    console.log('appendChatAdventure result: >>', appended);
    const prompt = await getAdventureText(adventures[0]);
    return prompt.prompt;
  }

  return undefined;
}

const sidebarMenuItems: SidebarMenuItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'adventures', label: 'Adventures' },
  { id: 'characters', label: 'Characters' },
  { id: 'worldMasters', label: 'World Masters' },
  { id: 'worlds', label: 'Worlds' },
  { id: 'settings', label: 'Settings' },
];

function App() {
  const [prompt, setPrompt] = useState<string>('Seélokomeu');
  const [activeRoute, setActiveRoute] = useState<SidebarRoute>('home');

  useEffect(() => {
    doSomething().catch(console.error).then((textPrompt) => {
      if (textPrompt) {
        setPrompt(textPrompt);
      }
    });
  }, []);

  return (
    <SidebarPanel
      menuItems={sidebarMenuItems}
      activeRoute={activeRoute}
      onRouteChange={setActiveRoute}
    >
      {activeRoute === 'settings' ? (
        <SettingsScreen />
      ) : activeRoute === 'worlds' ? (
        <WorldScreen />
      ) : (
        <View style={styles.app}>
          <View style={styles.header}>
            <Image
              accessibilityLabel="React logo"
              source={{ uri: logoUri }}
              resizeMode="contain"
              style={styles.logo}
            />
            <Text style={styles.title}>React Native for Web</Text>
          </View>
          <Text style={styles.text}>
            This is an example of an app built with{' '}
            <Link href="https://github.com/facebook/create-react-app">
              Create React App
            </Link>{' '}
            and{' '}
            <Link href="https://github.com/necolas/react-native-web">
              React Native for Web
            </Link>
          </Text>
          <Text style={styles.text}>
            To get started, edit{' '}
            <Link href="https://codesandbox.io/s/q4qymyp2l6/" style={styles.code}>
              src/App.js
            </Link>
            .
          </Text>
          <Pressable onPress={() => { }} style={buttonStyles.button}>
            <Text style={buttonStyles.text}>Example button</Text>
          </Pressable>
          <TextAreaStream prompt={prompt} setPrompt={setPrompt} />
        </View>
      )}
    </SidebarPanel>
  );
}

const styles = StyleSheet.create({
  app: {
    gap: 10
  },
  logo: {
    height: 80
  },
  header: {
    padding: 20
  },
  title: {
    fontSize: 24,
    marginVertical: 16,
    color: '#fff'
  },
  text: {
    lineHeight: 28,
    fontSize: 18,
    marginVertical: 16,
    color: '#fff'
  },
  link: {
    color: '#1B95E0'
  },
  code: {
    fontFamily: 'monospace, monospace'
  },
  scrollContent: {
    flexGrow: 1,
  }
});

const buttonStyles = StyleSheet.create({
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 2
  },
  text: {
    color: '#fff',
    fontWeight: '500',
    padding: 8,
    textAlign: 'center',
    textTransform: 'uppercase'
  }
});

export default App;
