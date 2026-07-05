import { CreateItemServiceResponse } from '@domain/services';
import { createItemHelper } from './createItemHelper';

export function createItemServiceResponseHelper(overrides?: Partial<CreateItemServiceResponse>): CreateItemServiceResponse {
    return {
        success: true,
        item: createItemHelper(),
        ...overrides
    };
}
