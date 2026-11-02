export interface IValidateUniqueIdsService {
    validate (params: ValidateUniqueIdsServiceParams): ValidateUniqueIdsServiceReturn;
}

export type UniqueIdList = {
    collection: string;
    ids?: string[];
};

export type ValidateUniqueIdsServiceParams = {
    idLists: UniqueIdList[];
};

export type ValidateUniqueIdsServiceReturn = {
    success: boolean;
    error?: string;
};
