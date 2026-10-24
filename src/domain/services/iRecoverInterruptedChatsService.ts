import { Adventure } from '@domain/entities';

export interface IRecoverInterruptedChatsService {
  recover (params: RecoverInterruptedChatsServiceParams): RecoverInterruptedChatsServiceReturn;
}

export type RecoverInterruptedChatsServiceParams = {
  adventure: Adventure;
};

export type RecoverInterruptedChatsServiceReturn = {
  success: boolean;
  adventure?: Adventure;
  recoveredChatIds?: string[];
  error?: string;
};

export type RepairInterruptedChatReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};
