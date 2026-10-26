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
import { IEditSamplerUseCase, IGetSamplerByIdUseCase, IGetSamplersUseCase } from '@domain/use-cases';
import { idGenerate, logger, storage } from './shared';
import { createSamplerRepository } from './repository';

export function createSamplerController (): ICreateSamplerController {
    const createSamplerService = new CreateSamplerService(logger, idGenerate);
    const getSamplersService = new GetSamplersService(logger);
    const samplerRepository = createSamplerRepository(storage, logger);
    const createSamplerUseCase = new CreateSamplerUseCase(logger, samplerRepository, createSamplerService, getSamplersService);
    return new CreateSamplerController(logger, createSamplerUseCase);
}

export function createGetSamplersUseCase (): IGetSamplersUseCase {
    const getSamplersService = new GetSamplersService(logger);
    const samplerRepository = createSamplerRepository(storage, logger);
    return new GetSamplersUseCase(logger, getSamplersService, samplerRepository);
}

export function getSamplersController (): IGetSamplersController {
    const getSamplersUseCase = createGetSamplersUseCase();
    return new GetSamplersController(logger, getSamplersUseCase, new GetSamplersPresenter());
}

export function createEditSamplerUseCase (): IEditSamplerUseCase {
    const editSamplerService = new EditSamplerService(logger);
    const samplerRepository = createSamplerRepository(storage, logger);
    const getSamplersService = new GetSamplersService(logger);
    return new EditSamplerUseCase(logger, editSamplerService, samplerRepository, getSamplersService);
}

export function editSamplerController (): IEditSamplerController {
    const editSamplerUseCase = createEditSamplerUseCase();
    return new EditSamplerController(logger, editSamplerUseCase);
}

export function eraseSamplerController (): IEraseSamplerController {
    const samplerRepository = createSamplerRepository(storage, logger);
    const eraseSamplerUseCase = new EraseSamplerUseCase(logger, samplerRepository);
    return new EraseSamplerController(logger, eraseSamplerUseCase);
}

export function createGetSamplerByIdUseCase (): IGetSamplerByIdUseCase {
    const samplerRepository = createSamplerRepository(storage, logger);
    const getSamplersService = new GetSamplersService(logger);
    return new GetSamplerByIdUseCase(logger, samplerRepository, getSamplersService);
}

export function getSamplerController (): IGetSamplerController {
    const getSamplerByIdUseCase = createGetSamplerByIdUseCase();
    return new GetSamplerController(logger, getSamplerByIdUseCase, new GetSamplerPresenter());
}
