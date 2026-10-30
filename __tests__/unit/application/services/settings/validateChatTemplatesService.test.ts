import { ValidateChatTemplatesService } from '@application/services';
import { CHAT_TEMPLATE_DEFINITIONS } from '@domain/constants/textGeneration';
import { ChatTemplateKeyEnum, ChatTemplateOverrides, ChatTemplates } from '@domain/entities';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

function validate (templates: ChatTemplateOverrides) {
    return new ValidateChatTemplatesService(logger).validate({ templates });
}

describe('ValidateChatTemplatesService', () => {
    it('accepts every default template', () => {
        const entries = Object.values(ChatTemplateKeyEnum).map(key => [key, CHAT_TEMPLATE_DEFINITIONS[key].defaultTemplate]);
        const templates: ChatTemplates = Object.fromEntries(entries);

        expect(validate(templates)).toEqual({ success: true });
    });

    it('accepts free text around the required tag', () => {
        expect(validate({ worlds: '\n# REALMS\n\n{worlds}\n\n' })).toEqual({ success: true });
    });

    it('accepts no templates at all', () => {
        expect(validate({})).toEqual({ success: true });
    });

    it('accepts a required tag repeated in the template', () => {
        expect(validate({ worlds: '{worlds}{worlds}' })).toEqual({ success: true });
    });

    it('accepts an instruction without the character name', () => {
        expect(validate({ aiCharacterInstruction: 'Answer in one line.' })).toEqual({ success: true });
    });

    it('accepts an instruction with the character name', () => {
        expect(validate({ worldMasterInstruction: 'Close the turn as {characterName}.' })).toEqual({ success: true });
    });

    it('refuses a template without its required tag', () => {
        expect(validate({ worlds: '# REALMS' })).toEqual({ success: false, fieldErrors: { worlds: 'Missing tag: {worlds}' } });
    });

    it('refuses a message without the turn tag', () => {
        const response = validate({ message: '{context}{instructionMessage}' });

        expect(response).toEqual({ success: false, fieldErrors: { message: 'Missing tag: {turnMessage}' } });
    });

    it('refuses a message without the context tag', () => {
        const response = validate({ message: '{turnMessage}{instructionMessage}' });

        expect(response).toEqual({ success: false, fieldErrors: { message: 'Missing tag: {context}' } });
    });

    it('refuses a tag the template does not accept', () => {
        const response = validate({ characterMessage: '{characterNme}{characterName}{characterMessage}' });

        expect(response).toEqual({ success: false, fieldErrors: { characterMessage: 'Invalid tag: {characterNme}' } });
    });

    it('refuses a tag written with spaces', () => {
        expect(validate({ worlds: '{ worlds }' })).toEqual({ success: false, fieldErrors: { worlds: 'Invalid tag: { worlds }' } });
    });

    it('refuses an empty pair of braces', () => {
        expect(validate({ contextInstruction: 'Write the context {}' })).toEqual({ success: false, fieldErrors: { contextInstruction: 'Invalid tag: {}' } });
    });

    it('refuses a blank template', () => {
        const response = validate({ aiCharacterInstruction: ' \n ' });

        expect(response).toEqual({ success: false, fieldErrors: { aiCharacterInstruction: 'Template cannot be blank' } });
    });

    it('reports the error of each invalid template', () => {
        const response = validate({ worlds: '', items: '{worlds}', locations: '{locations}' });

        expect(response).toEqual({
            success: false,
            fieldErrors: { worlds: 'Template cannot be blank', items: 'Invalid tag: {worlds}' }
        });
    });
});
