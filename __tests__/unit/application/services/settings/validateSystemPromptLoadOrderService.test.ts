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
        it.each([
            ['{systemPrompt} {characters}', '{systemPrompt}{characters}'],
            ['{systemPrompt}\n{characters}\n', '{systemPrompt}{characters}'],
            ['\t {systemPrompt}\r\n\t{characters}  ', '{systemPrompt}{characters}'],
            ['{ systemPrompt }', '{systemPrompt}'],
            ['   \n\t ', ''],
        ])('removes the whitespace of %j and returns %j', (loadOrder, expected) => {
            expect(validate(loadOrder)).toEqual({ success: true, loadOrder: expected });
        });
    });

    describe('valid load orders', () => {
        it.each([
            ['the default load order', DEFAULT_TEXT_ADVENTURE_TEMPLATE],
            ['an empty load order', ''],
            ['a single tag', '{characters}'],
            ['a subset of the tags', '{systemPrompt}{characters}'],
            ['the tags in another order', '{characters}{worlds}{systemPrompt}'],
            ['every tag in reverse order', '{characters}{statuses}{proficiencies}{abilities}{items}{locations}{worlds}{characterAsWorldMaster}{worldMaster}{systemPrompt}'],
        ])('accepts %s', (_, loadOrder) => {
            expect(validate(loadOrder)).toEqual({ success: true, loadOrder });
        });

        it.each([
            'systemPrompt',
            'worldMaster',
            'characterAsWorldMaster',
            'worlds',
            'locations',
            'items',
            'abilities',
            'proficiencies',
            'statuses',
            'characters',
        ])('accepts the {%s} tag alone', (name) => {
            expect(validate(`{${name}}`).success).toBe(true);
        });
    });

    describe('unknown tags', () => {
        it.each([
            ['{systemPrompt}{abacate}', 'Invalid tag: {abacate}'],
            ['{abacate}', 'Invalid tag: {abacate}'],
            ['{abacate}{systemPrompt}', 'Invalid tag: {abacate}'],
            ['{}', 'Invalid tag: {}'],
            ['{ }', 'Invalid tag: {}'],
            ['{Characters}', 'Invalid tag: {Characters}'],
            ['{SYSTEMPROMPT}', 'Invalid tag: {SYSTEMPROMPT}'],
            ['{character}', 'Invalid tag: {character}'],
            ['{characters1}', 'Invalid tag: {characters1}'],
            ['{system-prompt}', 'Invalid tag: {system-prompt}'],
        ])('rejects %j', (loadOrder, error) => {
            expect(validate(loadOrder)).toEqual({ success: false, error });
        });
    });

    describe('duplicated tags', () => {
        it.each([
            ['{characters}{characters}', 'Duplicated tag: {characters}'],
            ['{characters}\n{characters}', 'Duplicated tag: {characters}'],
            ['{systemPrompt}{characters}{systemPrompt}', 'Duplicated tag: {systemPrompt}'],
            [`${DEFAULT_TEXT_ADVENTURE_TEMPLATE}{worlds}`, 'Duplicated tag: {worlds}'],
        ])('rejects %j', (loadOrder, error) => {
            expect(validate(loadOrder)).toEqual({ success: false, error });
        });
    });

    describe('text outside tags', () => {
        it.each([
            ['systemPrompt', 'Unexpected text outside tags: systemPrompt'],
            ['{systemPrompt}hello{characters}', 'Unexpected text outside tags: hello'],
            ['{systemPrompt} hello {characters}', 'Unexpected text outside tags: hello'],
            ['hello{systemPrompt}', 'Unexpected text outside tags: hello'],
            ['{systemPrompt},{characters}', 'Unexpected text outside tags: ,'],
            ['{systemPrompt', 'Unexpected text outside tags: {systemPrompt'],
            ['systemPrompt}', 'Unexpected text outside tags: systemPrompt}'],
            ['{{characters}}', 'Unexpected text outside tags: {}'],
            ['{systemPrompt}}', 'Unexpected text outside tags: }'],
            ['{systemPrompt{characters}}', 'Unexpected text outside tags: {systemPrompt}'],
        ])('rejects %j', (loadOrder, error) => {
            expect(validate(loadOrder)).toEqual({ success: false, error });
        });
    });

    it('reports the text outside tags before an invalid tag', () => {
        expect(validate('{abacate}hello')).toEqual({ success: false, error: 'Unexpected text outside tags: hello' });
    });

    it('reports the first problem found among the tags', () => {
        expect(validate('{characters}{characters}{abacate}')).toEqual({ success: false, error: 'Duplicated tag: {characters}' });
    });
});
