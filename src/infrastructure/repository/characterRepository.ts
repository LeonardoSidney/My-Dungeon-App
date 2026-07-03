import { CHARACTER_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { Character } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { ICharacterRepository, SaveCharacterParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { CharacterDTO } from '../dto';

export class CharacterRepository implements ICharacterRepository {
    constructor(
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    async saveCharacter(params: SaveCharacterParams): Promise<boolean> {
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

    async getCharacters(): Promise<Character[]> {
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
}
