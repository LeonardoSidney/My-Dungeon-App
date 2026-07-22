import { Character } from '@domain/entities';

export type CharacterPanelProps = {
  characters: Character[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (character: Character) => void;
  onDelete: (characterId: string) => void;
};
