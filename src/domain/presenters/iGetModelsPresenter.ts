import type { ListedModel } from '../use-cases';
import type { ModelOption } from '../controllers';

export interface IGetModelsPresenter {
    present (models: ListedModel[]): ModelOption[];
}
