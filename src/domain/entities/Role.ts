
export enum RoleEnum {
    USER = 'user',
    ASSISTANT = 'assistant',
    SYSTEM = 'system'
}

export type Role = RoleEnum.USER | RoleEnum.ASSISTANT | RoleEnum.SYSTEM;
