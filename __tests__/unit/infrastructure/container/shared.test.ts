import { Platform } from 'react-native';
import { chatReplyBus, createSseLineParser, draftBus, getStreamProvider, logger } from '@infra/container/shared';
import { ILogger } from '@domain/logger';
import { ChatReplyStatusEnum, DraftStatusEnum } from '@domain/providers';
import { ReactNativeStreamProvider, SseLineParser, WebStreamProvider } from '@infra/providers/http/stream';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const globals = globalThis as typeof globalThis & { __DEV__: boolean };

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
