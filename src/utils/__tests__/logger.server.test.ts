import { logger, LogSeverityEnum } from '../logger/logger.server.utils';

describe('ServerLogger', () => {
    describe('output routing', () => {
        it('writes ERROR entries to stderr', async () => {
            const spy = jest.spyOn(process.stderr, 'write').mockReturnValue(true);
            await logger.error({ message: 'server error' });

            expect(spy).toHaveBeenCalledTimes(1);
            const output = spy.mock.calls[0]?.[0] as string;
            const parsed = JSON.parse(output) as Record<string, unknown>;
            expect(parsed.level).toBe('ERROR');
            expect(parsed.message).toBe('server error');
        });

        it('writes INFO entries to stdout', async () => {
            const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
            await logger.info({ message: 'server info' });

            expect(spy).toHaveBeenCalledTimes(1);
            const output = spy.mock.calls[0]?.[0] as string;
            const parsed = JSON.parse(output) as Record<string, unknown>;
            expect(parsed.level).toBe('INFO');
        });

        it('writes WARN entries to stdout', async () => {
            const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
            await logger.warn({ message: 'server warn' });

            expect(spy).toHaveBeenCalledTimes(1);
            const output = spy.mock.calls[0]?.[0] as string;
            const parsed = JSON.parse(output) as Record<string, unknown>;
            expect(parsed.level).toBe('WARN');
        });

        it('writes DEBUG entries to stdout', async () => {
            const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
            await logger.debug({ message: 'server debug' });

            expect(spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('NDJSON format', () => {
        it('outputs valid JSON terminated with newline', async () => {
            const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
            await logger.info({ message: 'ndjson test' });

            const output = spy.mock.calls[0]?.[0] as string;
            expect(output.endsWith('\n')).toBe(true);
            expect(() => {
                JSON.parse(output);
            }).not.toThrow();
        });

        it('includes all LogEntryType fields', async () => {
            const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
            await logger.info({
                message: 'full entry',
                severity: LogSeverityEnum.MEDIUM,
                context: { key: 'value' },
                error: new Error('test'),
            });

            const output = spy.mock.calls[0]?.[0] as string;
            const parsed = JSON.parse(output) as Record<string, unknown>;

            expect(parsed.timestamp).toBeDefined();
            expect(parsed.level).toBe('INFO');
            expect(parsed.severity).toBe('medium');
            expect(parsed.message).toBe('full entry');
            expect(parsed.environment).toBe('server');
            expect(parsed.context).toEqual({ key: 'value' });
            expect(parsed.error).toEqual(
                expect.objectContaining({
                    name: 'Error',
                    message: 'test',
                })
            );
        });
    });

    describe('environment field', () => {
        it('sets environment to server', async () => {
            const spy = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
            await logger.info({ message: 'env check' });

            const output = spy.mock.calls[0]?.[0] as string;
            const parsed = JSON.parse(output) as Record<string, unknown>;
            expect(parsed.environment).toBe('server');
        });
    });
});
