import { CreateAdventureServiceParams, CreateAdventureServiceReturn, ICreateAdventureService } from "./iCreateAdventureService";
import { MINIMUM_NUMBER_SYSTEM_PROMPT, MINIMUM_PLAYABLE_CHARACTERS, MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM } from "../../constants/adventure";
import { Adventure } from "../../entities";
import { ILogger } from "../../logger";
import { IIdGenerator } from "../idGenerator";

export class CreateAdventureService implements ICreateAdventureService {
    constructor(
        private readonly logger: ILogger,
        private readonly idGenerate: IIdGenerator
    ) { }
    public createAdventure(params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        this.logger.info('Executing CreateAdventureService', params);
        this.validate(params);
        if (params.worldMaster) {
            this.logger.debug('World Master found. Creating adventure with world master');
            return this.createAdventureWithWoldMaster(params);
        }

        this.logger.debug('No World Master found. Creating adventure without world master');
        return this.createAdventureWithoutWorldMaster(params);
    }

    private validate(params: CreateAdventureServiceParams): void {
        if (params.characters.length < MINIMUM_PLAYABLE_CHARACTERS) {
            throw new Error(`You need at least ${MINIMUM_PLAYABLE_CHARACTERS} to create an adventure`);
        }

        if (params.systemPrompt.length < MINIMUM_NUMBER_SYSTEM_PROMPT) {
            throw new Error('A system prompt is required to create an adventure');
        }
    }

    private createAdventureWithWoldMaster(params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        const { name, systemPrompt, characters, worldMaster, location, world, items } = params;
        const adventure: Adventure = {
            id: this.idGenerate.generate(),
            name,
            chat: [],
            systemPrompt,
            characters,
            worldMaster,
            location,
            world,
            items,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return {
            success: true,
            adventure
        };
    }

    private createAdventureWithoutWorldMaster(params: CreateAdventureServiceParams): CreateAdventureServiceReturn {
        const { name, systemPrompt, characters, worldMaster, location, world, items } = params;
        if (characters.length < MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM) {
            return {
                success: false,
                error: `Need at least ${MINIMUM_PLAYABLE_CHARACTERS_WITHOUT_WM} characters to create an adventure without a world master`
            };

        }

        return {
            success: true,
            adventure: {
                id: this.idGenerate.generate(),
                name,
                chat: [],
                systemPrompt,
                characters,
                worldMaster,
                location,
                world,
                items,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
    }
}
