import { Adventure } from '@domain/entities';

export interface AdventuresPanelProps {
    adventures: Adventure[];
    onEdit: (adventure: Adventure) => void;
    onDelete: (adventure: Adventure) => Promise<void>;
    onChat: (adventure: Adventure) => void;
}
