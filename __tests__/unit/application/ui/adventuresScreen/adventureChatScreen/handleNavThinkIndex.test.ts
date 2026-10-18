import { Dispatch, SetStateAction } from 'react';
import { Adventure, Think } from '@domain/entities';
import { handleNavThinkIndex } from '@application/ui/adventuresScreen/adventureChatScreen/handleNavThinkIndex';
import { createAdventureHelper, createChatHelper } from '@test/helpers';

const thinks: Think[] = [
    { id: 't0', content: 'zero', enabled: true },
    { id: 't1', content: 'one', enabled: true },
    { id: 't2', content: 'two', enabled: true }
];

function buildNavigator (adventure: Adventure) {
    const setCurrentAdventure = jest.fn();
    const navigate = handleNavThinkIndex({
        currentAdventure: adventure,
        setCurrentAdventure: setCurrentAdventure as unknown as Dispatch<SetStateAction<Adventure>>
    });
    return { setCurrentAdventure, navigate };
}

describe('handleNavThinkIndex', () => {
    it('advances to the next think version without moving the content index', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', think: thinks, thinkIndex: 0, index: 1 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', 1);

        expect(setCurrentAdventure).toHaveBeenCalledWith(
            expect.objectContaining({
                chat: expect.arrayContaining([expect.objectContaining({ id: 'multi', thinkIndex: 1, index: 1 })])
            })
        );
    });

    it('goes back to the previous think version', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', think: thinks, thinkIndex: 2 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', -1);

        expect(setCurrentAdventure).toHaveBeenCalledWith(
            expect.objectContaining({
                chat: expect.arrayContaining([expect.objectContaining({ id: 'multi', thinkIndex: 1 })])
            })
        );
    });

    it('clamps advance at the last think version without updating', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', think: thinks, thinkIndex: 2 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', 1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('clamps back at the first think version without updating', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', think: thinks, thinkIndex: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('multi', -1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('ignores chats without think versions', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'plain' })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('plain', 1);
        navigate('plain', -1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('ignores single-version thinks', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'single', think: [thinks[0]], thinkIndex: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('single', 1);
        navigate('single', -1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });

    it('ignores unknown chat ids', () => {
        const adventure = createAdventureHelper({
            chat: [createChatHelper({ id: 'multi', think: thinks, thinkIndex: 0 })]
        });
        const { setCurrentAdventure, navigate } = buildNavigator(adventure);

        navigate('missing', 1);

        expect(setCurrentAdventure).not.toHaveBeenCalled();
    });
});
