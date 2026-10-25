import { useControllers } from '@presentation/providers/ControllersProvider';
import { ActivationPromptScreen, type ActivationPromptScreenConfig } from './ActivationPromptScreen';

const abilityConfig: ActivationPromptScreenConfig = {
  entityName: 'Ability',
  pluralName: 'abilities',
  namePlaceholder: 'e.g., Fireball',
  activationPlaceholder: 'e.g., Combat',
  promptPlaceholder: 'Enter the ability prompt...',
};

const itemConfig: ActivationPromptScreenConfig = {
  entityName: 'Item',
  pluralName: 'items',
  namePlaceholder: 'e.g., Iron Sword',
  activationPlaceholder: 'e.g., sword;blade',
  promptPlaceholder: 'Enter the item prompt...',
};

const locationConfig: ActivationPromptScreenConfig = {
  entityName: 'Location',
  pluralName: 'locations',
  namePlaceholder: 'e.g., Ancient Ruins',
  activationPlaceholder: 'e.g., ruins;temple',
  promptPlaceholder: 'Enter the location prompt...',
};

const proficiencyConfig: ActivationPromptScreenConfig = {
  entityName: 'Proficiency',
  pluralName: 'proficiencies',
  namePlaceholder: 'e.g., Combat Mastery',
  activationPlaceholder: 'e.g., Combat',
  promptPlaceholder: 'Enter the proficiency prompt...',
};

const statusConfig: ActivationPromptScreenConfig = {
  entityName: 'Status',
  pluralName: 'statuses',
  namePlaceholder: 'e.g., Blessing',
  activationPlaceholder: 'e.g., blessing;holy',
  promptPlaceholder: 'Enter the status prompt...',
};

const worldConfig: ActivationPromptScreenConfig = {
  entityName: 'World',
  pluralName: 'worlds',
  namePlaceholder: 'e.g., Fantasy World',
  activationPlaceholder: 'e.g., Dungeon',
  promptPlaceholder: 'Enter the world prompt...',
};

export function AbilitiesScreen () {
  const { getAbilities, getAbility, createAbility, editAbility, eraseAbility } = useControllers();
  return (
    <ActivationPromptScreen
      config={abilityConfig}
      controllers={{ list: getAbilities, get: getAbility, create: createAbility, edit: editAbility, erase: eraseAbility }}
    />
  );
}

export function ItemsScreen () {
  const { getItems, getItem, createItem, editItem, eraseItem } = useControllers();
  return (
    <ActivationPromptScreen
      config={itemConfig}
      controllers={{ list: getItems, get: getItem, create: createItem, edit: editItem, erase: eraseItem }}
    />
  );
}

export function LocationsScreen () {
  const { getLocations, getLocation, createLocation, editLocation, eraseLocation } = useControllers();
  return (
    <ActivationPromptScreen
      config={locationConfig}
      controllers={{ list: getLocations, get: getLocation, create: createLocation, edit: editLocation, erase: eraseLocation }}
    />
  );
}

export function ProficienciesScreen () {
  const { getProficiencies, getProficiency, createProficiency, editProficiency, eraseProficiency } = useControllers();
  return (
    <ActivationPromptScreen
      config={proficiencyConfig}
      controllers={{ list: getProficiencies, get: getProficiency, create: createProficiency, edit: editProficiency, erase: eraseProficiency }}
    />
  );
}

export function StatusesScreen () {
  const { getStatuses, getStatus, createStatus, editStatus, eraseStatus } = useControllers();
  return (
    <ActivationPromptScreen
      config={statusConfig}
      controllers={{ list: getStatuses, get: getStatus, create: createStatus, edit: editStatus, erase: eraseStatus }}
    />
  );
}

export function WorldsScreen () {
  const { getWorlds, getWorld, createWorld, editWorld, eraseWorld } = useControllers();
  return (
    <ActivationPromptScreen
      config={worldConfig}
      controllers={{ list: getWorlds, get: getWorld, create: createWorld, edit: editWorld, erase: eraseWorld }}
    />
  );
}
