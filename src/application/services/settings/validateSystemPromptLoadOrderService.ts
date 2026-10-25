import { DEFAULT_TEXT_ADVENTURE_TEMPLATE } from '@domain/constants/textGeneration';
import { ILogger } from '@domain/logger';
import {
    IValidateSystemPromptLoadOrderService,
    LOAD_ORDER_TAG_PATTERN,
    LOAD_ORDER_WHITESPACE_PATTERN,
    ValidateSystemPromptLoadOrderServiceParams,
    ValidateSystemPromptLoadOrderServiceReturn,
} from '@domain/services';

export class ValidateSystemPromptLoadOrderService implements IValidateSystemPromptLoadOrderService {
    private readonly validTagNames: ReadonlySet<string> = new Set(this.extractTagNames(DEFAULT_TEXT_ADVENTURE_TEMPLATE));

    constructor (private readonly logger: ILogger) { }

    validate (params: ValidateSystemPromptLoadOrderServiceParams): ValidateSystemPromptLoadOrderServiceReturn {
        this.logger.info('Executing ValidateSystemPromptLoadOrderService::validate');

        const loadOrder = params.loadOrder.replace(LOAD_ORDER_WHITESPACE_PATTERN, '');
        const error = this.findError(loadOrder);
        if (error) {
            this.logger.debug('ValidateSystemPromptLoadOrderService::validate - invalid load order', error);
            return { success: false, error };
        }

        return { success: true, loadOrder };
    }

    private findError (loadOrder: string): string | null {
        const textOutsideTags = loadOrder.replace(LOAD_ORDER_TAG_PATTERN, '');
        if (textOutsideTags) {
            return `Unexpected text outside tags: ${textOutsideTags}`;
        }

        const seenTagNames = new Set<string>();
        for (const name of this.extractTagNames(loadOrder)) {
            if (!this.validTagNames.has(name)) {
                return `Invalid tag: {${name}}`;
            }

            if (seenTagNames.has(name)) {
                return `Duplicated tag: {${name}}`;
            }

            seenTagNames.add(name);
        }

        return null;
    }

    private extractTagNames (loadOrder: string): string[] {
        return Array.from(loadOrder.matchAll(LOAD_ORDER_TAG_PATTERN), ([, name]) => name);
    }
}
