import { IStreamSessionRegistry } from '@domain/providers';

export class StreamSessionRegistry implements IStreamSessionRegistry {
    private active = new Map<string, () => void>();

    start (key: string, abort: () => void): boolean {
        if (this.active.has(key)) {
            return false;
        }

        this.active.set(key, abort);
        return true;
    }

    stop (key: string): boolean {
        const abort = this.active.get(key);
        if (!abort) {
            return false;
        }

        abort();
        return true;
    }

    isActive (key: string): boolean {
        return this.active.has(key);
    }

    release (key: string): void {
        this.active.delete(key);
    }
}
