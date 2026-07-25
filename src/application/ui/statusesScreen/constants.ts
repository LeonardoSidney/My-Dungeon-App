import { Status } from '@domain/entities';

export interface StatusPanelProps {
    statuses: Status[];
    onEdit: (status: Status) => void;
    onDelete: (status: Status) => Promise<void>;
}

export type StatusFormData = {
    id: string;
    name: string;
    activationWord: string;
    prompt: string;
    observation: string;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
};
