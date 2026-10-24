import {
    CreateSamplerController,
    GetSamplersController,
    EditSamplerController,
    EraseSamplerController,
    GetSamplerController,
} from '@adapters/controllers';
import {
    GetSamplerPresenter,
    GetSamplersPresenter,
} from '@adapters/presenters';
import { CreateSamplerService, EditSamplerService, GetSamplersService } from '@application/services';
import {
    CreateSamplerUseCase,
    GetSamplersUseCase,
    EditSamplerUseCase,
    EraseSamplerUseCase,
    GetSamplerByIdUseCase,
} from '@application/use-cases';
import {
    ICreateSamplerController,
    IGetSamplersController,
    IEditSamplerController,
    IEraseSamplerController,
    IGetSamplerController,
} from '@domain/controllers';
import { idGenerate, logger, storage } from './shared';
import { createSamplerRepository } from './repository';

export function createSamplerController (): ICreateSamplerController {
    const createSamplerService = new CreateSamplerService(logger, idGenerate);
    const getSamplersService = new GetSamplersService(logger);
    const samplerRepository = createSamplerRepository(storage, logger);
    const createSamplerUseCase = new CreateSamplerUseCase(logger, samplerRepository, createSamplerService, getSamplersService);
    return new CreateSamplerController(logger, createSamplerUseCase);
}

export function getSamplersController (): IGetSamplersController {
    const samplerRepository = createSamplerRepository(storage, logger);
    const getSamplersService = new GetSamplersService(logger);
    const getSamplersUseCase = new GetSamplersUseCase(logger, getSamplersService, samplerRepository);
    return new GetSamplersController(logger, getSamplersUseCase, new GetSamplersPresenter());
}

export function editSamplerController (): IEditSamplerController {
    const samplerRepository = createSamplerRepository(storage, logger);
    const editSamplerService = new EditSamplerService(logger);
    const getSamplersService = new GetSamplersService(logger);
    const editSamplerUseCase = new EditSamplerUseCase(logger, editSamplerService, samplerRepository, getSamplersService);
    return new EditSamplerController(logger, editSamplerUseCase);
}

export function eraseSamplerController (): IEraseSamplerController {
    const samplerRepository = createSamplerRepository(storage, logger);
    const eraseSamplerUseCase = new EraseSamplerUseCase(logger, samplerRepository);
    return new EraseSamplerController(logger, eraseSamplerUseCase);
}

export function getSamplerController (): IGetSamplerController {
    const samplerRepository = createSamplerRepository(storage, logger);
    const useCase = new GetSamplerByIdUseCase(logger, samplerRepository, new GetSamplersService(logger));
    return new GetSamplerController(logger, useCase, new GetSamplerPresenter());
}
