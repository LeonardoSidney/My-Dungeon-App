import { Alert } from 'react-native';
import { Sampler } from '@domain/entities';
import { Dispatch, SetStateAction } from 'react';
import { eraseSamplerController } from '@infra/container';
import { loadSamplers } from './loadSamplers';

export async function onEraseSampler (
    sampler: Sampler,
    setSamplers: Dispatch<SetStateAction<Sampler[]>>
) {
    const ctrl = eraseSamplerController();
    const response = await ctrl.handle(sampler.id);
    if (!response.success) {
        Alert.alert('Erro', response.error ?? 'Failed to erase sampler');
        return;
    }
    await loadSamplers(setSamplers);
}
