import { createAbilityHelper } from '@test/helpers';
import { ICreateAbilityController, IEditAbilityController } from '@domain/controllers';
import { ActivationPromptFormData } from '@application/ui/components';
import {
    initialAbilityForm,
    submitAbility,
    toCreateParams,
    toEditParams,
    toFormState,
    validateAbilityForm,
} from '@application/ui/abilitiesScreen/form';

describe('abilitiesScreen/form', () => {
    describe('validateAbilityForm', () => {
        it('returns no errors when all required fields are filled', () => {
            const form: ActivationPromptFormData = {
                id: '',
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast fire',
                observation: '',
            };

            expect(validateAbilityForm(form)).toEqual({});
        });

        it('flags empty and whitespace-only required fields', () => {
            const form: ActivationPromptFormData = {
                id: '',
                name: '   ',
                activationWord: '',
                prompt: '  ',
                observation: 'ignored',
            };

            expect(validateAbilityForm(form)).toEqual({
                name: 'Name is required',
                activationWord: 'Activation Word is required',
                prompt: 'Prompt is required',
            });
        });
    });

    describe('toFormState', () => {
        it('maps an entity into form state, defaulting a missing observation to empty', () => {
            const ability = createAbilityHelper({ observation: undefined });

            expect(toFormState(ability)).toEqual({
                id: ability.id,
                name: ability.name,
                activationWord: ability.activationWord,
                prompt: ability.prompt,
                observation: '',
            });
        });

        it('preserves a provided observation', () => {
            const ability = createAbilityHelper({ observation: 'Careful with fire' });

            expect(toFormState(ability).observation).toBe('Careful with fire');
        });
    });

    describe('initialAbilityForm', () => {
        it('returns an empty form', () => {
            expect(initialAbilityForm()).toEqual({
                id: '',
                name: '',
                activationWord: '',
                prompt: '',
                observation: '',
            });
        });
    });

    describe('toCreateParams', () => {
        it('drops the id and omits an empty observation', () => {
            const form: ActivationPromptFormData = {
                id: '',
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
                observation: '',
            };

            expect(toCreateParams(form)).toEqual({
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
            });
        });

        it('keeps a provided observation', () => {
            const form: ActivationPromptFormData = {
                id: '',
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
                observation: 'Big fire',
            };

            expect(toCreateParams(form)).toEqual({
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
                observation: 'Big fire',
            });
        });
    });

    describe('toEditParams', () => {
        it('wraps the edit payload with the id', () => {
            const form: ActivationPromptFormData = {
                id: '42',
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
                observation: 'Big fire',
            };

            expect(toEditParams(form)).toEqual({
                id: '42',
                editParams: {
                    name: 'Fireball',
                    activationWord: 'Combat',
                    prompt: 'Cast',
                    observation: 'Big fire',
                },
            });
        });
    });

    describe('submitAbility', () => {
        it('routes to the create controller when the form has no id', async () => {
            const createHandle = jest.fn().mockResolvedValue({ success: true });
            const editHandle = jest.fn();
            const createAbility: ICreateAbilityController = { handle: createHandle };
            const editAbility: IEditAbilityController = { handle: editHandle };
            const form: ActivationPromptFormData = {
                id: '',
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
                observation: '',
            };

            const response = await submitAbility(form, createAbility, editAbility);

            expect(createHandle).toHaveBeenCalledWith({ name: 'Fireball', activationWord: 'Combat', prompt: 'Cast' });
            expect(editHandle).not.toHaveBeenCalled();
            expect(response).toEqual({ success: true });
        });

        it('routes to the edit controller when the form has an id', async () => {
            const createHandle = jest.fn();
            const editHandle = jest.fn().mockResolvedValue({ success: true });
            const createAbility: ICreateAbilityController = { handle: createHandle };
            const editAbility: IEditAbilityController = { handle: editHandle };
            const form: ActivationPromptFormData = {
                id: '7',
                name: 'Fireball',
                activationWord: 'Combat',
                prompt: 'Cast',
                observation: '',
            };

            await submitAbility(form, createAbility, editAbility);

            expect(editHandle).toHaveBeenCalledWith({
                id: '7',
                editParams: { name: 'Fireball', activationWord: 'Combat', prompt: 'Cast' },
            });
            expect(createHandle).not.toHaveBeenCalled();
        });
    });
});
