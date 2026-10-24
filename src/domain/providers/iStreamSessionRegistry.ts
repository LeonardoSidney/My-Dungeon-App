export interface IStreamSessionRegistry {
    start (key: string, abort: () => void): boolean;
    stop (key: string): boolean;
    isActive (key: string): boolean;
    release (key: string): void;
}
