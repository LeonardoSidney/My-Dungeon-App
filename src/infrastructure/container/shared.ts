import { Logger, StreamingLogger } from '../logger';
import { MD5Provider, UUIDGenerator } from '../providers';
import { MobileStorage } from '../storage';
import { ReactNativeStreamProvider, WebStreamProvider, SseLineParser } from '@infra/providers/http/stream';
import { BackgroundExecutionProvider } from '@infra/providers/backgroundExecution';
import { Platform } from 'react-native';
import { ChatReplyEvent, DraftEvent, IStreamProvider, ISseLineParser } from '@domain/providers';
import { DEVELOPMENT_LOG_LEVEL, RELEASE_LOG_LEVEL } from '@domain/logger';
import { KeyedEventBus, StreamSessionRegistry } from '@application/streaming';

const logLevel = __DEV__ ? DEVELOPMENT_LOG_LEVEL : RELEASE_LOG_LEVEL;
const isStorageLogEnabled = typeof __STORAGE__ !== 'undefined' && __STORAGE__;
const isStreamingLogEnabled = typeof __STREAMING__ !== 'undefined' && __STREAMING__;

export const logger = new Logger(logLevel, { storage: isStorageLogEnabled, streaming: isStreamingLogEnabled });
export const streamingLogger = new StreamingLogger(logger);
export const idGenerate = new UUIDGenerator();
export const hashProvider = new MD5Provider();
export const storage = new MobileStorage(logger);
export const streamingStorage = new MobileStorage(streamingLogger);
export const backgroundExecution = new BackgroundExecutionProvider(logger);
export const chatReplyBus = new KeyedEventBus<ChatReplyEvent>(logger, event => event.adventureId);
export const chatReplyRegistry = new StreamSessionRegistry(backgroundExecution);
export const draftBus = new KeyedEventBus<DraftEvent>(logger, event => event.draftId);
export const draftRegistry = new StreamSessionRegistry(backgroundExecution);

export function createSseLineParser (): ISseLineParser {
    return new SseLineParser(logger);
}

export function getStreamProvider (): IStreamProvider {
    if (Platform.OS === 'web') {
        return new WebStreamProvider(logger, createSseLineParser());
    }

    return new ReactNativeStreamProvider(logger, createSseLineParser());
}
