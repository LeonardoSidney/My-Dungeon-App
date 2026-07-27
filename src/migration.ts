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
import {
    Ability,
    Adventure,
    Assistant,
    Attribute,
    Character,
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

async function setConnection (): Promise<void> {
    const createConnection = createConnectionConfigController();
    await createConnection.handle({
        name: 'llamacpp2',
        ip: '192.168.18.101',
        port: 8080,
    });
}

async function getConnections (): Promise<Connection[]> {
    const connectionsController = getConnectionsController();
    return connectionsController.handle();
}

async function getModels (connection: Connection) {
    const modelsController = getModelsFromProviderController();
    return modelsController.handle({ connection });
}

async function getSamplers () {
    const samplersController = getSamplersController();
    return samplersController.handle();
}

async function setAssistant (sampler: Sampler, model: Model) {
    const createAssistant = createAssistantController();

    await createAssistant.handle({
        model,
        sampler,
        name: 'test',
        observation: 'test'
    });
}

async function setCharacter (
    assistant: Assistant,
    abilities: Ability[],
    attributes: Attribute[],
    proficiencies: Proficiency[],
    statuses: Status[]
) {
    const createCharacter = createCharacterController();

    await createCharacter.handle({
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

async function getAssistants () {
    const assistantsController = getAssistantsController();
    return assistantsController.handle();
}

async function setAbility () {
    const createAbility = createAbilityController();
    await createAbility.handle({
        name: 'Bola de fogo',
        prompt: 'Uma simples habilidade de bola de fogo',
        observation: 'Tive essa ideia vendo um mago fazer magias mágicas',
        activationWorld: 'bola de fogo;magia de fogo'
    });
}

async function getAbilities () {
    const abilitiesController = getAbilitiesController();
    return abilitiesController.handle();
}

async function setStatus () {
    const createStatus = createStatusController();
    await createStatus.handle({
        name: 'Curse',
        prompt: 'Seu personagem foi amaldiçoado pela eternidade',
        observation: 'A alma escura',
        activationWord: 'curse;undead'
    });
}

async function getStatuses () {
    const statusesController = getStatusesController();
    return statusesController.handle();
}

async function setProficiency () {
    const createProficiency = createProficiencyController();
    await createProficiency.handle({
        name: 'Ferragem',
        prompt: 'É quando um ferreiro sabe ferrear',
        activationWord: 'ferreiro;ferramenta;martelo',
        observation: 'Vi um ferreiro ferreando e tive uma ideia férrea'
    });
}

async function getProficiencies () {
    const proficienciesController = getProficienciesController();
    return proficienciesController.handle();
}

async function getCharacters () {
    const charactersController = getCharactersController();
    return charactersController.handle();
}

function getAttributes (): Attribute[] {
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

async function setWorldMaster (assistant: Assistant) {
    const createWorldMaster = createWorldMasterController();
    await createWorldMaster.handle({
        name: 'Dungeon Master',
        activationWord: 'dungeon master;dm',
        prompt: 'Você é o mestre do jogo de RPG Dungeon & Dragons',
        observation: 'O mestre do jogo',
        assistant
    });
}

async function getWorldMasters () {
    const worldMasters = getWorldMasterController();
    return worldMasters.handle();
}

async function setSystemPrompt () {
    const createSystemPrompt = createSystemPromptController();
    await createSystemPrompt.handle({
        name: 'D&D Prompt',
        content: 'Você é um mestre de RPG que gera aventuras para jogadores iniciantes',
        observation: 'Um mestre de RPG experiente'
    });
}

async function getSystemPrompts () {
    const systemPromptsController = getSystemPromptsController();
    return systemPromptsController.handle();
}

async function setWorld () {
    const createWorld = createWorldController();
    await createWorld.handle({
        name: 'Mundo de Teste',
        activationWord: 'teste',
        prompt: 'Um mundo de testes',
        observation: 'Um mundo de testes para verificar se tudo funciona'
    });
}

async function getWorlds () {
    const worldsController = getWorldsController();
    return worldsController.handle();
}

async function setLocation () {
    const createLocation = createLocationController();
    await createLocation.handle({
        name: 'Cidade de Teste',
        activationWord: 'teste',
        prompt: 'Uma cidade de testes',
        observation: 'Uma cidade de testes para verificar se tudo funciona'
    });
}

async function getLocations () {
    const locationsController = getLocationsController();
    return locationsController.handle();
}

async function setItem () {
    const createItem = createItemController();
    await createItem.handle({
        name: 'Espada de Ferro',
        activationWord: 'espada;ferramenta;arma',
        prompt: 'Uma espada de ferro comum',
        observation: 'Uma espada de ferro comum para iniciantes'
    });
}

async function getItems () {
    const itemsController = getItemsController();
    return itemsController.handle();
}

async function setAdventure (
    worlds: World[],
    locations: Location[],
    characters: Character[],
    items: Item[],
    worldMaster: WorldMaster,
    systemPrompts: SystemPrompt[]
) {
    const createAdventure = createAdventureController();
    await createAdventure.handle({
        name: 'Aventura de Teste',
        worlds,
        locations,
        characters,
        items,
        worldMaster,
        systemPrompts
    });
}

async function getAdventures () {
    const adventuresController = getAdventuresController();
    return adventuresController.handle();
}

async function appendChatAdventure (adventure: Adventure) {
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

async function eraseAdventures () {
    const eraseAdventuresCtrl = eraseAdventuresController();
    await eraseAdventuresCtrl.handle();
}

async function getAdventureText (adventure: Adventure) {
    const getAdventureTextCtrl = getAdventureTextController();
    return getAdventureTextCtrl.handle({ adventure });
}

export async function runMigration (): Promise<string | undefined> {
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
