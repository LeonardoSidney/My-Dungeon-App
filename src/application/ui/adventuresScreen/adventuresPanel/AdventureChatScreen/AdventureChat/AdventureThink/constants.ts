import { Think } from '@domain/entities';

export interface AdventureThinkProps {
  think: Think | null | undefined;
  streamingThink?: Think | null | undefined;
}
