import { Chat, Role, RoleEnum, Think } from '@domain/entities';
import { isArrayRecord, isInEnum, isRecord } from './shared';
import { ThinkDTO } from './thinkDTO';

export class ChatDTO {
    constructor(
        private readonly id: string,
        private readonly role: Role,
        private readonly index: number,
        private readonly content: string[],
        private readonly think: Think[] | undefined
    ) { }

    toEntity(): Chat {
        return {
            id: this.id,
            role: this.role,
            index: this.index,
            content: this.content,
            think: this.think
        };
    }

    static fromStorage(data: unknown): ChatDTO | null {
        if (!isRecord(data)) {
            return null;
        }

        const role = this.toRole(data.role);
        const content = this.toContent(data.content);
        const think = this.toThink(data.think);

        if (
            typeof data.id !== 'string' ||
            !role ||
            typeof data.index !== 'number'
        ) {
            return null;
        }

        return new ChatDTO(
            data.id,
            role,
            data.index,
            content,
            think
        );
    }

    private static toRole(role: unknown): Role | undefined {
        if (typeof role !== 'string') {
            return undefined;
        }

        if (!isInEnum(RoleEnum, role)) {
            return undefined;
        }

        return role as Role;
    }

    private static toContent(content: unknown): string[] {
        if (!Array.isArray(content)) {
            return [];
        }

        return content.filter((item): item is string => typeof item === 'string');
    }

    private static toThink(think: unknown): Think[] | undefined {
        if (!isArrayRecord(think)) {
            return undefined;
        }

        const thoughtsDTO = think.map((item) => ThinkDTO.fromStorage(item));
        const validThoughts: Think[] = [];

        for (const thoughtDTO of thoughtsDTO) {
            if (thoughtDTO !== null) {
                validThoughts.push(thoughtDTO.toEntity());
            }
        }

        return validThoughts;
    }
}
