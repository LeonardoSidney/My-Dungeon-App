import { AdventureFormData, FormErrors } from '../constants';
import { EntityOption } from '@domain/controllers';

export type AdventuresFormOptionErrors = {
    systemPrompts?: string;
    characters?: string;
    worldMasters?: string;
    worlds?: string;
    locations?: string;
    items?: string;
};

export interface AdventuresFormProps {
    showForm: boolean;
    adventureStateFormData: AdventureFormData;
    onChange: (field: keyof AdventureFormData, value: AdventureFormData[keyof AdventureFormData]) => void;
    onCancel: () => void;
    onSave: () => Promise<void>;
    formErrors: FormErrors;
    characters: EntityOption[];
    systemPrompts: EntityOption[];
    worldMasters: EntityOption[];
    worlds: EntityOption[];
    locations: EntityOption[];
    items: EntityOption[];
    optionErrors: AdventuresFormOptionErrors;
}
