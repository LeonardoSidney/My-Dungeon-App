import { GetModelsFromProviderController } from '@adapters/controllers';
import { GetModelsFromProviderUseCase } from '../../application/use-cases';
import { IGetModelsFromProviderController } from '@domain/controllers';
import { logger, getStreamProvider } from './shared';
import { LlamaCppOAGateway } from '../http/llama-cpp';

export function getModelsFromProviderController (): IGetModelsFromProviderController {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const getModelsUseCase = new GetModelsFromProviderUseCase(logger, llamaCppOAGateway);
    return new GetModelsFromProviderController(logger, getModelsUseCase);
}
