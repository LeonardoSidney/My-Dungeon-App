import { SelectItemBase } from '../selectList/constants';

export interface SelectListSectionProps<T extends SelectItemBase> {
    label: string;
    items: T[];
    selectedItems: T[];
    onToggle: (item: T) => void;
    emptyText?: string;
    visibleSelectedItems?: T[];
}
