import {
    DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE,
} from '@domain/constants/textGeneration';
import {
    Ability,
    Adventure,
    Character,
    Item,
    Location,
    Proficiency,
    Status,
    SystemPrompt,
    World,
    WorldMaster,
} from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ITextGeneration } from '@domain/providers';

export class TextGeneration implements ITextGeneration {
    constructor (private readonly logger: ILogger) {}
    buildAdventureTextSystemPrompt (adventure: Adventure): string {
        this.logger.info('TextGeneration::buildAdventureText');
        this.logger.debug(`Building adventure text for: ${adventure.name}`);

        const { systemPrompts, worldMaster, worlds, locations, items, characters } = adventure;
        const systemPromptTemplate = this.buildSystemPromptTemplate(systemPrompts);
        this.logger.debug('System prompt template built', systemPromptTemplate);

        const worldMasterTemplate = this.buildWorldMasterTemplate(worldMaster);
        this.logger.debug('WorldMaster template built', worldMasterTemplate);

        const worldsTemplate = this.buildWorldsTemplate(worlds);
        this.logger.debug('Worlds template built', worldsTemplate);

        const locationsTemplate = this.buildLocationsTemplate(locations);
        this.logger.debug('Locations template built', locationsTemplate);

        const itemsTemplate = this.buildItemsTemplate(items);
        this.logger.debug('Items template built', itemsTemplate);

        const abilitiesTemplate = this.buildAbilitiesTemplate(characters);
        this.logger.debug('Abilities template built', abilitiesTemplate);

        const proficienciesTemplate = this.buildProficienciesTemplate(characters);
        this.logger.debug('Proficiencies template built', proficienciesTemplate);

        const statusesTemplate = this.buildStatusesTemplate(characters);
        this.logger.debug('Statuses template built', statusesTemplate);

        const iaControlledCharacterTemplate = this.buildIaControlledCharacterTemplate(characters);
        this.logger.debug('IA-controlled character template built', iaControlledCharacterTemplate);

        const charactersTemplate = this.buildCharactersTemplate(characters);
        this.logger.debug('Characters template built', charactersTemplate);

        this.logger.debug('Adventure text built successfully');
        return DEFAULT_TEXT_ADVENTURE_TEMPLATE.replace('{systemPrompt}', systemPromptTemplate)
            .replace('{worldMaster}', worldMasterTemplate)
            .replace('{characterAsWorldMaster}', iaControlledCharacterTemplate)
            .replace('{worlds}', worldsTemplate)
            .replace('{locations}', locationsTemplate)
            .replace('{items}', itemsTemplate)
            .replace('{abilities}', abilitiesTemplate)
            .replace('{proficiencies}', proficienciesTemplate)
            .replace('{statuses}', statusesTemplate)
            .replace('{characters}', charactersTemplate);
    }

    private buildCharacterResourceReferences (character: Character): string {
        this.logger.info('TextGeneration::buildCharacterResourceReferences');
        this.logger.debug(`Building resource references for character: ${character.name}`);

        let references = '';

        if (character.abilities && character.abilities.length > 0) {
            this.logger.debug(`Character ${character.name} has ${character.abilities.length} abilities`);
            references += '### ABILITIES\n';
            for (const ability of character.abilities) {
                references += `- **${ability.name}**\n`;
            }
            references += '\n';
        }

        if (character.proficiencies && character.proficiencies.length > 0) {
            this.logger.debug(`Character ${character.name} has ${character.proficiencies.length} proficiencies`);
            references += '### PROFICIENCIES\n';
            for (const proficiency of character.proficiencies) {
                references += `- **${proficiency.name}**\n`;
            }
            references += '\n';
        }

        if (character.statuses && character.statuses.length > 0) {
            this.logger.debug(`Character ${character.name} has ${character.statuses.length} statuses`);
            references += '### STATUSES\n';
            for (const status of character.statuses) {
                references += `- **${status.name}**\n`;
            }
            references += '\n';
        }

        return references;
    }

    private buildIaControlledCharacterTemplate (characters: Character[]): string {
        const iaControlledCharacter = characters?.find(c => c.worldMaster === true);
        if (!iaControlledCharacter) {
            return '';
        }

        this.logger.debug(`Building IA-controlled character template for: ${iaControlledCharacter.name}`);
        const characterHeader = `## ${iaControlledCharacter.name.toUpperCase()}\n`;
        const characterReferences = this.buildCharacterResourceReferences(iaControlledCharacter);
        const characterBlock = `${characterHeader}${iaControlledCharacter.prompt}\n${characterReferences}`;
        return DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE.replace(
            '{characterAsWorldMaster}',
            characterBlock
        );
    }

