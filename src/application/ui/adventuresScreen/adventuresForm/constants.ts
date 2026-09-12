import { AdventureFormData, FormErrors } from '../constants';
import { Character, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';

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
    characters: Character[];
    systemPrompts: SystemPrompt[];
    worldMasters: WorldMaster[];
    worlds: World[];
    locations: Location[];
    items: Item[];
    optionErrors: AdventuresFormOptionErrors;
}
