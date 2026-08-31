import { CHARACTER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ICharacterRepository, SaveCharacterParams, EditCharacterParams, EditCharacterReturn, EraseCharacterReturn } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { CharacterDTO } from '@infra/dto';

export class CharacterRepository implements ICharacterRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private async findCharacterIndex (characters: Character[], characterId: string): Promise<number> {
        return characters.findIndex((c) => c.id === characterId);
    }

    private removeAt (characters: Character[], index: number): Character[] {
        characters.splice(index, 1);
        return characters;
    }

    private replaceAt (characters: Character[], index: number, newItem: Character): Character[] {
        characters[index] = newItem;
        return characters;
    }

    async saveCharacter (params: SaveCharacterParams): Promise<boolean> {
        this.logger.info('Executing CharacterRepository::saveCharacter');
        this.logger.debug('Executing CharacterRepository::saveCharacter - params: ', params);

        try {
            const { character } = params;
            const existingData = await this.storage.load<Character[]>(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`);
            const characters: Character[] = existingData ? [...existingData, character] : [character];
            await this.storage.save(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`, characters);
        } catch (error) {
            this.logger.error('Error on CharacterRepository::saveCharacter', error);
            throw error;
        }
        return true;
    }

    async getCharacterById (characterId: string): Promise<Character | undefined> {
        this.logger.info('Executing CharacterRepository::getCharacterById');
        const characters = await this.getCharacters();
        return characters.find((c) => c.id === characterId);
    }

    async getCharacters (): Promise<Character[]> {
        this.logger.info('Executing CharacterRepository::getCharacters');
        try {
            const characters: Character[] = [];
            const rawData = await this.storage.load<unknown[]>(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`);
            this.logger.debug('Executing CharacterRepository::getCharacters - rawData: ', rawData);

            if (rawData) {
                const characterDTO: CharacterDTO[] = [];
                for (const characterUnknown of rawData) {
                    const character = CharacterDTO.fromStorage(characterUnknown);
                    if (character) {
                        characterDTO.push(character);
                    }
                }

                characters.push(...characterDTO.map(dto => dto.toEntity()));

                if (rawData.length !== characters.length) {
                    this.logger.warning('Some characters were not converted to entity');
                }
            }

            this.logger.debug('Executing CharacterRepository::getCharacters - characters: ', characters);

            return characters;
        } catch (error) {
            this.logger.error('Error on CharacterRepository getCharacters', error);
            throw error;
        }
    }

    async eraseCharacter (characterId: string): Promise<EraseCharacterReturn> {
        this.logger.info('Executing CharacterRepository::eraseCharacter');
        this.logger.debug('Executing CharacterRepository::eraseCharacter - characterId: ', characterId);

        try {
            const existingData = await this.storage.load<Character[]>(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`);
            const characters = existingData || [];
            const index = await this.findCharacterIndex(characters, characterId);

            if (index === -1) {
                this.logger.warning(`Character with id ${characterId} not found`);
                return { success: false, error: `Character with id ${characterId} does not exist` };
            }

            const filteredCharacters = this.removeAt(characters, index);
            await this.storage.save(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`, filteredCharacters);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on CharacterRepository::eraseCharacter', error);
            return { success: false, error: 'Failed to erase character' };
        }
    }

    async editCharacter (params: EditCharacterParams): Promise<EditCharacterReturn> {
        this.logger.info('Executing CharacterRepository::editCharacter');
        this.logger.debug('Executing CharacterRepository::editCharacter - params: ', params);

        try {
            const { character } = params;
            const existingData = await this.storage.load<Character[]>(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`);
            const characters = existingData || [];
            const index = await this.findCharacterIndex(characters, character.id);

            if (index === -1) {
                this.logger.warning(`Character with id ${character.id} not found`);
                return { success: false, error: `Character with id ${character.id} does not exist` };
            }

            const updatedCharacters = this.replaceAt(characters, index, character);
            await this.storage.save(`${STORAGE_NAMESPACE}/${CHARACTER_STORAGE_NAMESPACE}`, updatedCharacters);
            return { success: true };
        } catch (error) {
            this.logger.error('Error on CharacterRepository::editCharacter', error);
            return { success: false, error: 'Failed to edit character' };
        }
    }
}