    private buildSystemPromptTemplate (systemPrompts: SystemPrompt[]): string {
        let systemPromptsText = '';
        for (const systemPrompt of systemPrompts) {
            systemPromptsText += `${systemPrompt.content}\n`;
        }

        this.logger.debug(`Found ${systemPrompts.length} system prompts`);
        return DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE.replace('{systemPrompt}', systemPromptsText);
    }

    private buildWorldMasterTemplate (worldMaster: WorldMaster | undefined): string {
        if (!worldMaster) {
            return '';
        }

        this.logger.debug(`WorldMaster prompt: ${worldMaster.prompt ? 'present' : 'empty'}`);
        return DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE.replace('{worldMaster}', `${worldMaster.prompt}`);
    }

    private buildWorldsTemplate (worlds: World[] | undefined): string {
        if (!worlds || worlds.length === 0) {
            return '';
        }

        let worldsText = '';
        for (const world of worlds) {
            worldsText += `## ${world.name.toUpperCase()}\n${world.prompt}\n`;
        }

        this.logger.debug(`Found ${worlds.length} worlds`);
        return DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE.replace('{worlds}', worldsText);
    }

    private buildLocationsTemplate (locations: Location[] | undefined): string {
        if (!locations || locations.length === 0) {
            return '';
        }

        let locationsText = '';
        for (const location of locations) {
            locationsText += `## ${location.name.toUpperCase()}\n${location.prompt}\n`;
        }
        this.logger.debug(`Found ${locations.length} locations`);
        return DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE.replace('{locations}', locationsText);
    }

    private buildItemsTemplate (items: Item[] | undefined): string {
        if (!items || items.length === 0) {
            return '';
        }

        let itemsText = '';
        for (const item of items ?? []) {
            itemsText += `## ${item.name.toUpperCase()}\n${item.prompt}\n`;
        }
        this.logger.debug(`Found ${(items ?? []).length} items`);
        return DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE.replace('{items}', itemsText);
    }

    private buildAbilitiesTemplate (characters: Character[]): string {
        const uniqueAbilities = new Map<string, Ability>();

        for (const character of characters ?? []) {
            if (character.abilities) {
                for (const ability of character.abilities) {
                    if (!uniqueAbilities.has(ability.id)) {
                        uniqueAbilities.set(ability.id, ability);
                    }
                }
            }
        }

        this.logger.debug(`Found ${uniqueAbilities.size} unique abilities`);

        if (!uniqueAbilities.size) {
            return '';
        }

        let abilities = '';
        for (const ability of uniqueAbilities.values()) {
            abilities += `## ${ability.name.toUpperCase()}\n${ability.prompt}\n`;
        }
        return DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE.replace('{abilities}', abilities);
    }

    private buildProficienciesTemplate (characters: Character[]): string {
        const uniqueProficiencies = new Map<string, Proficiency>();

        for (const character of characters ?? []) {
            if (character.proficiencies) {
                for (const proficiency of character.proficiencies) {
                    if (!uniqueProficiencies.has(proficiency.id)) {
                        uniqueProficiencies.set(proficiency.id, proficiency);
                    }
                }
            }
        }

        this.logger.debug(`Found ${uniqueProficiencies.size} unique proficiencies`);

        if (!uniqueProficiencies.size) {
            return '';
        }

        let proficiencies = '';
        for (const proficiency of uniqueProficiencies.values()) {
            proficiencies += `## ${proficiency.name.toUpperCase()}\n${proficiency.prompt}\n`;
        }
        return DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE.replace('{proficiencies}', proficiencies);
    }

    private buildStatusesTemplate (characters: Character[]): string {
        const uniqueStatuses = new Map<string, Status>();

        for (const character of characters ?? []) {
            if (character.statuses) {
                for (const status of character.statuses) {
                    if (!uniqueStatuses.has(status.id)) {
                        uniqueStatuses.set(status.id, status);
                    }
                }
            }
        }

        this.logger.debug(`Found ${uniqueStatuses.size} unique statuses`);

        if (!uniqueStatuses.size) {
            return '';
        }

        let statuses = '';
        for (const status of uniqueStatuses.values()) {
            statuses += `## ${status.name.toUpperCase()}\n${status.prompt}\n`;
        }
        return DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE.replace('{statuses}', statuses);
    }

    private buildCharactersTemplate (characters: Character[]): string {
        let charactersText = '';
        for (const character of characters ?? []) {
            if (character.worldMaster === true) {
                this.logger.debug(`Skipping IA-controlled character: ${character.name}`);
                continue;
            }

            this.logger.debug(`Processing character: ${character.name}`);
            charactersText += `## ${character.name.toUpperCase()}\n${character.prompt}\n`;
            charactersText += this.buildCharacterResourceReferences(character);
        }

        const playableCharacters = (characters ?? []).filter(c => c.worldMaster !== true);
        this.logger.debug(`Found ${playableCharacters.length} playable characters`);
        return DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE.replace('{characters}', charactersText);
    }
}
