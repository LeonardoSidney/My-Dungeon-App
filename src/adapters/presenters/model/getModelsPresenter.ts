import type { ListedModel } from '@domain/use-cases';
import type { ModelOption } from '@domain/controllers';
import { IGetModelsPresenter } from '@domain/presenters';

export class GetModelsPresenter implements IGetModelsPresenter {
    present (models: ListedModel[]): ModelOption[] {
        return models.map(({ model, connection }) => ({
            id: model.id,
            name: model.name,
            connectionId: connection.id,
            connectionName: connection.name,
        }));
    }
}
