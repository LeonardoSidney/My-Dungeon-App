import { CreateConnectionConfigController, EditConnectionController } from '@adapters/controllers';
import { Logger } from '@infra/logger';

const useCase = { execute: jest.fn().mockResolvedValue({ success: true, id: 'c1' }) };

describe('connection controllers logging', () => {
    let info: jest.SpyInstance;

    beforeEach(() => {
        info = jest.spyOn(console, 'info').mockImplementation(() => undefined);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('masks the auth secret when logging a create request', async () => {
        await new CreateConnectionConfigController(new Logger(), useCase as never).handle({ name: 'Local', ip: 'localhost', auth: 'secret' });

        expect(info).toHaveBeenCalledWith('[DEBUG] CreateConnectionConfigController::handle - params', '{"name":"Local","ip":"localhost","auth":"***"}');
        expect(JSON.stringify(info.mock.calls)).not.toContain('secret');
    });

    it('masks the auth secret when logging an edit request', async () => {
        await new EditConnectionController(new Logger(), useCase as never).handle({ id: 'c1', editParams: { name: 'Local', ip: 'localhost', auth: 'secret' } });

        expect(info).toHaveBeenCalledWith('[DEBUG] EditConnectionController::handle - params', '{"id":"c1","editParams":{"name":"Local","ip":"localhost","auth":"***"}}');
        expect(JSON.stringify(info.mock.calls)).not.toContain('secret');
    });

    it('still sends the real auth secret to the use case', async () => {
        await new EditConnectionController(new Logger(), useCase as never).handle({ id: 'c1', editParams: { name: 'Local', ip: 'localhost', auth: 'secret' } });

        expect(useCase.execute).toHaveBeenLastCalledWith(expect.objectContaining({ editParams: expect.objectContaining({ auth: 'secret' }) }));
    });
});
