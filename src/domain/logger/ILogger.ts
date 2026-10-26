export interface ILogger {
    debug(message: string, ...args: unknown[]): void;
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
