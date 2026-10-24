import { CreateConnectionConfigController, EditConnectionController } from '@adapters/controllers';
import { ILogger } from '@domain/logger';

function buildLogger () {
    return {
        debug: jest.fn(),
        info: jest.fn(),
        warning: jest.fn(),
        error: jest.fn(),
        log: jest.fn()
    };
}

const useCase = { execute: jest.fn().mockResolvedValue({ success: true, id: 'c1' }) };

describe('connection controllers logging', () => {
    it('masks the auth secret when logging a create request', async () => {
        const logger = buildLogger();

        await new CreateConnectionConfigController(logger as unknown as ILogger, useCase as never).handle({ name: 'Local', ip: 'localhost', auth: 'secret' });

        expect(logger.debug).toHaveBeenCalledWith('CreateConnectionConfigController::handle - params', expect.objectContaining({ name: 'Local', auth: '***' }));
        expect(JSON.stringify(logger.debug.mock.calls)).not.toContain('secret');
    });

    it('masks the auth secret when logging an edit request', async () => {
        const logger = buildLogger();

        await new EditConnectionController(logger as unknown as ILogger, useCase as never).handle({ id: 'c1', editParams: { name: 'Local', ip: 'localhost', auth: 'secret' } });

        expect(JSON.stringify(logger.debug.mock.calls)).not.toContain('secret');
        expect(useCase.execute).toHaveBeenLastCalledWith(expect.objectContaining({ editParams: expect.objectContaining({ auth: 'secret' }) }));
    });
});
