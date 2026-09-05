import { CreateItemRequest, ICreateItemController } from '@domain/controllers';
import { ItemFormData } from './constants';

export async function onCreateItem (
    formData: ItemFormData,
    createItem: ICreateItemController
) {
    const newItem: CreateItemRequest = {
        name: formData.name,
        activationWord: formData.activationWord,
        prompt: formData.prompt,
        observation: formData.observation || undefined,
    };

    return createItem.handle(newItem);
}
