import { NativeStreamCompletionController } from '@adapters/controllers';
import { StreamCompletionController } from '@adapters/controllers';
import { NativeStreamCompletionUseCase } from '../../application/use-cases';
import { StreamCompletionUseCase } from '../../application/use-cases';
import { INativeStreamCompletionController } from '@domain/controllers';
import { IStreamCompletionController } from '@domain/controllers';
import { logger, getStreamProvider } from './shared';
import { LlamaCppOAGateway, LlamaCppNativeGateway } from '../http/llama-cpp';

export function getStreamCompletionController (): IStreamCompletionController {
    const llamaCppOAGateway = new LlamaCppOAGateway(logger, getStreamProvider());
    const useCase = new StreamCompletionUseCase(logger, llamaCppOAGateway);
    return new StreamCompletionController(logger, useCase);
}

export function getNativeStreamCompletionController (): INativeStreamCompletionController {
    const llamaCppNativeGateway = new LlamaCppNativeGateway(logger, getStreamProvider());
    const useCase = new NativeStreamCompletionUseCase(logger, llamaCppNativeGateway);
    return new NativeStreamCompletionController(logger, useCase);
}
