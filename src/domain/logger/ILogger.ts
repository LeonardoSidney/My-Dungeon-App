export interface ILogger {
    debug(message: string, ...args: unknown[]): void;
    storage(message: string, ...args: unknown[]): void;
    streaming(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warning(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
    log(message: string, ...args: unknown[]): void;
}

export type LogLevel = LogLevelEnum.DEBUG | LogLevelEnum.INFO | LogLevelEnum.WARN | LogLevelEnum.ERROR | LogLevelEnum.LOG;

export enum LogLevelEnum {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
    LOG = 'log'
}

export const LOG_LEVEL_SEVERITY: Record<LogLevel, number> = {
    [LogLevelEnum.DEBUG]: 0,
    [LogLevelEnum.INFO]: 1,
    [LogLevelEnum.WARN]: 2,
    [LogLevelEnum.ERROR]: 3,
    [LogLevelEnum.LOG]: 4,
};

export const DEVELOPMENT_LOG_LEVEL: LogLevel = LogLevelEnum.DEBUG;

export const RELEASE_LOG_LEVEL: LogLevel = LogLevelEnum.WARN;

export type LoggerChannels = {
    storage?: boolean;
    streaming?: boolean;
};

export const SENSITIVE_LOG_KEYS = ['auth', 'authorization'];

export const MASKED_LOG_VALUE = '***';
