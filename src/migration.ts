import {
    getAbilitiesController,
    getAdventureTemplatedPromptController,
    getAdventuresController,
    getAssistantsController,
    getCharactersController,
    getItemsController,
    getLocationsController,
    getProficienciesController,
    getStatusesController,
    getSystemPromptsController,
    getWorldMastersController,
    getWorldsController,
} from '@infra/container';
import { logger } from '@infra/container/shared';
import {
    SeedAbility,
    SeedAdventure,
    SeedAssistant,
    SeedCharacter,
    SeedConnection,
    SeedItem,
    SeedLocation,
    SeedProficiency,
    SeedSampler,
    SeedStatus,
    SeedSystemPrompt,
    SeedWorld,
    SeedWorldMaster,
} from './migrations/types';
import {
    isSeedAbility,
    isSeedAdventure,
    isSeedAssistant,
    isSeedCharacter,
    isSeedConnection,
    isSeedItem,
    isSeedLocation,
    isSeedProficiency,
    isSeedSampler,
    isSeedStatus,
    isSeedSystemPrompt,
    isSeedWorld,
    isSeedWorldMaster,
    parseSeedArray,
} from './migrations/guards';
import { seedConnections, resolveActiveConnection } from './migrations/seedConnections';
import { listItems, MigrationReturn } from './migrations/shared';
import { seedSamplers } from './migrations/seedSamplers';
import { seedAssistants } from './migrations/seedAssistants';
import { seedAbilities } from './migrations/seedAbilities';
import { seedStatuses } from './migrations/seedStatuses';
import { seedProficiencies } from './migrations/seedProficiencies';
import { seedCharacters } from './migrations/seedCharacters';
import { seedWorldMasters } from './migrations/seedWorldMasters';
import { seedSystemPrompts } from './migrations/seedSystemPrompts';
import { seedWorlds } from './migrations/seedWorlds';
import { seedLocations } from './migrations/seedLocations';
import { seedItems } from './migrations/seedItems';
import { seedAdventures } from './migrations/seedAdventures';
import { splitAdventureStorage } from './migrations/splitAdventureStorage';
import connectionsData from './migrations/data/connections.json';
import samplersData from './migrations/data/samplers.json';
import assistantsData from './migrations/data/assistants.json';
import abilitiesData from './migrations/data/abilities.json';
import statusesData from './migrations/data/statuses.json';
import proficienciesData from './migrations/data/proficiencies.json';
import charactersData from './migrations/data/characters.json';
import worldMastersData from './migrations/data/worldMasters.json';
import systemPromptsData from './migrations/data/systemPrompts.json';
import worldsData from './migrations/data/worlds.json';
import locationsData from './migrations/data/locations.json';
import itemsData from './migrations/data/items.json';
import adventuresData from './migrations/data/adventures.json';

type RunSeedReturn = {
    success: boolean;
    prompt?: string;
    error?: string;
};

function fail (error: string | undefined): RunSeedReturn {
    logger.error('Migration: seed failed', error);
    return { success: false, error: error ?? 'Failed to seed data' };
}

export async function runStorageMigration (): Promise<MigrationReturn> {
    logger.info('Migration: starting storage migration');

    const splitAdventures = await splitAdventureStorage();
    if (!splitAdventures.success) return fail(splitAdventures.error);

    return { success: true };
}

