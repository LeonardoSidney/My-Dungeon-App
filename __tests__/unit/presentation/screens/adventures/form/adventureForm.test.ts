import { toAdventureFormState, toAdventureRequest } from '@presentation/screens/adventures/form/adventureForm';

const options = {
    characters: [{ id: 'hero', name: 'Hero' }, { id: 'npc', name: 'Npc' }],
    systemPrompts: [{ id: 'prompt', name: 'Base' }],
    worldMasters: [{ id: 'wm', name: 'Luna' }],
    worlds: [],
    locations: [],
    items: [],
};

const adventure = {
    id: 'adventure-1',
    name: 'Quest',
    systemPromptIds: ['prompt'],
    playableCharacterIds: ['hero'],
    aiControlledCharacterIds: ['npc'],
    worldMasterId: 'wm',
    worldIds: [],
    locationIds: [],
    itemIds: [],
};

describe('toAdventureFormState', () => {
    it('keeps the AI controlled characters that still exist', () => {
        const form = toAdventureFormState(adventure, options);

        expect(form.charactersControlledByAi).toEqual(['npc']);
    });

    it('drops an AI controlled character that no longer exists, so the form can be saved', () => {
        const form = toAdventureFormState({ ...adventure, aiControlledCharacterIds: ['npc', 'erased'] }, options);

        expect(toAdventureRequest(form).aiControlledCharacterIds).toEqual(['npc']);
    });

    it('keeps the character acting as world master when it still exists', () => {
        const form = toAdventureFormState({ ...adventure, worldMasterId: undefined, characterAsWorldMasterId: 'npc' }, options);

        expect(form.characterAsWorldMasterId).toBe('npc');
    });

    it('drops a character acting as world master that no longer exists', () => {
        const form = toAdventureFormState({ ...adventure, worldMasterId: undefined, characterAsWorldMasterId: 'erased' }, options);

        expect(form.characterAsWorldMasterId).toBeUndefined();
    });
});
