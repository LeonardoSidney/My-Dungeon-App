import { buildControllers } from '@composition/controllers';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('buildControllers', () => {
    it('builds every app controller with a handle method', () => {
        const controllers = buildControllers();
        const entries = Object.entries(controllers);

        expect(entries.length).toBeGreaterThan(0);
        for (const [name, controller] of entries) {
            expect([name, typeof (controller as { handle?: unknown; }).handle]).toEqual([name, 'function']);
        }
    });
});
