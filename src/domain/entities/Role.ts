
export enum RoleEnum {
    USER = 'user',
    ASSISTANT = 'assistant',
    AI_PERSONA = 'ai_persona',
    SYSTEM = 'system'
}

export type Role = RoleEnum.USER | RoleEnum.ASSISTANT | RoleEnum.AI_PERSONA | RoleEnum.SYSTEM;
