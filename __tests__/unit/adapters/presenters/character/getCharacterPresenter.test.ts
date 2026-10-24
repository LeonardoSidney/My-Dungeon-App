import { GetCharacterPresenter } from '@adapters/presenters';
import { createAttributeHelper, createCharacterHelper } from '@test/helpers';

const presenter = new GetCharacterPresenter();

describe('GetCharacterPresenter', () => {
    it('exposes the character details without the timestamps', () => {
        const attribute = createAttributeHelper();
        const character = createCharacterHelper({
            id: 'hero',
            abilityIds: ['ability-1'],
            proficiencyIds: ['proficiency-1'],
            statusIds: ['status-1'],
            attributes: [attribute]
        });

        expect(presenter.present(character)).toEqual({
            id: 'hero',
            name: character.name,
            activationWord: character.activationWord,
            prompt: character.prompt,
            observation: character.observation,
            assistantId: character.assistantId,
            abilityIds: ['ability-1'],
            proficiencyIds: ['proficiency-1'],
            statusIds: ['status-1'],
            attributes: [attribute]
        });
    });

    it('presents missing lists as empty lists', () => {
        const character = createCharacterHelper({
            abilityIds: undefined,
            proficiencyIds: undefined,
            statusIds: undefined,
            attributes: undefined
        });

        expect(presenter.present(character)).toEqual(expect.objectContaining({
            abilityIds: [],
            proficiencyIds: [],
            statusIds: [],
            attributes: []
        }));
    });
});
