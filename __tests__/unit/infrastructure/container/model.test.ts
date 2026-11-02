import { GetModelsController, GetModelsFromProviderController, GetModelTemplateController } from '@adapters/controllers';
import { getModelsController, getModelsFromProviderController, getModelTemplateController } from '@infra/container/model';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('model container', () => {
    it('getModelsFromProviderController builds its controller', () => {
        expect(getModelsFromProviderController()).toBeInstanceOf(GetModelsFromProviderController);
    });

    it('getModelTemplateController builds its controller', () => {
        expect(getModelTemplateController()).toBeInstanceOf(GetModelTemplateController);
    });

    it('getModelsController builds its controller', () => {
        expect(getModelsController()).toBeInstanceOf(GetModelsController);
    });
});
