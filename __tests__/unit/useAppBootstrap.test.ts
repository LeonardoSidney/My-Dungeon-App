import { renderHook, waitFor } from '@testing-library/react-native';
import { HOME_DRAFT_ID } from '@domain/constants/draft';
import type { AppControllers } from '@presentation/providers/appControllers';
import { showError } from '@presentation/utils/showError';
import { runSeed, runStorageMigration } from '@src/migration';
import { useAppBootstrap } from '@src/useAppBootstrap';

jest.mock('@src/migration', () => ({
    runSeed: jest.fn(),
    runStorageMigration: jest.fn(),
}));

jest.mock('@presentation/utils/showError', () => ({
    showError: jest.fn(),
}));

const mockRunSeed = runSeed as jest.Mock;
const mockRunStorageMigration = runStorageMigration as jest.Mock;
const mockShowError = showError as jest.Mock;

function buildControllers () {
    const recoverInterruptedReplies = { handle: jest.fn().mockResolvedValue({ success: true }) };
    const saveDraft = { handle: jest.fn().mockResolvedValue({ success: true }) };
    const alert = { handle: jest.fn() };
    const controllers = { alert, recoverInterruptedReplies, saveDraft } as unknown as AppControllers;
    return { controllers, recoverInterruptedReplies, saveDraft, alert };
}

describe('useAppBootstrap', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRunStorageMigration.mockResolvedValue({ success: true });
        mockRunSeed.mockResolvedValue({ success: true });
    });

    it('runs the migration, then the seed, then the recovery', async () => {
        const { controllers, recoverInterruptedReplies } = buildControllers();
        const calls: string[] = [];
        mockRunStorageMigration.mockImplementation(async () => {
            calls.push('migration');
            return { success: true };
        });
        mockRunSeed.mockImplementation(async () => {
            calls.push('seed');
            return { success: true };
        });
        recoverInterruptedReplies.handle.mockImplementation(async () => {
            calls.push('recovery');
            return { success: true };
        });

        await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(calls).toEqual(['migration', 'seed', 'recovery']));
    });

    it('reports the storage as ready once the migration succeeds', async () => {
        const { controllers } = buildControllers();

        const view = await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(view.result.current).toBe(true));
    });

    it('stops everything and keeps the storage closed when the migration fails', async () => {
        const { controllers, recoverInterruptedReplies, alert } = buildControllers();
        mockRunStorageMigration.mockResolvedValue({ success: false, error: 'disk full' });

        const view = await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(alert, 'disk full', 'Failed to migrate the stored data'));
        expect(view.result.current).toBe(false);
        expect(mockRunSeed).not.toHaveBeenCalled();
        expect(recoverInterruptedReplies.handle).not.toHaveBeenCalled();
    });

    it('saves the seeded prompt as the initial draft', async () => {
        const { controllers, saveDraft } = buildControllers();
        mockRunSeed.mockResolvedValue({ success: true, prompt: 'Once upon a time' });

        await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(saveDraft.handle).toHaveBeenCalledWith({ draftId: HOME_DRAFT_ID, content: 'Once upon a time', onlyIfMissing: true }));
    });

    it('reports a draft that cannot be saved', async () => {
        const { controllers, saveDraft, alert } = buildControllers();
        mockRunSeed.mockResolvedValue({ success: true, prompt: 'Once upon a time' });
        saveDraft.handle.mockResolvedValue({ success: false, error: 'disk full' });

        await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(alert, 'disk full', 'Failed to save the initial draft'));
    });

    it('reports a seed failure and still recovers the replies', async () => {
        const { controllers, recoverInterruptedReplies, alert } = buildControllers();
        mockRunSeed.mockResolvedValue({ success: false, error: 'offline' });

        await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(recoverInterruptedReplies.handle).toHaveBeenCalled());
        expect(mockShowError).toHaveBeenCalledWith(alert, 'offline', 'Failed to seed data');
    });

    it('reports a recovery failure', async () => {
        const { controllers, recoverInterruptedReplies, alert } = buildControllers();
        recoverInterruptedReplies.handle.mockResolvedValue({ success: false, error: 'corrupted' });

        await renderHook(() => useAppBootstrap(controllers));

        await waitFor(() => expect(mockShowError).toHaveBeenCalledWith(alert, 'corrupted', 'Failed to recover interrupted replies'));
    });
});
