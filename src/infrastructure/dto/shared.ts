export function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

export function parseDate(value: unknown): Date | null {
    if (value instanceof Date) {
        return value;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed;
        }
    }

    return null;
}

export function isArrayRecord(value: unknown): value is Record<string, unknown>[] {
    return Array.isArray(value) && value.every((item) => isRecord(item));
}

export function isInEnum<T extends Record<string, string | number>>(enumObj: T, value: string | number): value is T[keyof T] {
    return Object.values(enumObj).includes(value);
}
