export type MultiSelectProps<T extends { id: string; name: string; }> = {
    items: T[];
    selectedItems: T[];
    /** Toggles the item in the selection (add when off, remove when on). */
    onToggle: (item: T) => void;
    /** Applies the error border (form validation). */
    hasError?: boolean;
    /**
     * When true, renders the removable tags of `selectedItems` below the
     * list (same pattern used by CharacterForm/AdventuresForm).
     */
    showTags?: boolean;
    /** Message displayed when there are no items. */
    emptyMessage?: string;
};
