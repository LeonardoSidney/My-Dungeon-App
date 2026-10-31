import {
    Ability,
    Chat,
    Item,
    Location,
    Proficiency,
    RoleEnum,
    Status,
    SystemPrompt,
    World,
    WorldMaster,
} from '@domain/entities';
import type { ModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import {
    AdventureTemplates,
    BuildAdventureTextSystemPromptReturn,
    BuildAdventureTurnMessagesParams,
    BuildAdventureTurnMessagesReturn,
    EnabledCharacterReferences,
    ITextGeneration,
    LoadOrderSections,
    TemplateTagValues,
    TurnChats,
    TurnHistory,
    TurnMessageTemplates,
    TurnPromptPurposeEnum,
    UNKNOWN_CHARACTER_NAME,
} from '@domain/providers';
import { LOAD_ORDER_TAG_PATTERN, TurnSpeakerKindEnum } from '@domain/services';
import { HydratedAdventure, HydratedCharacter } from '@domain/use-cases';

export class TextGeneration implements ITextGeneration {
    constructor (
        private readonly logger: ILogger
    ) { }

    buildAdventureTextSystemPrompt (hydrated: HydratedAdventure, loadOrder: string, templates: AdventureTemplates): BuildAdventureTextSystemPromptReturn {
        this.logger.info('TextGeneration::buildAdventureText');
        this.logger.debug(`Building adventure text for: ${hydrated.adventure.name}`);

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
        const systemPrompt = this.fillTemplateTags(loadOrder, sections);

        return { success: true, systemPrompt };
    }

    buildAdventureTurnMessages (params: BuildAdventureTurnMessagesParams, templates: TurnMessageTemplates): BuildAdventureTurnMessagesReturn {
        this.logger.info('TextGeneration::buildAdventureTurnMessages');
        this.logger.debug('TextGeneration::buildAdventureTurnMessages - params', {
            speaker: params.speaker.name,
            purpose: params.purpose,
            targetChatId: params.targetChatId,
        });

        const turnChats = this.splitTurnChats(params.hydrated.adventure.chat, params.targetChatId);
        if (!turnChats) {
            return { success: false, error: `Chat with id ${params.targetChatId} was not found` };
        }

        const characterNames = this.resolveCharacterNames(params);
        const history = this.buildTurnHistory(turnChats.history, templates, characterNames);
        const currentTurnMessage: ModelProviderGateway.TemplateMessage = {
            role: RoleEnum.USER,
            content: this.buildCurrentTurnContent(params, history.currentTurn, templates, characterNames),
        };
        const messages = [...history.messages, currentTurnMessage];
        this.logger.debug(
            'TextGeneration::buildAdventureTurnMessages - user message built',
            { speaker: params.speaker.name, purpose: params.purpose },
            currentTurnMessage.content
        );

        const prefillMessage = this.buildPrefillMessage(params, turnChats.target);
        if (prefillMessage) {
            this.logger.debug('TextGeneration::buildAdventureTurnMessages - assistant message to continue', prefillMessage.content);
            messages.push(prefillMessage);
        }

        this.logger.debug('TextGeneration::buildAdventureTurnMessages - messages built', { count: messages.length });
        return { success: true, messages };
    }

    private splitTurnChats (chats: Chat[], targetChatId: string | undefined): TurnChats | null {
        if (!targetChatId) {
            return { history: chats };
        }

        const targetIndex = chats.findIndex(chat => chat.id === targetChatId);
        if (targetIndex === -1) {
            return null;
        }

        return { history: chats.slice(0, targetIndex), target: chats[targetIndex] };
    }

    private resolveCharacterNames (params: BuildAdventureTurnMessagesParams): Map<string, string> {
        return new Map(params.hydrated.characters.map(character => [character.id, character.name]));
    }

    private buildTurnHistory (chats: Chat[], templates: TurnMessageTemplates, characterNames: Map<string, string>): TurnHistory {
        const messages: ModelProviderGateway.TemplateMessage[] = [];
        let currentTurn: Chat[] = [];

        for (const chat of chats) {
            if (chat.role !== RoleEnum.ASSISTANT) {
                currentTurn.push(chat);
                continue;
            }

            if (currentTurn.length > 0) {
                messages.push({ role: RoleEnum.USER, content: this.buildTurnContent(currentTurn, templates, characterNames) });
            }
            currentTurn = [];

            const assistantMessage = this.buildAssistantMessage(chat);
            if (assistantMessage) {
                messages.push(assistantMessage);
            }
        }

        return { messages, currentTurn };
    }

    private buildCurrentTurnContent (
        params: BuildAdventureTurnMessagesParams,
        currentTurn: Chat[],
        templates: TurnMessageTemplates,
        characterNames: Map<string, string>
    ): string {
        const contextMessage = this.buildContextMessage(params, templates);
        const turnMessage = this.buildTurnContent(currentTurn, templates, characterNames);
        const instruction = this.fillTemplateTags(
            this.resolveInstructionTemplate(params, templates),
            new Map([['characterName', params.speaker.name]])
        );
        const instructionMessage = this.fillTemplateTags(templates.instructionsMessage, new Map([['instructionMessage', instruction]]));

        return this.fillTemplateTags(templates.message, new Map([
            ['context', contextMessage],
            ['turnMessage', turnMessage],
            ['instructionMessage', instructionMessage],
        ]));
    }

    private buildContextMessage (params: BuildAdventureTurnMessagesParams, templates: TurnMessageTemplates): string {
        const context = params.context?.trim();
        if (params.purpose === TurnPromptPurposeEnum.CONTEXT || !context) {
            return '';
        }

        return this.fillTemplateTags(templates.contextMessage, new Map([['chatbotResume', context]]));
    }

    private resolveInstructionTemplate (params: BuildAdventureTurnMessagesParams, templates: TurnMessageTemplates): string {
        if (params.purpose === TurnPromptPurposeEnum.CONTEXT) {
            return templates.contextInstruction;
        }

        if (params.speaker.kind === TurnSpeakerKindEnum.WORLD_MASTER) {
            return templates.worldMasterInstruction;
        }

        return templates.aiCharacterInstruction;
    }

    private buildTurnContent (chats: Chat[], templates: TurnMessageTemplates, characterNames: Map<string, string>): string {
        const charactersMessages = chats
            .map(chat => this.fillTemplateTags(templates.characterMessage, new Map([
                ['characterName', characterNames.get(chat.characterId) ?? UNKNOWN_CHARACTER_NAME],
                ['characterMessage', chat.content[chat.index] ?? ''],
            ])))
            .join('\n');

        return this.fillTemplateTags(templates.turnMessage, new Map([['charactersMessages', charactersMessages]]));
    }

    private buildPrefillMessage (params: BuildAdventureTurnMessagesParams, target: Chat | undefined): ModelProviderGateway.TemplateMessage | null {
        if (params.purpose === TurnPromptPurposeEnum.CONTEXT || !target) {
            return null;
        }

        return this.buildAssistantMessage(target);
    }

    private buildAssistantMessage (chat: Chat): ModelProviderGateway.TemplateMessage | null {
        const content = chat.content[chat.index] ?? '';
        const reasoning = this.resolveReasoning(chat);

        if (!reasoning && !content.trim()) {
            return null;
        }

        if (!reasoning) {
            return { role: RoleEnum.ASSISTANT, content };
        }

        return { role: RoleEnum.ASSISTANT, content, reasoning };
    }

    private resolveReasoning (chat: Chat): string | undefined {
        const think = chat.think?.[chat.thinkIndex];
        if (!think?.enabled || !think.content?.trim()) {
            return undefined;
        }

        return think.content;
    }

    private fillTemplateTags (template: string, values: TemplateTagValues): string {
        return template.replace(LOAD_ORDER_TAG_PATTERN, (tag: string, name: string) => values.get(name) ?? tag);
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
        return this.fillTemplateTags(template, new Map([['characterAsWorldMaster', characterBlock]]));
    }

    private buildSystemPromptTemplate (systemPrompts: SystemPrompt[], template: string): string {
        let systemPromptsText = '';
        for (const systemPrompt of systemPrompts) {
            systemPromptsText += `${systemPrompt.content}\n`;
        }

        this.logger.debug(`Found ${systemPrompts.length} system prompts`);
        return this.fillTemplateTags(template, new Map([['systemPrompt', systemPromptsText]]));
    }

    private buildWorldMasterTemplate (worldMaster: WorldMaster | undefined, template: string): string {
        if (!worldMaster) {
            return '';
        }

        const promptPresence = worldMaster.prompt ? 'present' : 'empty';
        this.logger.debug(`WorldMaster prompt: ${promptPresence}`);
        return this.fillTemplateTags(template, new Map([['worldMaster', `${worldMaster.prompt}`]]));
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
        return this.fillTemplateTags(template, new Map([['worlds', worldsText]]));
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
        return this.fillTemplateTags(template, new Map([['locations', locationsText]]));
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
        return this.fillTemplateTags(template, new Map([['items', itemsText]]));
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
        return this.fillTemplateTags(template, new Map([['abilities', abilities]]));
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
        return this.fillTemplateTags(template, new Map([['proficiencies', proficiencies]]));
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
        return this.fillTemplateTags(template, new Map([['statuses', statuses]]));
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
        return this.fillTemplateTags(template, new Map([['characters', charactersText]]));
    }
}
