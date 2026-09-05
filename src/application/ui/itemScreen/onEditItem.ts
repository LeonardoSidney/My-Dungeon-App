import { EditItemControllerParams, EditItemControllerResponse, IEditItemController } from '@domain/controllers';
import { ItemFormData } from './constants';

export async function onEditItem (
    formData: ItemFormData,
    editItem: IEditItemController
): Promise<EditItemControllerResponse> {
    if (!formData.id) {
        return {
            success: false,
            error: 'Item id is required',
        };
    }

    const request: EditItemControllerParams = {
        id: formData.id,
        editParams: {
            name: formData.name,
            activationWord: formData.activationWord,
            prompt: formData.prompt,
            observation: formData.observation || undefined,
        },
    };

    return editItem.handle(request);
}
