import { Platform } from 'react-native';
import { chatReplyBus, createSseLineParser, draftBus, getStreamProvider, logger, streamingLogger } from '@infra/container/shared';
import { ILogger } from '@domain/logger';
import { ChatReplyStatusEnum, DraftStatusEnum } from '@domain/providers';
import { ReactNativeStreamProvider, SseLineParser, WebStreamProvider } from '@infra/providers/http/stream';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const globals = globalThis as typeof globalThis & { __DEV__: boolean; __STORAGE__?: boolean; __STREAMING__?: boolean; };

function loadReleaseLogger (): ILogger {
    const developmentFlag = globals.__DEV__;
    globals.__DEV__ = false;

    let releaseLogger: ILogger | undefined;
    jest.isolateModules(() => {
        releaseLogger = require('@infra/container/shared').logger;
    });

    globals.__DEV__ = developmentFlag;
    return releaseLogger as ILogger;
}

function loadStorageLogger (): ILogger {
    globals.__STORAGE__ = true;

    let storageLogger: ILogger | undefined;
    jest.isolateModules(() => {
        storageLogger = require('@infra/container/shared').logger;
    });

    delete globals.__STORAGE__;
    return storageLogger as ILogger;
}

function loadStreamingContainer (): { logger: ILogger; streamingLogger: ILogger; } {
    globals.__STREAMING__ = true;

    let container: { logger: ILogger; streamingLogger: ILogger; } | undefined;
    jest.isolateModules(() => {
        container = require('@infra/container/shared');
    });

    delete globals.__STREAMING__;
    return container as { logger: ILogger; streamingLogger: ILogger; };
}

describe('container shared', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('logs debug messages in development builds', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);

        logger.debug('prompt built');

        expect(info).toHaveBeenCalledWith('[DEBUG] prompt built');
    });

    it('only logs warnings and errors in release builds', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
        const releaseLogger = loadReleaseLogger();

        releaseLogger.debug('prompt built');
        releaseLogger.info('reply generated');
        releaseLogger.warning('server is slow');

        expect(info).not.toHaveBeenCalledWith('[DEBUG] prompt built');
        expect(info).not.toHaveBeenCalledWith('[INFO] reply generated');
        expect(info).toHaveBeenCalledWith('[WARN] server is slow');
    });

    it('does not log storage messages without the storage global', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);

        logger.storage('stored data');

        expect(info).not.toHaveBeenCalled();
    });

    it('logs storage messages when the storage global is true', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
        const storageLogger = loadStorageLogger();

        storageLogger.storage('stored data');

        expect(info).toHaveBeenCalledWith('[STORAGE] stored data');
    });

    it('does not log streaming messages without the streaming global', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);

        logger.streaming('token saved');

        expect(info).not.toHaveBeenCalled();
    });

    it('logs streaming messages when the streaming global is true', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
        const container = loadStreamingContainer();

        container.logger.streaming('token saved');

        expect(info).toHaveBeenCalledWith('[STREAMING] token saved');
    });

    it('hides the info messages of the streaming path without the streaming global', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);

        streamingLogger.info('Executing AdventureRepository::getAdventures');
        streamingLogger.debug('Executing MobileStorage::load - name');

        expect(info).not.toHaveBeenCalled();
    });

    it('shows the info messages of the streaming path as streaming messages when the streaming global is true', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
        const container = loadStreamingContainer();

        container.streamingLogger.info('Executing AdventureRepository::getAdventures');

        expect(info).toHaveBeenCalledWith('[STREAMING] Executing AdventureRepository::getAdventures');
    });

    it('keeps the warnings of the streaming path visible without the streaming global', () => {
        const info = jest.spyOn(console, 'info').mockImplementation(() => undefined);

        streamingLogger.warning('failed to load adventure');

        expect(info).toHaveBeenCalledWith('[WARN] failed to load adventure');
    });

    it('creates a new SSE line parser on each call', () => {
        const parser = createSseLineParser();

        expect(parser).toBeInstanceOf(SseLineParser);
        expect(createSseLineParser()).not.toBe(parser);
    });

    it('streams with XMLHttpRequest on native platforms', () => {
        jest.replaceProperty(Platform, 'OS', 'android');

        expect(getStreamProvider()).toBeInstanceOf(ReactNativeStreamProvider);
    });

    it('streams with fetch on the web', () => {
        jest.replaceProperty(Platform, 'OS', 'web');

        expect(getStreamProvider()).toBeInstanceOf(WebStreamProvider);
    });

    it('routes chat reply events by adventure id', () => {
        const listener = jest.fn();
        const other = jest.fn();
        const unsubscribe = chatReplyBus.subscribe('adventure-1', listener);
        const unsubscribeOther = chatReplyBus.subscribe('adventure-2', other);

        chatReplyBus.publish({ adventureId: 'adventure-1', chatId: 'chat-1', status: ChatReplyStatusEnum.STREAMING });
        unsubscribe();
        unsubscribeOther();

        expect(listener).toHaveBeenCalledTimes(1);
        expect(other).not.toHaveBeenCalled();
    });

    it('routes draft events by draft id', () => {
        const listener = jest.fn();
        const other = jest.fn();
        const unsubscribe = draftBus.subscribe('home', listener);
        const unsubscribeOther = draftBus.subscribe('other', other);

        draftBus.publish({ draftId: 'home', status: DraftStatusEnum.IDLE });
        unsubscribe();
        unsubscribeOther();

        expect(listener).toHaveBeenCalledTimes(1);
        expect(other).not.toHaveBeenCalled();
    });
});
