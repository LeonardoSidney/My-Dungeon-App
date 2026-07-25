import { World } from '@domain/entities';

export interface WorldPanelProps {
    worlds: World[];
    onEdit: (world: World) => void;
    onDelete: (world: World) => void;
}
