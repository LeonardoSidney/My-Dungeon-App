export type SelectItemBase = {
  id: string;
  name: string;
};

export type SelectListProps<T extends SelectItemBase> = {
  items: T[];
  selectedItems: T[];
  onToggle: (item: T) => void;
};
