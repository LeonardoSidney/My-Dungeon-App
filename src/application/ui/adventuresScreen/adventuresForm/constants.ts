import { AdventureFormData, FormErrors } from '../constants';
import { Character, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';

export interface AdventuresFormProps {
    showForm: boolean;
    adventureStateFormData: AdventureFormData;
    onChange: (field: keyof AdventureFormData, value: any) => void;
    onCancel: () => void;
    onSave: () => void;
    formErrors: FormErrors;
    characters: Character[];
    systemPrompts: SystemPrompt[];
    worldMasters: WorldMaster[];
    worlds: World[];
    locations: Location[];
    items: Item[];
}
