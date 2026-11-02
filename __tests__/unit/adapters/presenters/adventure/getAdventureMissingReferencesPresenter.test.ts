import { GetAdventureMissingReferencesPresenter } from '@adapters/presenters';
import { MissingReferenceKindEnum, MissingReferenceOwnerEnum } from '@domain/entities';

describe('GetAdventureMissingReferencesPresenter', () => {
    it('says which field failed and where to edit it', () => {
        const issues = new GetAdventureMissingReferencesPresenter().present([
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Aria', kind: MissingReferenceKindEnum.ABILITY, id: 'ability' },
        ]);

        expect(issues).toEqual(['Characters > Aria: an entry from Abilities is no longer available']);
    });

    it('uses a readable name for fields with more than one word', () => {
        const issues = new GetAdventureMissingReferencesPresenter().present([
            { owner: MissingReferenceOwnerEnum.WORLD_MASTER, ownerName: 'Luna', kind: MissingReferenceKindEnum.ASSISTANT, id: 'assistant' },
            { owner: MissingReferenceOwnerEnum.ADVENTURE, ownerName: 'Quest', kind: MissingReferenceKindEnum.SYSTEM_PROMPT, id: 'prompt' },
        ]);

        expect(issues).toEqual([
            'World Masters > Luna: an entry from Assistants is no longer available',
            'Adventures > Quest: an entry from System Prompts is no longer available',
        ]);
    });

    it('shows one line when several ids of the same field failed on the same owner', () => {
        const issues = new GetAdventureMissingReferencesPresenter().present([
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Aria', kind: MissingReferenceKindEnum.ABILITY, id: 'first' },
            { owner: MissingReferenceOwnerEnum.CHARACTER, ownerName: 'Aria', kind: MissingReferenceKindEnum.ABILITY, id: 'second' },
        ]);

        expect(issues).toEqual(['Characters > Aria: an entry from Abilities is no longer available']);
    });
});
