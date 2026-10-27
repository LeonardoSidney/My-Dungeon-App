import {
    Ability,
    Item,
    Location,
    Proficiency,
    Status,
    SystemPrompt,
    World,
    WorldMaster,
} from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    AdventureTemplates,
    BuildAdventureTextSystemPromptReturn,
    EnabledCharacterReferences,
    ITextGeneration,
    LoadOrderSections,
    ResolveTemplatesReturn,
} from '@domain/providers';
import { ITextGenerationTemplatesService, LOAD_ORDER_TAG_PATTERN } from '@domain/services';
import { HydratedAdventure, HydratedCharacter } from '@domain/use-cases';

export class TextGeneration implements ITextGeneration {
    constructor (
        private readonly logger: ILogger,
        private readonly templatesService: ITextGenerationTemplatesService
    ) { }

    buildAdventureTextSystemPrompt (hydrated: HydratedAdventure, loadOrder: string): BuildAdventureTextSystemPromptReturn {
        this.logger.info('TextGeneration::buildAdventureText');
        this.logger.debug(`Building adventure text for: ${hydrated.adventure.name}`);

        const templatesResponse = this.resolveTemplates();
        if (!templatesResponse.success || !templatesResponse.templates) {
            this.logger.warning('TextGeneration::buildAdventureText - failed to resolve templates', templatesResponse.error);
            return { success: false, error: templatesResponse.error };
        }

        const templates = templatesResponse.templates;
        const { systemPrompts, worldMaster, worlds, locations, items, characters } = hydrated;
        const enabledReferences = this.resolveEnabledCharacterReferences(loadOrder);
        const systemPromptTemplate = this.buildSystemPromptTemplate(systemPrompts, templates.systemPrompt);
        this.logger.debug('System prompt template built', systemPromptTemplate);

        const worldMasterTemplate = this.buildWorldMasterTemplate(worldMaster, templates.worldMaster);
        this.logger.debug('WorldMaster template built', worldMasterTemplate);

        const worldsTemplate = this.buildWorldsTemplate(worlds, templates.worlds);
        this.logger.debug('Worlds template built', worldsTemplate);

        const locationsTemplate = this.buildLocationsTemplate(locations, templates.locations);
        this.logger.debug('Locations template built', locationsTemplate);

        const itemsTemplate = this.buildItemsTemplate(items, templates.items);
        this.logger.debug('Items template built', itemsTemplate);

        const abilitiesTemplate = this.buildAbilitiesTemplate(characters, templates.abilities);
        this.logger.debug('Abilities template built', abilitiesTemplate);

        const proficienciesTemplate = this.buildProficienciesTemplate(characters, templates.proficiencies);
        this.logger.debug('Proficiencies template built', proficienciesTemplate);

        const statusesTemplate = this.buildStatusesTemplate(characters, templates.statuses);
        this.logger.debug('Statuses template built', statusesTemplate);

        const iaControlledCharacterTemplate = this.buildIaControlledCharacterTemplate(characters, templates.iaControlledCharacter, enabledReferences);
        this.logger.debug('IA-controlled character template built', iaControlledCharacterTemplate);

        const charactersTemplate = this.buildCharactersTemplate(characters, templates.characters, enabledReferences);
        this.logger.debug('Characters template built', charactersTemplate);

        this.logger.debug('Adventure text built successfully');
        const sections: LoadOrderSections = new Map([
            ['systemPrompt', systemPromptTemplate],
            ['worldMaster', worldMasterTemplate],
            ['characterAsWorldMaster', iaControlledCharacterTemplate],
            ['worlds', worldsTemplate],
            ['locations', locationsTemplate],
            ['items', itemsTemplate],
            ['abilities', abilitiesTemplate],
            ['proficiencies', proficienciesTemplate],
            ['statuses', statusesTemplate],
            ['characters', charactersTemplate],
        ]);
        const systemPrompt = this.fillLoadOrder(loadOrder, sections);

        return { success: true, systemPrompt };
    }

