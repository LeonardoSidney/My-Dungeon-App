import { eraseStatusController } from '@infra/container';

export async function onErase (statusId: string) {
    const controller = eraseStatusController();
    return controller.handle(statusId);
}
