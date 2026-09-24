import { Logger } from '../logger';
import { MD5Provider, UUIDGenerator } from '../providers';
import { MobileStorage } from '../storage';
import { ReactNativeStreamProvider, WebStreamProvider, SseLineParser } from '@infra/providers/http/stream';
import { Platform } from 'react-native';
import { IStreamProvider, ISseLineParser } from '@domain/providers';

export const logger = new Logger();
export const idGenerate = new UUIDGenerator();
export const hashProvider = new MD5Provider();
export const storage = new MobileStorage(logger);

export function createSseLineParser (): ISseLineParser {
    return new SseLineParser(logger);
}

export function getStreamProvider (): IStreamProvider {
    if (Platform.OS === 'web') {
        return new WebStreamProvider(logger, createSseLineParser());
    }

    return new ReactNativeStreamProvider(logger, createSseLineParser());
}
