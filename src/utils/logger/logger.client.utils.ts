import { BaseLogger, LogLevelEnum, type LogEntryType } from './logger.types';

export { LogLevelEnum, LogSeverityEnum, type LogParamsType, type LogEntryType } from './logger.types';

class ClientLogger extends BaseLogger {
    protected readonly environment = 'client' as const;

    protected output(entry: LogEntryType): void {
        const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.severity}]`;
        const args: unknown[] = [prefix, entry.message];

        if (entry.context) {
            args.push(entry.context);
        }

        if (entry.error) {
            args.push(entry.error);
        }

        switch (entry.level) {
            case LogLevelEnum.ERROR:
                console.error(...args);
                break;
            case LogLevelEnum.WARN:
                console.warn(...args);
                break;
            case LogLevelEnum.INFO:
                console.info(...args);
                break;
            case LogLevelEnum.DEBUG:
                // eslint-disable-next-line no-console
                console.debug(...args);
                break;
            default: {
                const _exhaustive: never = entry.level;
                void _exhaustive;
            }
        }
    }
}

export const logger = new ClientLogger();
