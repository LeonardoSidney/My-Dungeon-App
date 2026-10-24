import { CHARACTER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    ICharacterRepository,
    SaveCharacterParams,
    SaveCharacterRepositoryReturn,
    GetCharactersRepositoryReturn,
    GetCharacterByIdRepositoryReturn,
    EditCharacterParams,
    EditCharacterReturn,
    EraseCharacterReturn,
} from '@domain/repository';
import { IStorage } from '@domain/storage';
import { CharacterDTO } from '@infra/dto';

export class CharacterRepository implements ICharacterRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`;
    }

    async saveCharacter (params: SaveCharacterParams): Promise<SaveCharacterRepositoryReturn> {
        this.logger.info('Executing CharacterRepository::saveCharacter');
        this.logger.debug('Executing CharacterRepository::saveCharacter - params: ', params);

        const loaded = await this.storage.load<Character[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('CharacterRepository::saveCharacter - failed to load characters', loaded.error);
            return { success: false, error: 'Failed to save character' };
        }

        const characters = [...(loaded.data ?? []), params.character];
        const saved = await this.storage.save(this.storageKey, characters);
        if (!saved.success) {
            this.logger.warning('CharacterRepository::saveCharacter - failed to persist characters', saved.error);
            return { success: false, error: 'Failed to save character' };
        }

        return { success: true };
    }

    async getCharacterById (characterId: string): Promise<GetCharacterByIdRepositoryReturn> {
        this.logger.info('Executing CharacterRepository::getCharacterById');

        const response = await this.getCharacters();
        if (!response.success || !response.characters) {
            return { success: false, error: response.error };
        }

        return { success: true, character: response.characters.find((c) => c.id === characterId) };
    }

    async getCharacters (): Promise<GetCharactersRepositoryReturn> {
        this.logger.info('Executing CharacterRepository::getCharacters');

        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('CharacterRepository::getCharacters - failed to load characters', loaded.error);
            return { success: false, error: 'Failed to load characters' };
        }

        const rawData = loaded.data ?? [];
        this.logger.debug('Executing CharacterRepository::getCharacters - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('CharacterRepository::getCharacters - stored characters are not a list');
            return { success: false, error: 'Failed to load characters' };
        }

        const characters: Character[] = [];
        for (const characterUnknown of rawData) {
            const dto = CharacterDTO.fromStorage(characterUnknown);
            if (dto) {
                characters.push(dto.toEntity());
            }
        }

        if (rawData.length !== characters.length) {
            this.logger.warning('Some characters were not converted to entity');
        }

        this.logger.debug('Executing CharacterRepository::getCharacters - characters: ', characters);
        return { success: true, characters };
    }

    async editCharacter (params: EditCharacterParams): Promise<EditCharacterReturn> {
        this.logger.info('Executing CharacterRepository::editCharacter');
        this.logger.debug('Executing CharacterRepository::editCharacter - params: ', params);

        const { character } = params;
        const loaded = await this.storage.load<Character[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('CharacterRepository::editCharacter - failed to load characters', loaded.error);
            return { success: false, error: 'Failed to edit character' };
        }

        const characters = loaded.data ?? [];
        const index = characters.findIndex((c) => c.id === character.id);
        if (index === -1) {
            this.logger.warning(`Character with id ${character.id} not found`);
            return { success: false, error: `Character with id ${character.id} does not exist` };
        }

        characters[index] = character;
        const saved = await this.storage.save(this.storageKey, characters);
        if (!saved.success) {
            this.logger.warning('CharacterRepository::editCharacter - failed to persist characters', saved.error);
            return { success: false, error: 'Failed to edit character' };
        }

        return { success: true };
    }

    async eraseCharacter (characterId: string): Promise<EraseCharacterReturn> {
        this.logger.info('Executing CharacterRepository::eraseCharacter');
        this.logger.debug('Executing CharacterRepository::eraseCharacter - characterId: ', characterId);

        const loaded = await this.storage.load<Character[]>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('CharacterRepository::eraseCharacter - failed to load characters', loaded.error);
            return { success: false, error: 'Failed to erase character' };
        }

        const characters = loaded.data ?? [];
        const index = characters.findIndex((c) => c.id === characterId);
        if (index === -1) {
            this.logger.warning(`Character with id ${characterId} not found`);
            return { success: false, error: `Character with id ${characterId} does not exist` };
        }

        characters.splice(index, 1);
        const saved = await this.storage.save(this.storageKey, characters);
        if (!saved.success) {
            this.logger.warning('CharacterRepository::eraseCharacter - failed to persist characters', saved.error);
            return { success: false, error: 'Failed to erase character' };
        }

        return { success: true };
    }
}
