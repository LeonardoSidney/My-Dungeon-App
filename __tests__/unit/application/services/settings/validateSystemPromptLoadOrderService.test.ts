import { ValidateSystemPromptLoadOrderService } from '@application/services';
import { DEFAULT_TEXT_ADVENTURE_TEMPLATE } from '@domain/constants/textGeneration';
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

function validate (loadOrder: string) {
    return new ValidateSystemPromptLoadOrderService(logger).validate({ loadOrder });
}

describe('ValidateSystemPromptLoadOrderService', () => {
    describe('whitespace', () => {
        it('removes the whitespace of {systemPrompt} {characters} and returns {systemPrompt}{characters}', () => {
            expect(validate('{systemPrompt} {characters}')).toEqual({ success: true, loadOrder: '{systemPrompt}{characters}' });
        });

        it('removes the whitespace of {systemPrompt}\n{characters}\n and returns {systemPrompt}{characters}', () => {
            expect(validate('{systemPrompt}\n{characters}\n')).toEqual({ success: true, loadOrder: '{systemPrompt}{characters}' });
        });

        it('removes the whitespace of \t {systemPrompt}\r\n\t{characters}   and returns {systemPrompt}{characters}', () => {
            expect(validate('\t {systemPrompt}\r\n\t{characters}  ')).toEqual({ success: true, loadOrder: '{systemPrompt}{characters}' });
        });

        it('removes the whitespace of { systemPrompt } and returns {systemPrompt}', () => {
            expect(validate('{ systemPrompt }')).toEqual({ success: true, loadOrder: '{systemPrompt}' });
        });

        it('removes the whitespace of    \n\t  and returns ', () => {
            expect(validate('   \n\t ')).toEqual({ success: true, loadOrder: '' });
        });
    });

    describe('valid load orders', () => {
        it('accepts the default load order', () => {
            expect(validate(DEFAULT_TEXT_ADVENTURE_TEMPLATE)).toEqual({ success: true, loadOrder: DEFAULT_TEXT_ADVENTURE_TEMPLATE });
        });

        it('accepts an empty load order', () => {
            expect(validate('')).toEqual({ success: true, loadOrder: '' });
        });

        it('accepts a single tag', () => {
            expect(validate('{characters}')).toEqual({ success: true, loadOrder: '{characters}' });
        });

        it('accepts a subset of the tags', () => {
            expect(validate('{systemPrompt}{characters}')).toEqual({ success: true, loadOrder: '{systemPrompt}{characters}' });
        });

        it('accepts the tags in another order', () => {
            expect(validate('{characters}{worlds}{systemPrompt}')).toEqual({ success: true, loadOrder: '{characters}{worlds}{systemPrompt}' });
        });

        it('accepts every tag in reverse order', () => {
            expect(validate('{characters}{statuses}{proficiencies}{abilities}{items}{locations}{worlds}{characterAsWorldMaster}{worldMaster}{systemPrompt}')).toEqual({ success: true, loadOrder: '{characters}{statuses}{proficiencies}{abilities}{items}{locations}{worlds}{characterAsWorldMaster}{worldMaster}{systemPrompt}' });
        });

        it('accepts the {systemPrompt} tag alone', () => {
            expect(validate('{systemPrompt}').success).toBe(true);
        });

        it('accepts the {worldMaster} tag alone', () => {
            expect(validate('{worldMaster}').success).toBe(true);
        });

        it('accepts the {characterAsWorldMaster} tag alone', () => {
            expect(validate('{characterAsWorldMaster}').success).toBe(true);
        });

        it('accepts the {worlds} tag alone', () => {
            expect(validate('{worlds}').success).toBe(true);
        });

        it('accepts the {locations} tag alone', () => {
            expect(validate('{locations}').success).toBe(true);
        });

        it('accepts the {items} tag alone', () => {
            expect(validate('{items}').success).toBe(true);
        });

        it('accepts the {abilities} tag alone', () => {
            expect(validate('{abilities}').success).toBe(true);
        });

        it('accepts the {proficiencies} tag alone', () => {
            expect(validate('{proficiencies}').success).toBe(true);
        });

        it('accepts the {statuses} tag alone', () => {
            expect(validate('{statuses}').success).toBe(true);
        });

        it('accepts the {characters} tag alone', () => {
            expect(validate('{characters}').success).toBe(true);
        });
    });

    describe('unknown tags', () => {
        it('rejects {systemPrompt}{abacate}', () => {
            expect(validate('{systemPrompt}{abacate}')).toEqual({ success: false, error: 'Invalid tag: {abacate}' });
        });

        it('rejects {abacate}', () => {
            expect(validate('{abacate}')).toEqual({ success: false, error: 'Invalid tag: {abacate}' });
        });

        it('rejects {abacate}{systemPrompt}', () => {
            expect(validate('{abacate}{systemPrompt}')).toEqual({ success: false, error: 'Invalid tag: {abacate}' });
        });

        it('rejects {}', () => {
            expect(validate('{}')).toEqual({ success: false, error: 'Invalid tag: {}' });
        });

        it('rejects { }', () => {
            expect(validate('{ }')).toEqual({ success: false, error: 'Invalid tag: {}' });
        });

        it('rejects {Characters}', () => {
            expect(validate('{Characters}')).toEqual({ success: false, error: 'Invalid tag: {Characters}' });
        });

        it('rejects {SYSTEMPROMPT}', () => {
            expect(validate('{SYSTEMPROMPT}')).toEqual({ success: false, error: 'Invalid tag: {SYSTEMPROMPT}' });
        });

        it('rejects {character}', () => {
            expect(validate('{character}')).toEqual({ success: false, error: 'Invalid tag: {character}' });
        });

        it('rejects {characters1}', () => {
            expect(validate('{characters1}')).toEqual({ success: false, error: 'Invalid tag: {characters1}' });
        });

        it('rejects {system-prompt}', () => {
            expect(validate('{system-prompt}')).toEqual({ success: false, error: 'Invalid tag: {system-prompt}' });
        });
    });

    describe('duplicated tags', () => {
        it('rejects {characters}{characters}', () => {
            expect(validate('{characters}{characters}')).toEqual({ success: false, error: 'Duplicated tag: {characters}' });
        });

        it('rejects {characters}\n{characters}', () => {
            expect(validate('{characters}\n{characters}')).toEqual({ success: false, error: 'Duplicated tag: {characters}' });
        });

        it('rejects {systemPrompt}{characters}{systemPrompt}', () => {
            expect(validate('{systemPrompt}{characters}{systemPrompt}')).toEqual({ success: false, error: 'Duplicated tag: {systemPrompt}' });
        });

        it('rejects the default template with a placeholder repeated at the end', () => {
            const loadOrder = `${DEFAULT_TEXT_ADVENTURE_TEMPLATE}{worlds}`;

            expect(validate(loadOrder)).toEqual({ success: false, error: 'Duplicated tag: {worlds}' });
        });
    });

    describe('text outside tags', () => {
        it('rejects systemPrompt', () => {
            expect(validate('systemPrompt')).toEqual({ success: false, error: 'Unexpected text outside tags: systemPrompt' });
        });

        it('rejects {systemPrompt}hello{characters}', () => {
            expect(validate('{systemPrompt}hello{characters}')).toEqual({ success: false, error: 'Unexpected text outside tags: hello' });
        });

        it('rejects {systemPrompt} hello {characters}', () => {
            expect(validate('{systemPrompt} hello {characters}')).toEqual({ success: false, error: 'Unexpected text outside tags: hello' });
        });

        it('rejects hello{systemPrompt}', () => {
            expect(validate('hello{systemPrompt}')).toEqual({ success: false, error: 'Unexpected text outside tags: hello' });
        });

        it('rejects {systemPrompt},{characters}', () => {
            expect(validate('{systemPrompt},{characters}')).toEqual({ success: false, error: 'Unexpected text outside tags: ,' });
        });

        it('rejects {systemPrompt', () => {
            expect(validate('{systemPrompt')).toEqual({ success: false, error: 'Unexpected text outside tags: {systemPrompt' });
        });

        it('rejects systemPrompt}', () => {
            expect(validate('systemPrompt}')).toEqual({ success: false, error: 'Unexpected text outside tags: systemPrompt}' });
        });

        it('rejects {{characters}}', () => {
            expect(validate('{{characters}}')).toEqual({ success: false, error: 'Unexpected text outside tags: {}' });
        });

        it('rejects {systemPrompt}}', () => {
            expect(validate('{systemPrompt}}')).toEqual({ success: false, error: 'Unexpected text outside tags: }' });
        });

        it('rejects {systemPrompt{characters}}', () => {
            expect(validate('{systemPrompt{characters}}')).toEqual({ success: false, error: 'Unexpected text outside tags: {systemPrompt}' });
        });
    });

    it('reports the text outside tags before an invalid tag', () => {
        expect(validate('{abacate}hello')).toEqual({ success: false, error: 'Unexpected text outside tags: hello' });
    });

    it('reports the first problem found among the tags', () => {
        expect(validate('{characters}{characters}{abacate}')).toEqual({ success: false, error: 'Duplicated tag: {characters}' });
    });
});
