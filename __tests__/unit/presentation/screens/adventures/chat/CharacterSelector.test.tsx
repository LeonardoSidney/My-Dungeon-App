import React from 'react';
import { StyleSheet } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AdventureChatCharacter } from '@domain/controllers';
import { CharacterSelector } from '@presentation/screens/adventures/chat/components/CharacterSelector';
import { colors } from '@presentation/theme';

const richard = { id: 'richard', name: 'Richard Jones' } as AdventureChatCharacter;
const jeanne = { id: 'jeanne', name: 'Jeanne' } as AdventureChatCharacter;
const couple = { id: 'couple', name: 'John Jones & Cristina Jones' } as AdventureChatCharacter;
const onSelect = jest.fn();

async function setup (isCompact = false, selectedCharacter = richard, characters = [richard, jeanne]) {
  await render(
    <CharacterSelector characters={characters} selectedCharacter={selectedCharacter} onSelect={onSelect} isCompact={isCompact} />,
  );
}

const openSelector = () => fireEvent.press(screen.getByLabelText('Personagem: Richard Jones'));

describe('CharacterSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the arrow and the first word of the name by default', async () => {
    await setup();

    expect(screen.getByText('▲ Richard')).toBeTruthy();
  });

  it('shows the first word of a name with several words', async () => {
    await setup(false, couple);

    expect(screen.getByText('▲ John')).toBeTruthy();
  });

  it('adds words until the name differs from the other characters', async () => {
    const johnJones = { id: 'john', name: 'John Jones' } as AdventureChatCharacter;
    const johnWick = { id: 'wick', name: 'John Wick' } as AdventureChatCharacter;

    await setup(false, johnJones, [johnJones, johnWick]);

    expect(screen.getByText('▲ John Jones')).toBeTruthy();
  });

  it('keeps the full name in the list', async () => {
    await setup();

    await openSelector();

    expect(screen.getByText('Richard Jones')).toBeTruthy();
  });

  it('shows only the arrow when compact', async () => {
    await setup(true);

    expect(screen.getByText('▲')).toBeTruthy();
    expect(screen.queryByText(/Richard/)).toBeNull();
  });

  it('flips the arrow while the list is open', async () => {
    await setup(true);

    await openSelector();

    expect(screen.getByText('▼')).toBeTruthy();
  });

  it('names the selected character for screen readers when compact', async () => {
    await setup(true);

    expect(screen.getByLabelText('Personagem: Richard Jones')).toBeTruthy();
  });

  it('highlights the selected character in the list', async () => {
    await setup(true);

    await openSelector();

    const selectedItem = screen.getByText('Richard Jones').parent;
    expect(StyleSheet.flatten(selectedItem?.props.style).backgroundColor).toBe(colors.surfaceRaised);
  });

  it('does not highlight the other characters in the list', async () => {
    await setup(true);

    await openSelector();

    const otherItem = screen.getByText('Jeanne').parent;
    expect(StyleSheet.flatten(otherItem?.props.style).backgroundColor).toBe(colors.surface);
  });

  it('selects a character from the list and closes it', async () => {
    await setup(true);

    await openSelector();
    await fireEvent.press(screen.getByText('Jeanne'));

    expect(onSelect).toHaveBeenCalledWith(jeanne);
    expect(screen.queryByText('Jeanne')).toBeNull();
  });
});
