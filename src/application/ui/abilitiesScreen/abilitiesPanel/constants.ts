import { Ability } from '@domain/entities';

export interface AbilityPanelProps {
    abilities: Ability[];
    onEdit: (ability: Ability) => void;
    onDelete: (ability: Ability) => Promise<void>;
}
