import { SamplerFormData } from '../constants';
import { EditSamplerControllerParams } from '@domain/controllers';
import { editSamplerController } from '@infra/container';

export async function onEdit (
    formData: SamplerFormData
) {
    const controller = editSamplerController();
    const request: EditSamplerControllerParams = {
        id: formData.id!,
        editParams: {
            name: formData.name,
            observation: formData.observation || undefined,
            systemDefault: false,
            adaptativeDecay: formData.adaptativeDecay ? parseFloat(formData.adaptativeDecay) : undefined,
            adaptativeTarget: formData.adaptativeTarget ? parseFloat(formData.adaptativeTarget) : undefined,
            dryAllowedLenght: formData.dryAllowedLenght ? parseInt(formData.dryAllowedLenght, 10) : undefined,
            dryBase: formData.dryBase ? parseFloat(formData.dryBase) : undefined,
            dryMultiplier: formData.dryMultiplier ? parseFloat(formData.dryMultiplier) : undefined,
            drySequenceBreakers: formData.drySequenceBreakers.trim() || undefined,
            dynaTempExp: formData.dynaTempExp ? parseFloat(formData.dynaTempExp) : undefined,
            dynaTempRange: formData.dynaTempRange ? parseInt(formData.dynaTempRange, 10) : undefined,
            frequencyPenalty: formData.frequencyPenalty ? parseFloat(formData.frequencyPenalty) : undefined,
            ignoreEOS: formData.ignoreEOS === '' ? undefined : formData.ignoreEOS === 'true' ? true : false,
            minP: formData.minP ? parseFloat(formData.minP) : undefined,
            mirostat: formData.mirostat,
            mirostatEnt: formData.mirostatEnt ? parseFloat(formData.mirostatEnt) : undefined,
            mirostatLr: formData.mirostatLr ? parseFloat(formData.mirostatLr) : undefined,
            presencePenalty: formData.presencePenalty ? parseFloat(formData.presencePenalty) : undefined,
            repeatLastN: formData.repeatLastN ? parseInt(formData.repeatLastN, 10) : undefined,
            repeatPenalty: formData.repeatPenalty ? parseFloat(formData.repeatPenalty) : undefined,
            seed: formData.seed.trim() || undefined,
            temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
            topK: formData.topK ? parseInt(formData.topK, 10) : undefined,
            topNSigma: formData.topNSigma ? parseFloat(formData.topNSigma) : undefined,
            topP: formData.topP ? parseFloat(formData.topP) : undefined,
            typicalP: formData.typicalP ? parseFloat(formData.typicalP) : undefined,
            xtcProbability: formData.xtcProbability ? parseFloat(formData.xtcProbability) : undefined,
            xtcThreshould: formData.xtcThreshould ? parseFloat(formData.xtcThreshould) : undefined,
        },
    };

    return controller.handle(request);
}
