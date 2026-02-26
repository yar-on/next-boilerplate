import { logger, LogSeverityEnum } from '../logger/logger.utils';

describe('ClientLogger', () => {
    describe('log level routing', () => {
        it('routes error to console.error', async () => {
            const spy = jest.spyOn(console, 'error').mockImplementation();
            await logger.error({ message: 'test error' });

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0]?.[0]).toContain('[ERROR]');
            expect(spy.mock.calls[0]?.[1]).toBe('test error');
        });

        it('routes warn to console.warn', async () => {
            const spy = jest.spyOn(console, 'warn').mockImplementation();
            await logger.warn({ message: 'test warning' });

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0]?.[0]).toContain('[WARN]');
            expect(spy.mock.calls[0]?.[1]).toBe('test warning');
        });

        it('routes info to console.info', async () => {
            const spy = jest.spyOn(console, 'info').mockImplementation();
            await logger.info({ message: 'test info' });

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0]?.[0]).toContain('[INFO]');
            expect(spy.mock.calls[0]?.[1]).toBe('test info');
        });

        it('routes debug to console.debug', async () => {
            const spy = jest.spyOn(console, 'debug').mockImplementation();
            await logger.debug({ message: 'test debug' });

            expect(spy).toHaveBeenCalledTimes(1);
            expect(spy.mock.calls[0]?.[0]).toContain('[DEBUG]');
            expect(spy.mock.calls[0]?.[1]).toBe('test debug');
        });
    });

    describe('output format', () => {
        it('formats prefix as [timestamp] [LEVEL] [severity]', async () => {
            const spy = jest.spyOn(console, 'info').mockImplementation();
            await logger.info({ message: 'hello', severity: LogSeverityEnum.HIGH });

            const prefix = spy.mock.calls[0]?.[0] as string;
            expect(prefix).toMatch(/^\[.+\] \[INFO\] \[high\]$/);
        });

        it('defaults severity to NONE', async () => {
            const spy = jest.spyOn(console, 'info').mockImplementation();
            await logger.info({ message: 'hello' });

            const prefix = spy.mock.calls[0]?.[0] as string;
            expect(prefix).toContain('[none]');
        });

        it('includes context when provided', async () => {
            const spy = jest.spyOn(console, 'info').mockImplementation();
            const ctx = { userId: '123' };
            await logger.info({ message: 'hello', context: ctx });

            expect(spy.mock.calls[0]?.[2]).toEqual(ctx);
        });

        it('does not include context arg when not provided', async () => {
            const spy = jest.spyOn(console, 'info').mockImplementation();
            await logger.info({ message: 'hello' });

            // Only prefix + message
            expect(spy.mock.calls[0]).toHaveLength(2);
        });
    });

    describe('error serialization', () => {
        it('serializes Error instances with name, message, and stack', async () => {
            const spy = jest.spyOn(console, 'error').mockImplementation();
            const err = new Error('something broke');
            await logger.error({ message: 'fail', error: err });

            const serialized = spy.mock.calls[0]?.[2] as { name: string; message: string; stack?: string };
            expect(serialized.name).toBe('Error');
            expect(serialized.message).toBe('something broke');
            expect(serialized.stack).toBeDefined();
        });

        it('serializes string errors', async () => {
            const spy = jest.spyOn(console, 'error').mockImplementation();
            await logger.error({ message: 'fail', error: 'raw string error' });

            const serialized = spy.mock.calls[0]?.[2] as { name: string; message: string };
            expect(serialized.name).toBe('Error');
            expect(serialized.message).toBe('raw string error');
        });

        it('serializes unknown error types', async () => {
            const spy = jest.spyOn(console, 'error').mockImplementation();
            await logger.error({ message: 'fail', error: 42 });

            const serialized = spy.mock.calls[0]?.[2] as { name: string; message: string };
            expect(serialized.name).toBe('UnknownError');
            expect(serialized.message).toBe('42');
        });
    });

    describe('debug in production', () => {
        const originalEnv = process.env.NODE_ENV;

        afterEach(() => {
            Object.defineProperty(process.env, 'NODE_ENV', { value: originalEnv, writable: true });
        });

        it('suppresses debug output in production', async () => {
            Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });
            const spy = jest.spyOn(console, 'debug').mockImplementation();

            await logger.debug({ message: 'should not appear' });
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