    private resolveTemplates (): ResolveTemplatesReturn {
        const responses: Record<keyof AdventureTemplates, { success: boolean; template?: string; error?: string; }> = {
            systemPrompt: this.templatesService.getSystemPromptTemplate(),
            worldMaster: this.templatesService.getWorldMasterTemplate(),
            iaControlledCharacter: this.templatesService.getIaControlledCharacterTemplate(),
            worlds: this.templatesService.getWorldsTemplate(),
            locations: this.templatesService.getLocationsTemplate(),
            items: this.templatesService.getItemsTemplate(),
            abilities: this.templatesService.getAbilitiesTemplate(),
            proficiencies: this.templatesService.getProficienciesTemplate(),
            statuses: this.templatesService.getStatusesTemplate(),
            characters: this.templatesService.getCharactersTemplate(),
        };

        const templates = {} as AdventureTemplates;
        for (const key of Object.keys(responses) as (keyof AdventureTemplates)[]) {
            const response = responses[key];
            if (!response.success || !response.template) {
                return { success: false, error: response.error ?? `Text generation template not found: ${key}` };
            }
            templates[key] = response.template;
        }

        return { success: true, templates };
    }

    private fillLoadOrder (loadOrder: string, sections: LoadOrderSections): string {
        return loadOrder.replace(LOAD_ORDER_TAG_PATTERN, (tag: string, name: string) => sections.get(name) ?? tag);
    }

    private resolveEnabledCharacterReferences (loadOrder: string): EnabledCharacterReferences {
        return {
            abilities: loadOrder.includes('{abilities}'),
            proficiencies: loadOrder.includes('{proficiencies}'),
            statuses: loadOrder.includes('{statuses}'),
        };
    }

    private buildCharacterResourceReferences (character: HydratedCharacter, enabledReferences: EnabledCharacterReferences): string {
        this.logger.info('TextGeneration::buildCharacterResourceReferences');
        this.logger.debug(`Building resource references for character: ${character.name}`);

        let references = '';

        if (enabledReferences.abilities && character.abilities.length > 0) {
            this.logger.debug(`Character ${character.name} has ${character.abilities.length} abilities`);
            references += '### ABILITIES\n';
            for (const ability of character.abilities) {
                references += `- **${ability.name}**\n`;
            }
            references += '\n';
        }

        if (enabledReferences.proficiencies && character.proficiencies.length > 0) {
            this.logger.debug(`Character ${character.name} has ${character.proficiencies.length} proficiencies`);
            references += '### PROFICIENCIES\n';
            for (const proficiency of character.proficiencies) {
                references += `- **${proficiency.name}**\n`;
            }
            references += '\n';
        }

        if (enabledReferences.statuses && character.statuses.length > 0) {
            this.logger.debug(`Character ${character.name} has ${character.statuses.length} statuses`);
            references += '### STATUSES\n';
            for (const status of character.statuses) {
                references += `- **${status.name}**\n`;
            }
            references += '\n';
        }

        return references;
    }

    private buildIaControlledCharacterTemplate (
        characters: HydratedCharacter[],
        template: string,
        enabledReferences: EnabledCharacterReferences
    ): string {
        const iaControlledCharacter = characters.find(c => c.worldMaster === true);
        if (!iaControlledCharacter) {
            return '';
        }

        this.logger.debug(`Building IA-controlled character template for: ${iaControlledCharacter.name}`);
        const characterHeader = `## ${iaControlledCharacter.name.toUpperCase()}\n`;
        const characterReferences = this.buildCharacterResourceReferences(iaControlledCharacter, enabledReferences);
        const characterBlock = `${characterHeader}${iaControlledCharacter.prompt}\n${characterReferences}`;
        return template.replace('{characterAsWorldMaster}', () => characterBlock);
    }

