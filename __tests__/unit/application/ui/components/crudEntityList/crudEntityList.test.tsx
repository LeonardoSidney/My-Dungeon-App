import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { CrudEntityList } from '@application/ui/components/crudEntityList';
import type { CrudEntityListProps, CrudEntityListItem } from '@application/ui/components/crudEntityList';

jest.mock('lucide-react-native', () => ({
  Pencil: () => null,
  Trash2: () => null,
}));

type WorldItem = CrudEntityListItem & {
  activationWord: string;
};

const items: WorldItem[] = [
  { id: '1', name: 'Arendale', activationWord: 'Frost' },
  { id: '2', name: 'Kathmandu', activationWord: 'Fire' },
];

const onAdd = jest.fn();
const onEdit = jest.fn();
const onDelete = jest.fn();

const setup = (props: Partial<CrudEntityListProps<WorldItem>> = {}) =>
  render(
    <CrudEntityList
      items={items}
      emptyText="No worlds found."
      addLabel="Add World"
      onAdd={onAdd}
      onEdit={onEdit}
      onDelete={onDelete}
      {...props}
    />,
  );

function CustomAction (params: { onPress: () => void; }) {
  return (
    <TouchableOpacity accessibilityLabel="Custom" onPress={params.onPress}>
      <Text>custom action</Text>
    </TouchableOpacity>
  );
}

describe('CrudEntityList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('states', () => {
    it('renders item names and add button', async () => {
      await setup();

      expect(screen.getByText('Arendale')).toBeDefined();
      expect(screen.getByText('Kathmandu')).toBeDefined();
      expect(screen.getByText('Add World')).toBeDefined();
    });

    it('renders detail text when getDetailText is provided', async () => {
      await setup({ getDetailText: (item) => item.activationWord });

      expect(screen.getByText('Frost')).toBeDefined();
      expect(screen.getByText('Fire')).toBeDefined();
    });

    it('renders empty text when there are no items', async () => {
      await setup({ items: [] });

      expect(screen.getByText('No worlds found.')).toBeDefined();
    });

    it('renders loading state', async () => {
      await setup({ isLoading: true });

      expect(screen.getByText('Loading...')).toBeDefined();
    });

    it('renders error message', async () => {
      await setup({ isError: true, errorMessage: 'Failed to load worlds.' });

      expect(screen.getByText('Failed to load worlds.')).toBeDefined();
    });
  });

  describe('actions', () => {
    it('calls onAdd when the add button is pressed', async () => {
      await setup();

      fireEvent.press(screen.getByText('Add World'));

      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it('calls onEdit with the item when the edit button is pressed', async () => {
      await setup();

      fireEvent.press(screen.getAllByLabelText('Edit')[0]);

      expect(onEdit).toHaveBeenCalledTimes(1);
      expect(onEdit).toHaveBeenCalledWith(items[0]);
    });

    it('calls onDelete with the item when the delete button is pressed', async () => {
      await setup();

      fireEvent.press(screen.getAllByLabelText('Delete')[0]);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(items[0]);
    });

    it('uses custom actions when renderActions is provided', async () => {
      const customOnPress = jest.fn();
      await setup({
        renderActions: () => <CustomAction onPress={customOnPress} />,
      });

      expect(screen.queryByLabelText('Edit')).toBeNull();
      expect(screen.queryByLabelText('Delete')).toBeNull();

      fireEvent.press(screen.getAllByLabelText('Custom')[0]);

      expect(customOnPress).toHaveBeenCalledTimes(1);
      expect(onEdit).not.toHaveBeenCalled();
      expect(onDelete).not.toHaveBeenCalled();
    });
  });
});
