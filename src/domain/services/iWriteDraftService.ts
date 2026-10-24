import { Draft } from '@domain/entities';

export interface IWriteDraftService {
  write (params: WriteDraftServiceParams): Draft;
}

export type WriteDraftServiceParams = {
  draftId: string;
  content: string;
  existing?: Draft;
};
