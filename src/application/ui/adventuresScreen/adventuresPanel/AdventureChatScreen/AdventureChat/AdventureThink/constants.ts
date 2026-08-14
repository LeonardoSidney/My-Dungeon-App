import { Think } from '@domain/entities';

export interface AdventureThinkProps {
  think: Think | null;
  streamingThink?: Think | null;
}
