import { CreateChatAdventureController } from '../../../../src/adapters/controllers/adventure/createChatAdventureController';
import { ICreateChatAdventureUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Chat, RoleEnum, Think } from '@domain/entities';

// Mock das dependências
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

describe('CreateChatAdventureController', () => {
    let controller: CreateChatAdventureController;

    beforeEach(() => {
        controller = new CreateChatAdventureController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateChatAdventureUseCase);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should call logger.info when handling a request', async () => {
        const mockRequest = {
            content: 'Test content',
            role: RoleEnum.USER,
            think: { id: 'think-1', content: 'Thinking...', enabled: true }
        };

        const mockChat: Chat = {
            id: 'chat-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Test content'],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            chat: mockChat,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateChatAdventureController::handle');
    });

    it('should call logger.debug with request details', async () => {
        const mockRequest = {
            content: 'Debug test',
            role: RoleEnum.ASSISTANT
        };

        const mockResponse = {
            success: true,
            chat: {
                id: 'chat-1',
                role: RoleEnum.ASSISTANT,
                index: 0,
                content: ['Debug test'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockLogger.debug).toHaveBeenCalledWith('CreateChatAdventureController::handle - request', mockRequest);
    });

    it('should execute use case with correct parameters', async () => {
        const mockRequest = {
            content: 'Test content',
            role: RoleEnum.USER,
            think: { id: 'think-1', enabled: false }
        };

        const mockResponse = {
            success: true,
            chat: {
                id: 'chat-1',
                role: RoleEnum.USER,
                index: 0,
                content: ['Test content'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            content: mockRequest.content,
            role: mockRequest.role,
            think: mockRequest.think
        });
    });

    it('should execute use case without think parameter when not provided', async () => {
        const mockRequest = {
            content: 'Test content',
            role: RoleEnum.SYSTEM
        };

        const mockResponse = {
            success: true,
            chat: {
                id: 'chat-1',
                role: RoleEnum.SYSTEM,
                index: 0,
                content: ['Test content'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        await controller.handle(mockRequest);

        expect(mockUseCase.execute).toHaveBeenCalledWith({
            content: mockRequest.content,
            role: mockRequest.role,
            think: undefined
        });
    });

    it('should return success response when use case succeeds', async () => {
        const mockRequest = {
            content: 'Hello world',
            role: RoleEnum.USER
        };

        const mockChat: Chat = {
            id: 'chat-1',
            role: RoleEnum.USER,
            index: 0,
            content: ['Hello world'],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            chat: mockChat,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            chat: mockChat,
            error: undefined
        });
    });

    it('should return error response when use case fails', async () => {
        const mockRequest = {
            content: 'Test content',
            role: RoleEnum.ASSISTANT,
            think: { id: 'think-1', content: 'Thinking...', enabled: true }
        };

        const mockResponse = {
            success: false,
            chat: undefined,
            error: 'Failed to create chat adventure'
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: false,
            chat: undefined,
            error: 'Failed to create chat adventure'
        });
    });

    it('should handle request with assistant role', async () => {
        const mockRequest = {
            content: 'Assistant response',
            role: RoleEnum.ASSISTANT
        };

        const mockChat: Chat = {
            id: 'chat-2',
            role: RoleEnum.ASSISTANT,
            index: 1,
            content: ['Assistant response'],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            chat: mockChat,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            chat: mockChat,
            error: undefined
        });
    });

    it('should handle request with system role', async () => {
        const mockRequest = {
            content: 'System message',
            role: RoleEnum.SYSTEM
        };

        const mockChat: Chat = {
            id: 'chat-3',
            role: RoleEnum.SYSTEM,
            index: 0,
            content: ['System message'],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const mockResponse = {
            success: true,
            chat: mockChat,
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result).toEqual({
            success: true,
            chat: mockChat,
            error: undefined
        });
    });

    it('should handle think with empty content', async () => {
        const mockRequest = {
            content: 'Test',
            role: RoleEnum.USER,
            think: { id: 'think-2', enabled: true }
        };

        const mockResponse = {
            success: true,
            chat: {
                id: 'chat-4',
                role: RoleEnum.USER,
                index: 0,
                content: ['Test'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result.success).toBe(true);
        expect(mockUseCase.execute).toHaveBeenCalledWith({
            content: 'Test',
            role: RoleEnum.USER,
            think: { id: 'think-2', enabled: true }
        });
    });

    it('should handle think disabled', async () => {
        const mockRequest = {
            content: 'Test without thinking',
            role: RoleEnum.USER,
            think: { id: 'think-3', content: '', enabled: false }
        };

        const mockResponse = {
            success: true,
            chat: {
                id: 'chat-5',
                role: RoleEnum.USER,
                index: 0,
                content: ['Test without thinking'],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            error: undefined
        };

        mockUseCase.execute.mockResolvedValue(mockResponse);

        const result = await controller.handle(mockRequest);

        expect(result.success).toBe(true);
        expect(result.chat).toBeDefined();
    });
});
