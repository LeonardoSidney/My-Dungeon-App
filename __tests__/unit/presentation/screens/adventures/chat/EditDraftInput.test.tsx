import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { EditDraftInput } from '@presentation/screens/adventures/chat/components/editDraftInput';
import { colors } from '@presentation/theme';

describe('EditDraftInput', () => {
  it('shows the cursor while editing', async () => {
    await render(<EditDraftInput value="draft" onChangeText={jest.fn()} />);

    expect(screen.getByDisplayValue('draft').props.cursorColor).toBe(colors.text);
  });

  it('shows the selected text while editing', async () => {
    await render(<EditDraftInput value="draft" onChangeText={jest.fn()} />);

    expect(screen.getByDisplayValue('draft').props.selectionColor).toBe(colors.primary);
  });
});
