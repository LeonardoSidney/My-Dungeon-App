import { IAlertController } from '@domain/controllers';

export const ERROR_TITLE = 'Erro';

export function showError (alert: IAlertController, error: string | undefined, fallback: string): void {
    alert.handle({ title: ERROR_TITLE, message: error ?? fallback });
}
