import { Dispatch, SetStateAction } from 'react';
import { Adventure, RoleEnum } from '@domain/entities';
import { handleNavChatIndex } from '@application/ui/adventuresScreen/adventureChatScreen/handleNavChatIndex';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

function buildNavigator (adventure: Adventure) {
    const setCurrentAdventure = jest.fn();
    const navigate = handleNavChatIndex({
        currentAdventure: adventure,
        setCurrentAdventure: setCurrentAdventure as unknown as Dispatch<SetStateAction<Adventure>>
    });
    return { setCurrentAdventure, navigate };
}

describe('handleNavChatIndex', () => {
    it('advances to the next version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', content: ['v0', 'v1', 'v2'], index: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', 1);

        expect(setCurrentAdventure).toHaveBeenCalledWith(
            expect.objectContaining({
                chat: expect.arrayContaining([expect.objectContaining({ id: 'multi', index: 1 })])
            })
        );
    });

    it('goes back to the previous version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', content: ['v0', 'v1', 'v2'], index: 2 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', -1);

        expect(setCurrentAdventure).toHaveBeenCalledWith(
            expect.objectContaining({
                chat: expect.arrayContaining([expect.objectContaining({ id: 'multi', index: 1 })])
            })
        );
    });

    it('clamps advance at the last version without updating', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', content: ['v0', 'v1'], index: 1 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', 1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('clamps back at the first version without updating', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', content: ['v0', 'v1'], index: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', -1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('ignores single-version chats', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'single', content: ['only'], index: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('single', 1);
        navigate('single', -1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('ignores unknown chat ids', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', content: ['v0', 'v1'], index: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('missing', 1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('keeps the other chats untouched', () => {
        const assistant = createChatHelper({ id: 'assistant', role: RoleEnum.ASSISTANT, content: ['a0', 'a1'], index: 1 });
        const adventure = createAdventureHelper({
            chat: [
                createChatHelper({ id: 'multi', content: ['v0', 'v1'], index: 0 }),
                assistant
            ]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', 1);

        const [call] = setCurrentAdventure.mock.calls;
        expect(call[0].chat).toHaveLength(2);
        expect(call[0].chat[1]).toEqual(assistant);
    });
});
