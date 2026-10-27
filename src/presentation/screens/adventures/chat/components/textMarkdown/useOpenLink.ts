import { useCallback } from 'react';
import { Linking } from 'react-native';
import { AlertActionStyleEnum } from '@domain/use-cases';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { LinkElement } from './types';

export function useOpenLink (): (link: LinkElement) => void {
    const { alert } = useControllers();

    return useCallback((link: LinkElement) => {
        const openLink = () => {
            Linking.openURL(link.url).catch(() => {
                alert.handle({ title: 'Link', message: `Could not open ${link.host}.` });
            });
        };

        alert.handle({
            title: 'Open link?',
            message: `This link leaves the app and opens ${link.host}.`,
            actions: [
                { label: 'Cancel', style: AlertActionStyleEnum.CANCEL },
                { label: 'Open', onPress: openLink },
            ],
        });
    }, [alert]);
}
