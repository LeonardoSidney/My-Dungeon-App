export type CrudEntityListItem = {
    id: string;
    name: string;
};

export type CrudEntityListProps<T extends CrudEntityListItem> = {
    items: T[];
    emptyText: string;
    getDetailText?: (item: T) => string;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
};
