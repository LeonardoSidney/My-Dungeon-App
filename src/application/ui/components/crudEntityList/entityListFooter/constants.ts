import type { ReactNode } from 'react';

export type EntityListFooterProps = {
    addLabel: string;
    onAdd: () => void;
    form?: ReactNode;
};
