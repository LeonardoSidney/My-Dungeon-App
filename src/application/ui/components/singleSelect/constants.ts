export type SelectItem = {
  id: string;
  name: string;
};

export type SingleSelectProps<T extends { id: string; }> = {
  items: T[];
  selectedId?: string;
  /**
   * Derives the unique key of each option. When the selection of an item
   * depends on more than the id (e.g., Model is selected by id + connectionId),
   * use the composite-key variant and the same `id` for the item as the
   * composite key to highlight the correct option.
   */
  itemKey?: (item: T) => string;
  /** Custom label for the option. Defaults to item.name. */
  renderLabel?: (item: T) => string;
  /** Applies the error border (e.g., form validation). */
  hasError?: boolean;
  /** Message displayed when there are no items. */
  emptyMessage?: string;
  onSelect: (item: T) => void;
};
