import * as factories from '@infra/container/repository';
import * as repositories from '@infra/repository';
import { ILogger } from '@domain/logger';
import { IStorage } from '@domain/storage';

const logger = {} as ILogger;
const storage = {} as IStorage;

const CASES = Object.keys(factories).map(factory => ({
    factory: factory as keyof typeof factories,
    repository: factory.replace(/^create/, '') as keyof typeof repositories
}));

describe('repository factories', () => {
    it.each(CASES)('$factory builds a $repository', ({ factory, repository }) => {
        expect(factories[factory](storage, logger)).toBeInstanceOf(repositories[repository]);
    });
});
