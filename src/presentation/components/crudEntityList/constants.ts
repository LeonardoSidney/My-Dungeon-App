import type { ReactNode } from 'react';

export type CrudEntityListItem = {
    id: string;
    name: string;
};

export type CrudEntityListProps<T extends CrudEntityListItem> = {
    items: T[];
    isLoading?: boolean;
    isError?: boolean;
    errorMessage?: string;
    emptyText: string;
    addLabel: string;
    onAdd: () => void;
    onEdit: (item: T) => void;
    onDelete: (item: T) => void;
    getDetailText?: (item: T) => string;
    detailLines?: number;
    isFormOpen?: boolean;
    renderActions?: (item: T) => ReactNode;
    renderForm?: () => ReactNode;
};
