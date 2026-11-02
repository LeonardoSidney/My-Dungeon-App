import { ICreateConnectionConfigController, IEditConnectionController } from '@domain/controllers';
import {
    ConnectionFormData,
    initialConnectionForm,
    submitConnection,
    validateConnectionForm
} from '@presentation/screens/settings/connectionForm';

const PORT_ERROR = 'Port must be a number between 1 and 65535';

function createForm (overrides?: Partial<ConnectionFormData>): ConnectionFormData {
    return {
        ...initialConnectionForm(),
        name: 'Desktop',
        ip: '192.168.0.10',
        port: '8080',
        ...overrides
    };
}

describe('validateConnectionForm', () => {
    it('accepts a valid port', () => {
        expect(validateConnectionForm(createForm()).port).toBeUndefined();
    });

    it('accepts the lowest port', () => {
        expect(validateConnectionForm(createForm({ port: '1' })).port).toBeUndefined();
    });

    it('accepts the highest port', () => {
        expect(validateConnectionForm(createForm({ port: '65535' })).port).toBeUndefined();
    });

    it('accepts a port surrounded by spaces', () => {
        expect(validateConnectionForm(createForm({ port: ' 8080 ' })).port).toBeUndefined();
    });

    it('requires a port', () => {
        expect(validateConnectionForm(createForm({ port: '  ' })).port).toBe('Port is required');
    });

    it('rejects port zero', () => {
        expect(validateConnectionForm(createForm({ port: '0' })).port).toBe(PORT_ERROR);
    });

    it('rejects a port above the highest one', () => {
        expect(validateConnectionForm(createForm({ port: '65536' })).port).toBe(PORT_ERROR);
    });

    it('rejects a negative port', () => {
        expect(validateConnectionForm(createForm({ port: '-1' })).port).toBe(PORT_ERROR);
    });

    it('rejects a port with letters at the end', () => {
        expect(validateConnectionForm(createForm({ port: '80abc' })).port).toBe(PORT_ERROR);
    });

    it('rejects a decimal port', () => {
        expect(validateConnectionForm(createForm({ port: '80.5' })).port).toBe(PORT_ERROR);
    });

    it('rejects a hexadecimal port', () => {
        expect(validateConnectionForm(createForm({ port: '0x50' })).port).toBe(PORT_ERROR);
    });

    it('rejects a port in scientific notation', () => {
        expect(validateConnectionForm(createForm({ port: '1e3' })).port).toBe(PORT_ERROR);
    });
});

describe('submitConnection', () => {
    it('sends the port as a number', async () => {
        const createConnection = { handle: jest.fn().mockResolvedValue({ success: true }) };
        const editConnection = { handle: jest.fn() };

        await submitConnection(
            createForm({ port: ' 8080 ' }),
            createConnection as unknown as ICreateConnectionConfigController,
            editConnection as unknown as IEditConnectionController
        );

        expect(createConnection.handle).toHaveBeenCalledWith(expect.objectContaining({ port: 8080 }));
    });
});