export async function runSeed (): Promise<RunSeedReturn> {
    logger.info('Migration: starting seed');

    const connectionSeeds = parseSeedArray<SeedConnection>(connectionsData, 'connections', isSeedConnection);
    const samplerSeeds = parseSeedArray<SeedSampler>(samplersData, 'samplers', isSeedSampler);
    const assistantSeeds = parseSeedArray<SeedAssistant>(assistantsData, 'assistants', isSeedAssistant);
    const abilitySeeds = parseSeedArray<SeedAbility>(abilitiesData, 'abilities', isSeedAbility);
    const statusSeeds = parseSeedArray<SeedStatus>(statusesData, 'statuses', isSeedStatus);
    const proficiencySeeds = parseSeedArray<SeedProficiency>(proficienciesData, 'proficiencies', isSeedProficiency);
    const characterSeeds = parseSeedArray<SeedCharacter>(charactersData, 'characters', isSeedCharacter);
    const worldMasterSeeds = parseSeedArray<SeedWorldMaster>(worldMastersData, 'worldMasters', isSeedWorldMaster);
    const systemPromptSeeds = parseSeedArray<SeedSystemPrompt>(systemPromptsData, 'systemPrompts', isSeedSystemPrompt);
    const worldSeeds = parseSeedArray<SeedWorld>(worldsData, 'worlds', isSeedWorld);
    const locationSeeds = parseSeedArray<SeedLocation>(locationsData, 'locations', isSeedLocation);
    const itemSeeds = parseSeedArray<SeedItem>(itemsData, 'items', isSeedItem);
    const adventureSeeds = parseSeedArray<SeedAdventure>(adventuresData, 'adventures', isSeedAdventure);

    if (!connectionSeeds.seeds) return fail(connectionSeeds.error);
    if (!samplerSeeds.seeds) return fail(samplerSeeds.error);
    if (!assistantSeeds.seeds) return fail(assistantSeeds.error);
    if (!abilitySeeds.seeds) return fail(abilitySeeds.error);
    if (!statusSeeds.seeds) return fail(statusSeeds.error);
    if (!proficiencySeeds.seeds) return fail(proficiencySeeds.error);
    if (!characterSeeds.seeds) return fail(characterSeeds.error);
    if (!worldMasterSeeds.seeds) return fail(worldMasterSeeds.error);
    if (!systemPromptSeeds.seeds) return fail(systemPromptSeeds.error);
    if (!worldSeeds.seeds) return fail(worldSeeds.error);
    if (!locationSeeds.seeds) return fail(locationSeeds.error);
    if (!itemSeeds.seeds) return fail(itemSeeds.error);
    if (!adventureSeeds.seeds) return fail(adventureSeeds.error);

    const connections = await seedConnections(connectionSeeds.seeds);
    if (!connections.success || !connections.connections) return fail(connections.error);

    const active = await resolveActiveConnection(connections.connections, assistantSeeds.seeds);
    if (!active.success || !active.connection || !active.models) return fail(active.error);

    const samplers = await seedSamplers(samplerSeeds.seeds);
    if (!samplers.success) return fail(samplers.error);

    const seededAssistants = await seedAssistants(assistantSeeds.seeds, active.connection, active.models);
    if (!seededAssistants.success) return fail(seededAssistants.error);

    const seededAbilities = await seedAbilities(abilitySeeds.seeds);
    if (!seededAbilities.success) return fail(seededAbilities.error);

    const seededStatuses = await seedStatuses(statusSeeds.seeds);
    if (!seededStatuses.success) return fail(seededStatuses.error);

    const seededProficiencies = await seedProficiencies(proficiencySeeds.seeds);
    if (!seededProficiencies.success) return fail(seededProficiencies.error);

    const assistants = listItems(await getAssistantsController().handle(), 'assistants');
    if (!assistants.items) return fail(assistants.error);

    const abilities = listItems(await getAbilitiesController().handle(), 'abilities');
    if (!abilities.items) return fail(abilities.error);

    const statuses = listItems(await getStatusesController().handle(), 'statuses');
    if (!statuses.items) return fail(statuses.error);

    const proficiencies = listItems(await getProficienciesController().handle(), 'proficiencies');
    if (!proficiencies.items) return fail(proficiencies.error);

    const seededCharacters = await seedCharacters(characterSeeds.seeds, assistants.items, abilities.items, proficiencies.items, statuses.items);
    if (!seededCharacters.success) return fail(seededCharacters.error);

    const seededWorldMasters = await seedWorldMasters(worldMasterSeeds.seeds, assistants.items);
    if (!seededWorldMasters.success) return fail(seededWorldMasters.error);

    const seededSystemPrompts = await seedSystemPrompts(systemPromptSeeds.seeds);
    if (!seededSystemPrompts.success) return fail(seededSystemPrompts.error);

    const seededWorlds = await seedWorlds(worldSeeds.seeds);
    if (!seededWorlds.success) return fail(seededWorlds.error);

    const seededLocations = await seedLocations(locationSeeds.seeds);
    if (!seededLocations.success) return fail(seededLocations.error);

    const seededItems = await seedItems(itemSeeds.seeds);
    if (!seededItems.success) return fail(seededItems.error);

    const characters = listItems(await getCharactersController().handle(), 'characters');
    if (!characters.items) return fail(characters.error);

    const worldMasters = listItems(await getWorldMastersController().handle(), 'world masters');
    if (!worldMasters.items) return fail(worldMasters.error);

    const systemPrompts = listItems(await getSystemPromptsController().handle(), 'system prompts');
    if (!systemPrompts.items) return fail(systemPrompts.error);

    const worlds = listItems(await getWorldsController().handle(), 'worlds');
    if (!worlds.items) return fail(worlds.error);

    const locations = listItems(await getLocationsController().handle(), 'locations');
    if (!locations.items) return fail(locations.error);

    const items = listItems(await getItemsController().handle(), 'items');
    if (!items.items) return fail(items.error);

    const seededAdventures = await seedAdventures(
        adventureSeeds.seeds,
        characters.items,
        worldMasters.items,
        systemPrompts.items,
        worlds.items,
        locations.items,
        items.items
    );
    if (!seededAdventures.success) return fail(seededAdventures.error);

    const getAdventures = getAdventuresController();
    const getAdventureTemplatedPrompt = getAdventureTemplatedPromptController();
    const adventures = listItems(await getAdventures.handle(), 'adventures');
    if (!adventures.items) return fail(adventures.error);

    const firstAdventure = adventures.items[0];
    if (!firstAdventure) {
        logger.warning('Migration: finished, but no adventure was found');
        return { success: true };
    }

    const promptResponse = await getAdventureTemplatedPrompt.handle({ adventureId: firstAdventure.id });
    if (!promptResponse.success || !promptResponse.data) {
        logger.warning(`Migration: failed to build adventure prompt: ${promptResponse.error}`);
        return { success: true };
    }

    logger.info('Migration: seed finished');
    return { success: true, prompt: promptResponse.data };
}
