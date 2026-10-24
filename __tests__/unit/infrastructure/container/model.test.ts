import { GetModelsController, GetModelsFromProviderController, GetModelTemplateController } from '@adapters/controllers';
import { getModelsController, getModelsFromProviderController, getModelTemplateController } from '@infra/container/model';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('model container', () => {
    it.each([
        ['getModelsFromProviderController', getModelsFromProviderController, GetModelsFromProviderController],
        ['getModelTemplateController', getModelTemplateController, GetModelTemplateController],
        ['getModelsController', getModelsController, GetModelsController]
    ])('%s builds its controller', (_, factory, Controller) => {
        expect(factory()).toBeInstanceOf(Controller);
    });
});
