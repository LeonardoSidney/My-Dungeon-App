import { MAX_PORT, MIN_PORT } from '@domain/constants/general';

export function isValidPort (port: number): boolean {
    return Number.isInteger(port) && port >= MIN_PORT && port <= MAX_PORT;
}
