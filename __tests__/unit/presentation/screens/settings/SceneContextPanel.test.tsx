import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { SceneContextPanel } from '@presentation/screens/settings/SceneContextPanel';

jest.mock('lucide-react-native', () => ({
  Pencil: () => null,
  Trash2: () => null,
}));

describe('SceneContextPanel', () => {
  it('summarizes the setting as on while collapsed', async () => {
    await render(<SceneContextPanel sceneContextEnabled onChange={jest.fn()} />);

    expect(screen.getByText('On')).toBeTruthy();
  });

  it('summarizes the setting as off while collapsed', async () => {
    await render(<SceneContextPanel sceneContextEnabled={false} onChange={jest.fn()} />);

    expect(screen.getByText('Off')).toBeTruthy();
  });

  it('hides the switch until the section is expanded', async () => {
    await render(<SceneContextPanel sceneContextEnabled onChange={jest.fn()} />);

    expect(screen.queryByLabelText('Write a scene summary')).toBeNull();
  });

  it('reports the new value when the switch changes', async () => {
    const onChange = jest.fn();
    await render(<SceneContextPanel sceneContextEnabled onChange={onChange} />);

    await fireEvent.press(screen.getByText('Scene Context'));
    await fireEvent(screen.getByLabelText('Write a scene summary'), 'valueChange', false);

    expect(onChange).toHaveBeenCalledWith(false);
  });
});