    private buildSystemPromptTemplate (systemPrompts: SystemPrompt[], template: string): string {
        let systemPromptsText = '';
        for (const systemPrompt of systemPrompts) {
            systemPromptsText += `${systemPrompt.content}\n`;
        }

        this.logger.debug(`Found ${systemPrompts.length} system prompts`);
        return template.replace('{systemPrompt}', () => systemPromptsText);
    }

    private buildWorldMasterTemplate (worldMaster: WorldMaster | undefined, template: string): string {
        if (!worldMaster) {
            return '';
        }

        const promptPresence = worldMaster.prompt ? 'present' : 'empty';
        this.logger.debug(`WorldMaster prompt: ${promptPresence}`);
        return template.replace('{worldMaster}', () => `${worldMaster.prompt}`);
    }

    private buildWorldsTemplate (worlds: World[], template: string): string {
        if (worlds.length === 0) {
            return '';
        }

        let worldsText = '';
        for (const world of worlds) {
            worldsText += `## ${world.name.toUpperCase()}\n${world.prompt}\n`;
        }

        this.logger.debug(`Found ${worlds.length} worlds`);
        return template.replace('{worlds}', () => worldsText);
    }

    private buildLocationsTemplate (locations: Location[], template: string): string {
        if (locations.length === 0) {
            return '';
        }

        let locationsText = '';
        for (const location of locations) {
            locationsText += `## ${location.name.toUpperCase()}\n${location.prompt}\n`;
        }
        this.logger.debug(`Found ${locations.length} locations`);
        return template.replace('{locations}', () => locationsText);
    }

    private buildItemsTemplate (items: Item[], template: string): string {
        if (items.length === 0) {
            return '';
        }

        let itemsText = '';
        for (const item of items) {
            itemsText += `## ${item.name.toUpperCase()}\n${item.prompt}\n`;
        }
        this.logger.debug(`Found ${items.length} items`);
        return template.replace('{items}', () => itemsText);
    }

    private buildAbilitiesTemplate (characters: HydratedCharacter[], template: string): string {
        const uniqueAbilities = new Map<string, Ability>();

        for (const character of characters) {
            for (const ability of character.abilities) {
                if (!uniqueAbilities.has(ability.id)) {
                    uniqueAbilities.set(ability.id, ability);
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
        return template.replace('{abilities}', () => abilities);
    }

    private buildProficienciesTemplate (characters: HydratedCharacter[], template: string): string {
        const uniqueProficiencies = new Map<string, Proficiency>();

        for (const character of characters) {
            for (const proficiency of character.proficiencies) {
                if (!uniqueProficiencies.has(proficiency.id)) {
                    uniqueProficiencies.set(proficiency.id, proficiency);
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
        return template.replace('{proficiencies}', () => proficiencies);
    }

    private buildStatusesTemplate (characters: HydratedCharacter[], template: string): string {
        const uniqueStatuses = new Map<string, Status>();

        for (const character of characters) {
            for (const status of character.statuses) {
                if (!uniqueStatuses.has(status.id)) {
                    uniqueStatuses.set(status.id, status);
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
        return template.replace('{statuses}', () => statuses);
    }

    private buildCharactersTemplate (
        characters: HydratedCharacter[],
        template: string,
        enabledReferences: EnabledCharacterReferences
    ): string {
        let charactersText = '';
        for (const character of characters) {
            if (character.worldMaster === true) {
                this.logger.debug(`Skipping IA-controlled character: ${character.name}`);
                continue;
            }

            this.logger.debug(`Processing character: ${character.name}`);
            charactersText += `## ${character.name.toUpperCase()}\n${character.prompt}\n`;
            charactersText += this.buildCharacterResourceReferences(character, enabledReferences);
        }

        const playableCharacters = characters.filter(c => c.worldMaster !== true);
        this.logger.debug(`Found ${playableCharacters.length} playable characters`);
        return template.replace('{characters}', () => charactersText);
    }
}
