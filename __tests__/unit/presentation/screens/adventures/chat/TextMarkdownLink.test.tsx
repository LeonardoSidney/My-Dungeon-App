import React from 'react';
import { Linking } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { TextMarkdown } from '@presentation/screens/adventures/chat/components/textMarkdown';
import { ControllersProvider } from '@presentation/providers/ControllersProvider';
import type { AppControllers } from '@presentation/providers/appControllers';
import { AlertActionStyleEnum, type AlertUseCaseParams } from '@domain/use-cases';

const handle = jest.fn();

async function setup (content: string) {
  const controllers = { alert: { handle } } as unknown as AppControllers;

  await render(
    <ControllersProvider controllers={controllers}>
      <TextMarkdown content={content} />
    </ControllersProvider>,
  );
}

function lastAlert (): AlertUseCaseParams {
  return handle.mock.calls[handle.mock.calls.length - 1][0];
}

describe('TextMarkdown links', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  });

  it('asks before leaving the app and shows where the link goes', async () => {
    await setup('[Continue the story](https://attacker.example/phish)');

    await fireEvent.press(screen.getByText('Continue the story'));

    expect(lastAlert()).toMatchObject({
      title: 'Open link?',
      message: 'This link leaves the app and opens attacker.example.',
      actions: [{ label: 'Cancel', style: AlertActionStyleEnum.CANCEL }, { label: 'Open' }],
    });
    expect(Linking.openURL).not.toHaveBeenCalled();
  });

  it('opens the link only after the player confirms', async () => {
    await setup('[Rules](https://example.com/rules)');

    await fireEvent.press(screen.getByText('Rules'));
    lastAlert().actions?.[1].onPress?.();

    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com/rules');
  });

  it('warns when the link cannot be opened', async () => {
    jest.spyOn(Linking, 'openURL').mockRejectedValue(new Error('No browser'));
    await setup('[Rules](https://example.com/rules)');

    await fireEvent.press(screen.getByText('Rules'));
    lastAlert().actions?.[1].onPress?.();

    await waitFor(() => expect(lastAlert()).toEqual({ title: 'Link', message: 'Could not open example.com.' }));
  });

  it('shows a link that is not a web link as plain text', async () => {
    await setup('[Call me](tel:+5511999999999)');

    expect(screen.getByText('Call me')).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
