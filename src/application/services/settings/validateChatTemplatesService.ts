import { CHAT_TEMPLATE_DEFINITIONS } from '@domain/constants/textGeneration';
import { ChatTemplateFieldErrors, ChatTemplateKey, ChatTemplateKeyEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    IValidateChatTemplatesService,
    LOAD_ORDER_TAG_PATTERN,
    ValidateChatTemplatesServiceParams,
    ValidateChatTemplatesServiceReturn,
} from '@domain/services';

export class ValidateChatTemplatesService implements IValidateChatTemplatesService {
    constructor (private readonly logger: ILogger) { }

    validate (params: ValidateChatTemplatesServiceParams): ValidateChatTemplatesServiceReturn {
        this.logger.info('Executing ValidateChatTemplatesService::validate');

        const fieldErrors: ChatTemplateFieldErrors = {};
        for (const key of Object.values(ChatTemplateKeyEnum)) {
            const template = params.templates[key];
            if (template === undefined) {
                continue;
            }

            const error = this.findError(key, template);
            if (error) {
                fieldErrors[key] = error;
            }
        }

        if (Object.keys(fieldErrors).length > 0) {
            this.logger.debug('ValidateChatTemplatesService::validate - invalid templates', fieldErrors);
            return { success: false, fieldErrors };
        }

        return { success: true };
    }

    private findError (key: ChatTemplateKey, template: string): string | null {
        if (!template.trim()) {
            return 'Template cannot be blank';
        }

        const { requiredTags, optionalTags } = CHAT_TEMPLATE_DEFINITIONS[key];
        const tagNames = this.extractTagNames(template);
        const acceptedTagNames = new Set([...requiredTags, ...optionalTags]);

        const invalidTagName = tagNames.find(name => !acceptedTagNames.has(name));
        if (invalidTagName !== undefined) {
            return `Invalid tag: {${invalidTagName}}`;
        }

        const missingTagName = requiredTags.find(name => !tagNames.includes(name));
        if (missingTagName !== undefined) {
            return `Missing tag: {${missingTagName}}`;
        }

        return null;
    }

    private extractTagNames (template: string): string[] {
        return Array.from(template.matchAll(LOAD_ORDER_TAG_PATTERN), ([, name]) => name);
    }
}
