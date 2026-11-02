import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { DeleteButton } from '@presentation/components';
import { ControllersProvider } from '@presentation/providers/ControllersProvider';
import type { AppControllers } from '@presentation/providers/appControllers';
import { AlertActionStyleEnum, AlertUseCaseParams } from '@domain/use-cases';

jest.mock('lucide-react-native', () => ({
  Pencil: () => null,
  Trash2: () => null,
}));

const handle = jest.fn<void, [AlertUseCaseParams]>();
const controllers = { alert: { handle } } as unknown as AppControllers;
const onConfirm = jest.fn();

const setup = (props: Partial<React.ComponentProps<typeof DeleteButton>> = {}) =>
  render(
    <ControllersProvider controllers={controllers}>
      <DeleteButton itemName="Aria" onConfirm={onConfirm} {...props} />
    </ControllersProvider>,
  );

const confirm = () => handle.mock.calls[0][0].actions?.find(action => action.style === AlertActionStyleEnum.DESTRUCTIVE)?.onPress?.();

describe('DeleteButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a trash icon button by default', async () => {
    await setup();

    expect(screen.getByLabelText('Delete')).toBeDefined();
  });

  it('asks for confirmation instead of deleting right away', async () => {
    await setup();

    fireEvent.press(screen.getByLabelText('Delete'));

    expect(handle.mock.calls[0][0].title).toBe('Delete Aria?');
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('deletes after the confirmation', async () => {
    await setup();

    fireEvent.press(screen.getByLabelText('Delete'));
    confirm();

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('renders a text button when it has a label', async () => {
    await setup({ label: 'Erase All Adventures' });

    expect(screen.getByText('Erase All Adventures')).toBeDefined();
    expect(screen.queryByLabelText('Delete')).toBeNull();
  });

  it('confirms with the custom message on the text button', async () => {
    await setup({ label: 'Erase All Adventures', itemName: 'all adventures', message: 'Everything goes away' });

    fireEvent.press(screen.getByText('Erase All Adventures'));

    expect(handle.mock.calls[0][0].title).toBe('Delete all adventures?');
    expect(handle.mock.calls[0][0].message).toBe('Everything goes away');
  });

  it('does not ask for confirmation while disabled', async () => {
    await setup({ label: 'Erasing...', disabled: true });

    fireEvent.press(screen.getByText('Erasing...'));

    expect(handle).not.toHaveBeenCalled();
  });
});
