import { AppendChatAdventureController } from '@adapters/controllers';
import { IAppendChatAdventureUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Adventure, Chat, RoleEnum } from '@domain/entities';

// Mock das dependências
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
};

const mockUseCase = {
    execute: jest.fn(),
};

describe('AppendChatAdventureController', () => {
    let controller: AppendChatAdventureController;

    beforeEach(() => {
        controller = new AppendChatAdventureController(
            mockLogger as unknown as ILogger,
            mockUseCase as unknown as IAppendChatAdventureUseCase
        );
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: [],
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockMessage: Chat = {
            id: 'msg-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Hello world'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockResponse = {
            success: true,
            adventure: { ...mockAdventure, chat: [mockMessage] },
            error: undefined,
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle({
            adventure: mockAdventure,
            message: mockMessage,
        });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing AppendChatAdventureController::handle');
    });

    it('should execute use case with correct parameters', async () => {
        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: [],
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockMessage: Chat = {
            id: 'msg-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Test message'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockResponse = {
            success: true,
            adventure: { ...mockAdventure, chat: [mockMessage] },
            error: undefined,
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle({
            adventure: mockAdventure,
            message: mockMessage,
        });

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            adventure: mockAdventure,
            message: mockMessage,
        });
    });

    it('should return success response when use case succeeds', async () => {
        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: [],
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockMessage: Chat = {
            id: 'msg-1',
            role: RoleEnum.ASSISTANT,
            index: 0,
            content: ['This is a response'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedAdventure: Adventure = {
            ...mockAdventure,
            chat: [mockMessage],
            updatedAt: new Date(),
        };

        const mockResponse = {
            success: true,
            adventure: updatedAdventure,
            error: undefined,
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle({
            adventure: mockAdventure,
            message: mockMessage,
        });

        expect(result).toEqual({
            success: true,
            adventure: updatedAdventure,
            error: undefined,
        });
    });

    it('should return error response when use case fails', async () => {
        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: [],
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockMessage: Chat = {
            id: 'msg-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Test message'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockResponse = {
            success: false,
            adventure: undefined,
            error: 'Failed to append chat message',
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle({
            adventure: mockAdventure,
            message: mockMessage,
        });

        expect(result).toEqual({
            success: false,
            adventure: undefined,
            error: 'Failed to append chat message',
        });
    });

    it('should handle adventure with existing chat messages', async () => {
        const existingChat: Chat[] = [
            {
                id: 'msg-1',
                role: RoleEnum.USER,
                index: 0,
                content: ['First message'],
                characterName: 'Unknown',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                id: 'msg-2',
                role: RoleEnum.ASSISTANT,
                index: 1,
                content: ['First response'],
                characterName: 'Unknown',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ];

        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: existingChat,
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const newMessage: Chat = {
            id: 'msg-3',
            role: RoleEnum.USER,
            index: 2,
            content: ['Second message'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedAdventure: Adventure = {
            ...mockAdventure,
            chat: [...existingChat, newMessage],
            updatedAt: new Date(),
        };

        const mockResponse = {
            success: true,
            adventure: updatedAdventure,
            error: undefined,
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle({
            adventure: mockAdventure,
            message: newMessage,
        });

        expect(result.success).toBe(true);
        expect(result.adventure?.chat.length).toBe(3);
    });

    it('should call logger.info exactly once', async () => {
        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: [],
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockMessage: Chat = {
            id: 'msg-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Test'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            adventure: mockAdventure,
            error: undefined,
        });

        await controller.handle({
            adventure: mockAdventure,
            message: mockMessage,
        });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call logger.info with the correct method and class name', async () => {
        const mockAdventure: Adventure = {
            id: '1',
            name: 'Test Adventure',
            chat: [],
            systemPrompts: [],
            characters: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const mockMessage: Chat = {
            id: 'msg-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Test'],
            characterName: 'Unknown',
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        mockUseCase.execute.mockResolvedValue({
            success: true,
            adventure: mockAdventure,
            error: undefined,
        });

        await controller.handle({
            adventure: mockAdventure,
            message: mockMessage,
        });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing AppendChatAdventureController::handle');
    });
});
