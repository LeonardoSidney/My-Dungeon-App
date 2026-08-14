import { LlamaCppOAGateway } from '../http/llama-cpp';
import { Logger } from '../logger';
import { UUIDGenerator } from '../providers';
import { MobileStorage } from '../storage';
import { ReactNativeStreamProvider, WebStreamProvider } from '@infra/providers/http/stream';
import { Platform } from 'react-native';
import { IStreamProvider } from '@domain/providers';

export const logger = new Logger();
export const idGenerate = new UUIDGenerator();
export const storage = new MobileStorage(logger);

export function getStreamProvider (): IStreamProvider {
    if (Platform.OS === 'web') {
        return new WebStreamProvider(logger);
    }

    return new ReactNativeStreamProvider(logger);
}

export function createLlamaCppOAGateway (): LlamaCppOAGateway {
    return new LlamaCppOAGateway(logger, getStreamProvider());
}
