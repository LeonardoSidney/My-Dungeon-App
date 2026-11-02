import { Adventure, MissingReference, MissingReferenceKind, MissingReferenceOwner } from '../entities';

export interface IFindAdventureMissingReferencesService {
    find (params: FindAdventureMissingReferencesParams): Promise<FindAdventureMissingReferencesResponse>;
}

export type FindAdventureMissingReferencesParams = {
    adventure: Adventure;
};

export type FindAdventureMissingReferencesResponse = {
    success: boolean;
    missingReferences?: MissingReference[];
    error?: string;
};

export type ReferenceLookup = {
    success: boolean;
    exists?: boolean;
    error?: string;
};

export type ReferenceOwner = Pick<MissingReference, 'owner' | 'ownerName'>;

export type ReferenceCheck = {
    owner: MissingReferenceOwner;
    ownerName: string;
    kind: MissingReferenceKind;
    ids: string[];
    lookup: (id: string) => Promise<ReferenceLookup>;
};
