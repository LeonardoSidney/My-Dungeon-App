import type { ReactNode } from 'react';

export type EntityItemProps = {
    name: string;
    details?: string;
    detailLines?: number;
    actions: ReactNode;
};
