export enum LogLevelEnum {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export enum LogSeverityEnum {
    URGENT = 'urgent',
    HIGH = 'high',
    MEDIUM = 'medium',
    LOW = 'low',
    NONE = 'none',
}

export type LogParamsType = {
    message: string;
    severity?: LogSeverityEnum;
    error?: unknown;
    context?: Record<string, unknown>;
};

export type LogEntryType = {
    timestamp: string;
    level: LogLevelEnum;
    severity: LogSeverityEnum;
    message: string;
    environment: 'server' | 'client';
    context?: Record<string, unknown>;
    error?: { name: string; message: string; stack?: string };
};

export abstract class BaseLogger {
    protected abstract readonly environment: 'server' | 'client';
    protected abstract output(entry: LogEntryType): Promise<void> | void;

    protected serializeError(error: unknown): { name: string; message: string; stack?: string } {
        if (error instanceof Error) {
            const serialized: { name: string; message: string; stack?: string } = {
                name: error.name,
                message: error.message,
            };

            if (error.stack) {
                serialized.stack = error.stack;
            }

            return serialized;
        }

        if (typeof error === 'string') {
            return { name: 'Error', message: error };
        }

        return { name: 'UnknownError', message: String(error) };
    }

    protected buildEntry(level: LogLevelEnum, params: LogParamsType): LogEntryType {
        const entry: LogEntryType = {
            timestamp: new Date().toISOString(),
            level,
            severity: params.severity ?? LogSeverityEnum.NONE,
            message: params.message,
            environment: this.environment,
        };

        if (params.context) {
            entry.context = params.context;
        }

        if (params.error !== undefined) {
            entry.error = this.serializeError(params.error);
        }

        return entry;
    }

    async info(params: LogParamsType): Promise<void> {
        const entry = this.buildEntry(LogLevelEnum.INFO, params);
        await this.output(entry);
    }

    async warn(params: LogParamsType): Promise<void> {
        const entry = this.buildEntry(LogLevelEnum.WARN, params);
        await this.output(entry);
    }

    async error(params: LogParamsType): Promise<void> {
        const entry = this.buildEntry(LogLevelEnum.ERROR, params);
        await this.output(entry);
    }

    async debug(params: LogParamsType): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            return;
        }

        const entry = this.buildEntry(LogLevelEnum.DEBUG, params);
        await this.output(entry);
    }
}
