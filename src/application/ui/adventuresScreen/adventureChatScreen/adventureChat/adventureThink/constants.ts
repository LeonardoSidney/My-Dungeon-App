import { Think } from '@domain/entities';

export interface AdventureThinkProps {
  chatId: string;
  think: Think | null | undefined;
  isStreaming: boolean;
  thinkLength: number;
  thinkIndex: number;
  onNavigateThinkIndex?: (chatId: string, direction: -1 | 1) => void;
  onRegenerateFromThink?: (chatId: string) => void;
  onEditThink?: (chatId: string) => void;
  onSaveThinkEdit?: (chatId: string, content: string) => void;
  onDiscardThinkEdit?: () => void;
  onDeleteThink?: (chatId: string) => void;
  isThinkEditing?: boolean;
  editingThinkChatId?: string | null;
}
