import { BaseLogger, LogLevelEnum, type LogEntryType } from './logger.types';

export { LogLevelEnum, LogSeverityEnum, type LogParamsType, type LogEntryType } from './logger.types';

class ServerLogger extends BaseLogger {
    protected readonly environment = 'server' as const;

    protected output(entry: LogEntryType): void {
        const line = JSON.stringify(entry) + '\n';

        if (entry.level === LogLevelEnum.ERROR) {
            process.stderr.write(line);
        } else {
            process.stdout.write(line);
        }
    }
}

export const logger = new ServerLogger();
