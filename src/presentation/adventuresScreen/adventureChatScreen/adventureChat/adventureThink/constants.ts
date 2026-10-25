import { ChatThinkView } from '@domain/controllers';

export interface AdventureThinkProps {
  chatId: string;
  think: ChatThinkView;
  isStreaming: boolean;
  onNavigateThinkIndex?: (chatId: string, direction: -1 | 1) => void;
  onRegenerateFromThink?: (chatId: string) => void;
  onEditThink?: (chatId: string) => void;
  onSaveThinkEdit?: (chatId: string, content: string) => void;
  onDiscardThinkEdit?: () => void;
  onDeleteThink?: (chatId: string) => void;
  isThinkEditing?: boolean;
  editingThinkChatId?: string | null;
}
