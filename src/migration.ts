import {
    getAbilitiesController,
    getAdventureTextController,
    getAdventuresController,
    getAssistantsController,
    getCharactersController,
    getItemsController,
    getLocationsController,
    getProficienciesController,
    getStatusesController,
    getSystemPromptsController,
    getWorldMasterController,
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

export async function runSeed (): Promise<string | undefined> {
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

    const connections = await seedConnections(connectionSeeds);
    const { connection, models } = await resolveActiveConnection(connections, assistantSeeds);
    await seedSamplers(samplerSeeds);
    await seedAssistants(assistantSeeds, connection, models);

    await seedAbilities(abilitySeeds);
    await seedStatuses(statusSeeds);
    await seedProficiencies(proficiencySeeds);

    const assistants = await getAssistantsController().handle();
    const abilities = await getAbilitiesController().handle();
    const statuses = await getStatusesController().handle();
    const proficiencies = await getProficienciesController().handle();

    await seedCharacters(characterSeeds, assistants, abilities, proficiencies, statuses);

    await seedWorldMasters(worldMasterSeeds, assistants);
    await seedSystemPrompts(systemPromptSeeds);
    await seedWorlds(worldSeeds);
    await seedLocations(locationSeeds);
    await seedItems(itemSeeds);

    const characters = await getCharactersController().handle();
    const worldMasters = await getWorldMasterController().handle();
    const systemPrompts = await getSystemPromptsController().handle();
    const worlds = await getWorldsController().handle();
    const locations = await getLocationsController().handle();
    const items = await getItemsController().handle();

    await seedAdventures(
        adventureSeeds,
        characters,
        worldMasters,
        systemPrompts,
        worlds,
        locations,
        items
    );

    const getAdventures = getAdventuresController();
    const getAdventureText = getAdventureTextController();
    const adventures = await getAdventures.handle();
    const firstAdventure = adventures[0];
    if (!firstAdventure) {
        logger.warning('Migration: finished, but no adventure was found');
        return undefined;
    }

    const promptResponse = await getAdventureText.handle({ adventure: firstAdventure });
    if (!promptResponse.success || !promptResponse.prompt) {
        logger.warning(`Migration: failed to build adventure prompt: ${promptResponse.error}`);
        return undefined;
    }

    logger.info('Migration: seed finished');
    return promptResponse.prompt;
}
